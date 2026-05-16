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
  category: '',
  icon: '',
  level: '',
  color: '',
  is_public: true,
  display_order: 0
});

const columns = [
  { name: 'name', label: 'Tecnología', field: 'name', align: 'left' },
  { name: 'category', label: 'Categoría', field: 'category', align: 'left' },
  { name: 'level', label: 'Nivel', field: 'level', align: 'left' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' }
];

function resetForm() {
  form.value = {
    id: '',
    name: '',
    category: '',
    icon: '',
    level: '',
    color: '',
    is_public: true,
    display_order: 0
  };
}

async function load() {
  const response = await listAdminResource('technologies');
  items.value = response.data;
}

function edit(item) {
  form.value = { ...item };
  dialog.value = true;
}

async function save() {
  if (form.value.id) {
    await updateAdminResource('technologies', form.value.id, form.value);
  } else {
    await createAdminResource('technologies', form.value);
  }
  dialog.value = false;
  await load();
}

async function remove(id) {
  const result = await Swal.fire({ title: '¿Eliminar tecnología?', icon: 'warning', showCancelButton: true });
  if (result.isConfirmed) {
    await deleteAdminResource('technologies', id);
    await load();
  }
}

onMounted(load);
</script>

<template>
  <q-page class="admin-page">
    <div class="page-title-block row items-center justify-between">
      <div>
        <div class="eyebrow">ADMIN TECHNOLOGIES</div>
        <h1>Gestión de tecnologías</h1>
      </div>
      <q-btn color="primary" label="Nueva tecnología" @click="resetForm(); dialog = true" />
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
          <q-input v-model="form.category" label="Categoría" outlined />
          <q-input v-model="form.icon" label="Icono" outlined />
          <q-input v-model="form.level" label="Nivel" outlined />
          <q-input v-model="form.color" label="Color" outlined />
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
