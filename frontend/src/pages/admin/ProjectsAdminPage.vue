<script setup>
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import {
  createAdminResource,
  deleteAdminResource,
  listAdminResource,
  updateAdminResource
} from '../../services/admin.service';

const items = ref([]);
const dialog = ref(false);
const form = ref({
  id: '',
  name: '',
  slug: '',
  summary: '',
  repository_url: '',
  demo_url: '',
  technologies: '',
  status: 'draft',
  is_public: true,
  display_order: 0
});

const columns = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', align: 'left' },
  { name: 'is_public', label: 'Público', field: 'is_public', align: 'left' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' }
];

function resetForm() {
  form.value = {
    id: '',
    name: '',
    slug: '',
    summary: '',
    repository_url: '',
    demo_url: '',
    technologies: '',
    status: 'draft',
    is_public: true,
    display_order: 0
  };
}

async function load() {
  const response = await listAdminResource('projects');
  items.value = response.data;
}

function openCreate() {
  resetForm();
  dialog.value = true;
}

function edit(item) {
  form.value = {
    ...item,
    technologies: (item.technologies || []).join(', ')
  };
  dialog.value = true;
}

async function save() {
  const payload = {
    ...form.value,
    technologies: form.value.technologies
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  };

  if (payload.id) {
    await updateAdminResource('projects', payload.id, payload);
  } else {
    await createAdminResource('projects', payload);
  }

  dialog.value = false;
  await load();
}

async function remove(id) {
  const result = await Swal.fire({
    title: '¿Eliminar proyecto?',
    icon: 'warning',
    showCancelButton: true
  });

  if (result.isConfirmed) {
    await deleteAdminResource('projects', id);
    await load();
  }
}

onMounted(load);
</script>

<template>
  <q-page class="admin-page">
    <div class="admin-page-header">
      <div>
        <div class="eyebrow">ADMIN PROJECTS</div>
        <h1>Gestión de proyectos</h1>
      </div>
      <q-btn color="primary" label="Nuevo proyecto" @click="openCreate" />
    </div>

    <div class="table-panel">
      <q-table flat bordered :rows="items" :columns="columns" row-key="id">
        <template #body-cell-is_public="props">
          <q-td :props="props">
            <q-badge :color="props.row.is_public ? 'positive' : 'grey-7'">
              {{ props.row.is_public ? 'Sí' : 'No' }}
            </q-badge>
          </q-td>
        </template>
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense icon="edit" @click="edit(props.row)" />
            <q-btn flat round dense icon="delete" color="negative" @click="remove(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="width: min(720px, 92vw)">
        <q-card-section>
          <div class="text-h6">{{ form.id ? 'Editar proyecto' : 'Nuevo proyecto' }}</div>
        </q-card-section>
        <q-card-section class="form-grid">
          <q-input v-model="form.name" label="Nombre" outlined />
          <q-input v-model="form.slug" label="Slug" outlined />
          <q-input v-model="form.summary" label="Resumen" outlined type="textarea" />
          <q-input v-model="form.technologies" label="Tecnologías (coma separadas)" outlined />
          <q-input v-model="form.repository_url" label="Repositorio URL" outlined />
          <q-input v-model="form.demo_url" label="Demo URL" outlined />
          <q-select v-model="form.status" :options="['draft', 'published', 'archived']" label="Estado" outlined />
          <q-toggle v-model="form.is_public" label="Público" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="primary" label="Guardar" @click="save" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
