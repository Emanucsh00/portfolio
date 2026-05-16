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
  description: '',
  badge_color: '',
  is_public: true,
  display_order: 0
});

const columns = [
  { name: 'name', label: 'Habilidad', field: 'name', align: 'left' },
  { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' }
];

function resetForm() {
  form.value = {
    id: '',
    name: '',
    description: '',
    badge_color: '',
    is_public: true,
    display_order: 0
  };
}

async function load() {
  const response = await listAdminResource('soft-skills');
  items.value = response.data;
}

function edit(item) {
  form.value = { ...item };
  dialog.value = true;
}

async function save() {
  if (form.value.id) {
    await updateAdminResource('soft-skills', form.value.id, form.value);
  } else {
    await createAdminResource('soft-skills', form.value);
  }
  dialog.value = false;
  await load();
}

async function remove(id) {
  const result = await Swal.fire({ title: '¿Eliminar soft skill?', icon: 'warning', showCancelButton: true });
  if (result.isConfirmed) {
    await deleteAdminResource('soft-skills', id);
    await load();
  }
}

onMounted(load);
</script>

<template>
  <q-page class="admin-page">
    <div class="page-title-block row items-center justify-between">
      <div>
        <div class="eyebrow">ADMIN SOFT SKILLS</div>
        <h1>Gestión de habilidades blandas</h1>
      </div>
      <q-btn color="primary" label="Nueva habilidad" @click="resetForm(); dialog = true" />
    </div>

    <div class="table-panel">
      <q-table flat bordered :rows="items" :columns="columns" row-key="id">
        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense icon="edit" @click="edit(props.row)" />
            <q-btn flat round dense icon="delete" color="negative" @click="remove(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 640px; max-width: 90vw">
        <q-card-section class="form-grid">
          <q-input v-model="form.name" label="Nombre" outlined />
          <q-input v-model="form.description" label="Descripción" outlined type="textarea" />
          <q-input v-model="form.badge_color" label="Color badge" outlined />
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
