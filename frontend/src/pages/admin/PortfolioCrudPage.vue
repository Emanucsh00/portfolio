<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { usePortfolioStore } from '../../stores/portfolio.store';

const router = useRouter();
const store = usePortfolioStore();
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'title',
  descending: false
});

const columns = [
  { name: 'title', label: 'Titulo', field: 'title', align: 'left' },
  { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', align: 'left' },
  { name: 'is_public', label: 'Publico', field: 'is_public', align: 'left' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' }
];

onMounted(async () => {
  await store.fetchItems();
});

async function applyFilters() {
  store.pagination.page = 1;
  await store.fetchItems();
}

async function onPageChange(props) {
  store.pagination.page = props.pagination.page;
  store.pagination.limit = props.pagination.rowsPerPage;
  await store.fetchItems();
}

async function removeItem(id) {
  const result = await Swal.fire({
    title: 'Eliminar registro',
    text: 'El registro se marcara como eliminado en el backend.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar'
  });

  if (result.isConfirmed) {
    await store.removeItem(id);
    await store.fetchItems();
  }
}
</script>

<template>
  <q-page class="admin-page">
    <div class="page-title-block row items-center justify-between q-col-gutter-md">
      <div>
        <div class="eyebrow">CRUD PRINCIPAL</div>
        <h1>Registros del portafolio</h1>
        <p>25 campos conectados entre frontend, backend y base de datos con JWT en cada solicitud.</p>
      </div>
      <q-btn color="primary" label="Nuevo registro" icon="add" @click="router.push('/admin/new')" />
    </div>

    <div class="filters-panel">
      <q-input v-model="store.filters.search" outlined dense label="Buscar" class="filter-control" />
      <q-select
        v-model="store.filters.status"
        outlined
        dense
        label="Estado"
        class="filter-control"
        :options="['', 'draft', 'published', 'archived']"
      />
      <q-input v-model="store.filters.category" outlined dense label="Categoria" class="filter-control" />
      <q-select
        v-model="store.filters.isPublic"
        outlined
        dense
        label="Visibilidad"
        class="filter-control"
        :options="[
          { label: 'Todos', value: '' },
          { label: 'Publico', value: 'true' },
          { label: 'Privado', value: 'false' }
        ]"
        emit-value
        map-options
      />
      <q-btn color="secondary" label="Filtrar" @click="applyFilters" />
    </div>

    <div class="table-panel">
      <q-table
        flat
        bordered
        wrap-cells
        :rows="store.items"
        :columns="columns"
        row-key="id"
        :loading="store.loading"
        :pagination="pagination"
        @request="onPageChange"
      >
        <template #body-cell-is_public="props">
          <q-td :props="props">
            <q-badge :color="props.row.is_public ? 'positive' : 'grey-7'" :text-color="props.row.is_public ? 'dark' : 'white'">
              {{ props.row.is_public ? 'Si' : 'No' }}
            </q-badge>
          </q-td>
        </template>

        <template #body-cell-actions="props">
          <q-td :props="props" class="text-right">
            <q-btn flat round dense icon="visibility" @click="router.push(`/admin/${props.row.id}`)" />
            <q-btn flat round dense icon="edit" color="secondary" @click="router.push(`/admin/${props.row.id}`)" />
            <q-btn flat round dense icon="delete" color="negative" @click="removeItem(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
