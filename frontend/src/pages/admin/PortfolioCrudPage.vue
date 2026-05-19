<script setup>
import { computed, onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import { storeToRefs } from 'pinia';
import { usePortfolioStore } from '../../stores/portfolio.store';

const store = usePortfolioStore();
const { currentItem, saving } = storeToRefs(store);

const modalOpen = ref(false);
const modalMode = ref('create');
const imagePreviewError = ref(false);

const columns = [
  { name: 'title', label: 'Proyecto', field: 'title', align: 'left' },
  { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
  { name: 'main_technology', label: 'Tecnologia', field: 'main_technology', align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', align: 'left' },
  { name: 'is_public', label: 'Publico', field: 'is_public', align: 'center' },
  { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' }
];

const statusOptions = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Publicado', value: 'published' },
  { label: 'Archivado', value: 'archived' }
];

const statusFilterOptions = [
  { label: 'Todos', value: '' },
  ...statusOptions
];

const visibilityOptions = [
  { label: 'Todos', value: '' },
  { label: 'Publico', value: 'true' },
  { label: 'Privado', value: 'false' }
];

const categoryOptions = [
  'Web App', 'Mobile App', 'API / Backend', 'Full Stack',
  'Data / ML', 'DevOps', 'CLI Tool', 'Otro'
];

const projectTypeOptions = [
  'Personal', 'Freelance', 'Academico', 'Empresarial', 'Open Source'
];

const techOptions = [
  'Vue 3', 'React', 'Angular', 'Node.js', 'Express', 'NestJS',
  'Python', 'Django', 'FastAPI', 'PostgreSQL', 'MySQL', 'MongoDB',
  'Redis', 'Docker', 'Firebase', 'Quasar', 'TypeScript', 'JavaScript',
  'Sequelize', 'JWT', 'REST', 'GraphQL', 'AWS', 'GCP', 'Azure'
];

const featureOptions = [
  'Autenticacion', 'CRUD completo', 'API REST', 'GraphQL', 'WebSockets',
  'Notificaciones', 'Pagos en linea', 'Carga de archivos', 'Dashboard',
  'Roles y permisos', 'Modo oscuro', 'Internacionalizacion', 'SEO',
  'PWA', 'Exportar PDF', 'Cache', 'CI/CD', 'Testing automatizado'
];

const modalTitle = computed(() => {
  if (modalMode.value === 'read') return 'Ver registro';
  if (modalMode.value === 'edit') return 'Editar registro';
  return 'Crear registro';
});

const readOnly = computed(() => modalMode.value === 'read');

const tablePagination = computed(() => ({
  page: store.pagination.page,
  rowsPerPage: store.pagination.limit,
  rowsNumber: store.pagination.total
}));

const statCards = computed(() => {
  const rows = store.items || [];

  return [
    { label: 'Total registros', value: store.pagination.total || rows.length || 0 },
    { label: 'Publicados', value: rows.filter((item) => item.status === 'published').length },
    { label: 'Borradores', value: rows.filter((item) => item.status === 'draft').length },
    { label: 'Publicos', value: rows.filter((item) => item.is_public).length }
  ];
});

const difficultyRating = computed({
  get() {
    const reverseMap = { Basico: 1, Intermedio: 2, Avanzado: 3, Expert: 4 };
    return reverseMap[currentItem.value.difficulty_level] || 0;
  },
  set(value) {
    const labels = { 1: 'Basico', 2: 'Intermedio', 3: 'Avanzado', 4: 'Expert' };
    currentItem.value.difficulty_level = labels[value] || '';
  }
});

onMounted(async () => {
  await store.fetchItems();
});

function resetModalState() {
  imagePreviewError.value = false;
}

function openCreateModal() {
  store.resetCurrentItem();
  modalMode.value = 'create';
  resetModalState();
  modalOpen.value = true;
}

async function openReadModal(id) {
  await store.fetchItem(id);
  modalMode.value = 'read';
  resetModalState();
  modalOpen.value = true;
}

async function openEditModal(id) {
  await store.fetchItem(id);
  modalMode.value = 'edit';
  resetModalState();
  modalOpen.value = true;
}

function closeModal() {
  modalOpen.value = false;
  store.resetCurrentItem();
  resetModalState();
}

function enableEditMode() {
  modalMode.value = 'edit';
}

async function applyFilters() {
  store.pagination.page = 1;
  await store.fetchItems();
}

async function clearFilters() {
  store.filters.search = '';
  store.filters.status = '';
  store.filters.category = '';
  store.filters.isPublic = '';
  store.pagination.page = 1;
  await store.fetchItems();
}

async function onTableRequest(props) {
  store.pagination.page = props.pagination.page;
  store.pagination.limit = props.pagination.rowsPerPage;
  await store.fetchItems();
}

async function saveRecord() {
  try {
    const saved = await store.saveCurrentItem();
    await store.fetchItems();
    await store.fetchItem(saved.id);
    modalMode.value = 'edit';
    Swal.fire('Guardado', 'El registro fue almacenado correctamente.', 'success');
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || error.message, 'error');
  }
}

async function removeRecord(id) {
  const result = await Swal.fire({
    title: 'Eliminar registro',
    text: 'Este registro se eliminara de la base de datos.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) {
    return;
  }

  await store.removeItem(id);
  await store.fetchItems();

  if (currentItem.value.id === id) {
    closeModal();
  }
}

async function deactivateRecord(row) {
  await store.updateStatus(row.id, {
    status: 'archived',
    is_public: false
  });
  await store.fetchItems();
}
</script>

<template>
  <q-page class="admin-crud-page-v2">
    <div class="crudv2-shell">
      <section class="crudv2-hero">


        <div class="crudv2-hero-actions">
          <q-btn unelevated color="primary" icon="add" label="Crear registro" @click="openCreateModal" />
          <q-btn flat color="primary" icon="refresh" label="Actualizar tabla" @click="store.fetchItems()" />
        </div>
      </section>

      <section class="crudv2-stats">
        <article v-for="card in statCards" :key="card.label" class="crudv2-stat-card">
          <span>{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
        </article>
      </section>

      <section class="crudv2-table-card">
        <div class="crudv2-card-head">
          <div>
            <span class="crudv2-section-label">Buscadores y filtros</span>
            <strong>Registros guardados</strong>
          </div>
          <q-btn unelevated color="primary" icon="post_add" label="Nuevo" @click="openCreateModal" />
        </div>

        <div class="crudv2-filter-grid">
          <q-input v-model="store.filters.search" outlined dense label="Buscar por titulo, subtitulo o resumen" class="crudv2-filter-wide" />
          <q-select
            v-model="store.filters.status"
            outlined
            dense
            emit-value
            map-options
            label="Estado"
            :options="statusFilterOptions"
          />
          <q-input v-model="store.filters.category" outlined dense label="Categoria" />
          <q-select
            v-model="store.filters.isPublic"
            outlined
            dense
            emit-value
            map-options
            label="Visibilidad"
            :options="visibilityOptions"
          />
          <div class="crudv2-filter-actions">
            <q-btn color="secondary" label="Filtrar" @click="applyFilters" />
            <q-btn flat color="grey-7" label="Limpiar" @click="clearFilters" />
          </div>
        </div>

        <div class="crudv2-table-wrap">
          <q-table
            flat
            :rows="store.items"
            :columns="columns"
            row-key="id"
            :loading="store.loading"
            :pagination="tablePagination"
            class="crudv2-table"
            @request="onTableRequest"
          >
            <template #body-cell-title="props">
              <q-td :props="props">
                <div class="crudv2-title-cell">
                  <strong>{{ props.row.title }}</strong>
                  <span>{{ props.row.summary || 'Sin resumen disponible' }}</span>
                </div>
              </q-td>
            </template>

            <template #body-cell-category="props">
              <q-td :props="props">
                <span class="crudv2-chip">{{ props.row.category || 'Sin categoria' }}</span>
              </q-td>
            </template>

            <template #body-cell-main_technology="props">
              <q-td :props="props">
                {{ props.row.main_technology || 'Sin tecnologia' }}
              </q-td>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props">
                <span class="crudv2-status">{{ props.row.status }}</span>
              </q-td>
            </template>

            <template #body-cell-is_public="props">
              <q-td :props="props" class="text-center">
                <span :class="props.row.is_public ? 'crudv2-bool crudv2-bool--on' : 'crudv2-bool'">
                  {{ props.row.is_public ? 'Si' : 'No' }}
                </span>
              </q-td>
            </template>

            <template #body-cell-actions="props">
              <q-td :props="props" class="text-right">
                <div class="crudv2-row-actions">
                  <q-btn dense flat color="info" icon="visibility" label="Ver" @click="openReadModal(props.row.id)" />
                  <q-btn dense flat color="secondary" icon="edit" label="Editar" @click="openEditModal(props.row.id)" />
                  <q-btn dense flat color="warning" icon="block" label="Desactivar" @click="deactivateRecord(props.row)" />
                  <q-btn dense flat color="negative" icon="delete" label="Eliminar" @click="removeRecord(props.row.id)" />
                </div>
              </q-td>
            </template>

            <template #no-data>
              <div class="crudv2-empty">
                <q-icon name="table_rows" size="42px" />
                <strong>No hay registros guardados</strong>
                <p>Crea uno nuevo desde el boton superior para abrir el modal y guardar datos de ejemplo.</p>
              </div>
            </template>
          </q-table>
        </div>
      </section>
    </div>

    <q-dialog v-model="modalOpen" persistent>
      <q-card class="crudv2-modal">
        <div class="crudv2-modal-head">
          <div>
            <span class="crudv2-section-label">Formulario de ejemplo</span>
            <strong>{{ modalTitle }}</strong>
          </div>

          <div class="crudv2-modal-actions">
            <q-btn v-if="readOnly && currentItem.id" flat color="secondary" icon="edit" label="Editar" @click="enableEditMode" />
            <q-btn flat color="grey-7" icon="close" label="Cerrar" @click="closeModal" />
            <q-btn unelevated color="primary" icon="save" label="Guardar" :disable="readOnly" :loading="saving" @click="saveRecord" />
          </div>
        </div>

        <div class="crudv2-modal-scroll">
          <section class="crudv2-form-section">
            <h3>1. Estado y controles</h3>
            <div class="crudv2-form-grid">
              <q-select v-model="currentItem.status" outlined emit-value map-options label="Estado" :options="statusOptions" :disable="readOnly" />
              <q-input v-model.number="currentItem.display_order" outlined type="number" label="Orden de despliegue" :disable="readOnly" />
              <div class="crudv2-inline-field">
                <q-toggle v-model="currentItem.is_public" color="positive" :disable="readOnly" />
                <span>Visible al publico</span>
              </div>
              <div class="crudv2-inline-field">
                <span>Dificultad</span>
                <q-rating v-model="difficultyRating" :max="4" size="28px" color="amber-8" icon="star_border" icon-selected="star" :readonly="readOnly" />
              </div>
            </div>
          </section>

          <section class="crudv2-form-section">
            <h3>2. Inputs base</h3>
            <div class="crudv2-form-grid">
              <q-input v-model="currentItem.title" outlined label="Titulo *" maxlength="120" counter :disable="readOnly" class="crudv2-span-2" />
              <q-input v-model="currentItem.subtitle" outlined label="Subtitulo" :disable="readOnly" />
              <q-input v-model="currentItem.slug" outlined label="Slug *" :disable="readOnly" />
              <q-input v-model="currentItem.summary" outlined type="textarea" autogrow label="Resumen *" :disable="readOnly" class="crudv2-span-2" />
              <q-input v-model="currentItem.description" outlined type="textarea" autogrow label="Descripcion *" :disable="readOnly" class="crudv2-span-2" />
            </div>
          </section>

          <section class="crudv2-form-section">
            <h3>3. Selectores y multi-select</h3>
            <div class="crudv2-form-grid">
              <q-select v-model="currentItem.category" outlined label="Categoria" :options="categoryOptions" clearable :disable="readOnly" />
              <q-select v-model="currentItem.project_type" outlined label="Tipo de proyecto" :options="projectTypeOptions" clearable :disable="readOnly" />
              <q-input v-model="currentItem.main_technology" outlined label="Tecnologia principal *" :disable="readOnly" />
              <q-select
                v-model="currentItem.secondary_technologies"
                outlined
                multiple
                use-chips
                use-input
                new-value-mode="add-unique"
                label="Tecnologias secundarias"
                :options="techOptions"
                :disable="readOnly"
                class="crudv2-span-2"
              />
            </div>
          </section>

          <section class="crudv2-form-section">
            <h3>4. URLs e imagen</h3>
            <div class="crudv2-form-grid">
              <q-input v-model="currentItem.repository_url" outlined type="url" label="Repositorio URL" :disable="readOnly" />
              <q-input v-model="currentItem.demo_url" outlined type="url" label="Demo URL" :disable="readOnly" />
              <q-input
                v-model="currentItem.image_url"
                outlined
                type="url"
                label="Imagen URL"
                :disable="readOnly"
                class="crudv2-span-2"
                @update:model-value="imagePreviewError = false"
              />
              <div v-if="currentItem.image_url && !imagePreviewError" class="crudv2-image-preview crudv2-span-2">
                <img :src="currentItem.image_url" alt="Preview" @error="imagePreviewError = true" />
              </div>
              <div v-if="imagePreviewError" class="crudv2-image-error crudv2-span-2">
                No se pudo cargar la imagen desde la URL indicada.
              </div>
            </div>
          </section>

          <section class="crudv2-form-section">
            <h3>5. Contexto del proyecto</h3>
            <div class="crudv2-form-grid">
              <q-input v-model="currentItem.client_name" outlined label="Cliente u organizacion" :disable="readOnly" />
              <q-input v-model="currentItem.role_performed" outlined label="Rol desempenado" :disable="readOnly" />
              <q-input v-model="currentItem.start_date" outlined type="date" label="Fecha de inicio" :disable="readOnly" />
              <q-input v-model="currentItem.end_date" outlined type="date" label="Fecha de fin" :disable="readOnly" />
            </div>
          </section>

          <section class="crudv2-form-section">
            <h3>6. Narrativa y funcionalidades</h3>
            <div class="crudv2-form-grid">
              <q-input v-model="currentItem.objective" outlined type="textarea" autogrow label="Objetivo" :disable="readOnly" />
              <q-input v-model="currentItem.result" outlined type="textarea" autogrow label="Resultado" :disable="readOnly" />
              <q-input v-model="currentItem.learnings" outlined type="textarea" autogrow label="Aprendizajes" :disable="readOnly" class="crudv2-span-2" />
              <q-select
                v-model="currentItem.features"
                outlined
                multiple
                use-chips
                use-input
                new-value-mode="add-unique"
                label="Funcionalidades"
                :options="featureOptions"
                :disable="readOnly"
                class="crudv2-span-2"
              />
            </div>
          </section>

          <section class="crudv2-form-section crudv2-form-section--private">
            <h3>7. Notas internas</h3>
            <div class="crudv2-form-grid">
              <q-input v-model="currentItem.internal_notes" outlined type="textarea" autogrow label="Notas internas" :disable="readOnly" class="crudv2-span-2" />
            </div>
          </section>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<style scoped>
.admin-crud-page-v2 {
  padding: 24px;
  color: #0f172a;
}

.crudv2-shell {
  width: min(1480px, 100%);
  margin: 0 auto;
}

.crudv2-hero,
.crudv2-table-card,
.crudv2-stat-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(203, 213, 225, 0.95);
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.08);
}

.crudv2-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 28px;
  border-radius: 28px;
}

.crudv2-hero-copy {
  min-width: 0;
}

.crudv2-kicker,
.crudv2-section-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #2563eb;
}

.crudv2-hero-copy h1 {
  margin: 12px 0 10px;
  font-size: clamp(2rem, 4vw, 3.1rem);
  line-height: 1.04;
  color: #0f172a;
}

.crudv2-hero-copy p {
  margin: 0;
  max-width: 860px;
  color: #475569;
  line-height: 1.72;
}

.crudv2-hero-actions,
.crudv2-filter-actions,
.crudv2-row-actions,
.crudv2-modal-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.crudv2-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.crudv2-stat-card {
  padding: 20px 22px;
  border-radius: 22px;
}

.crudv2-stat-card span {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2563eb;
}

.crudv2-stat-card strong {
  display: block;
  margin-top: 12px;
  font-size: clamp(1.8rem, 2.5vw, 2.4rem);
  color: #0f172a;
}

.crudv2-table-card {
  margin-top: 18px;
  padding: 24px;
  border-radius: 28px;
}

.crudv2-card-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.crudv2-card-head strong {
  display: block;
  margin-top: 8px;
  font-size: 1.12rem;
  color: #0f172a;
}

.crudv2-filter-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.crudv2-filter-grid > * {
  grid-column: span 2;
}

.crudv2-filter-wide {
  grid-column: span 4 !important;
}

.crudv2-filter-actions {
  grid-column: span 2;
  justify-content: flex-end;
}

.crudv2-table-wrap {
  overflow: hidden;
  border-radius: 20px;
  border: 1px solid rgba(226, 232, 240, 1);
}

.crudv2-table {
  background: white;
}

.crudv2-table :deep(th) {
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border-color: #dbeafe;
}

.crudv2-table :deep(td) {
  border-color: #e2e8f0;
  color: #334155;
}

.crudv2-title-cell {
  display: grid;
  gap: 6px;
}

.crudv2-title-cell strong {
  color: #0f172a;
}

.crudv2-title-cell span {
  color: #64748b;
  line-height: 1.5;
}

.crudv2-chip,
.crudv2-status,
.crudv2-bool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.crudv2-chip {
  background: #eff6ff;
  color: #2563eb;
}

.crudv2-status {
  background: #ecfeff;
  color: #0f766e;
}

.crudv2-bool {
  background: #e2e8f0;
  color: #475569;
}

.crudv2-bool--on {
  background: #dcfce7;
  color: #15803d;
}

.crudv2-empty {
  padding: 36px 18px;
  display: grid;
  gap: 10px;
  place-items: center;
  text-align: center;
  color: #64748b;
}

.crudv2-empty strong {
  color: #0f172a;
}

.crudv2-empty .q-icon {
  color: #2563eb;
}

.crudv2-modal {
  width: min(1180px, 96vw);
  max-width: 1180px;
  border-radius: 28px;
  overflow: hidden;
  background: #f8fafc;
}

.crudv2-modal-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  padding: 24px 26px;
  background: linear-gradient(135deg, #eff6ff, #f8fafc);
  border-bottom: 1px solid #dbeafe;
}

.crudv2-modal-head strong {
  display: block;
  margin-top: 8px;
  color: #0f172a;
  font-size: 1.22rem;
}

.crudv2-modal-scroll {
  max-height: min(78vh, 900px);
  overflow: auto;
  padding: 24px;
}

.crudv2-form-section {
  padding: 20px;
  border-radius: 22px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
}

.crudv2-form-section + .crudv2-form-section {
  margin-top: 16px;
}

.crudv2-form-section h3 {
  margin: 0 0 16px;
  color: #0f172a;
  font-size: 1rem;
}

.crudv2-form-section--private {
  background: #fff7f7;
  border-color: #fecaca;
}

.crudv2-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.crudv2-form-grid .q-field,
.crudv2-form-grid .q-field__control,
.crudv2-form-grid .q-field__native,
.crudv2-form-grid .q-field__input {
  min-width: 0;
}

.crudv2-inline-field {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-height: 56px;
  color: #0f172a;
  font-weight: 600;
}

.crudv2-span-2 {
  grid-column: 1 / -1;
}

.crudv2-image-preview {
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
}

.crudv2-image-preview img {
  width: 100%;
  height: 240px;
  object-fit: cover;
}

.crudv2-image-error {
  padding: 14px 16px;
  border-radius: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

@media (max-width: 1100px) {
  .crudv2-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .crudv2-filter-grid > * {
    grid-column: span 3;
  }

  .crudv2-filter-wide {
    grid-column: span 6 !important;
  }
}

@media (max-width: 768px) {
  .admin-crud-page-v2 {
    padding: 14px;
  }

  .crudv2-hero,
  .crudv2-card-head,
  .crudv2-modal-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .crudv2-hero-actions,
  .crudv2-filter-actions,
  .crudv2-modal-actions {
    width: 100%;
  }

  .crudv2-hero-actions :deep(.q-btn),
  .crudv2-filter-actions :deep(.q-btn),
  .crudv2-modal-actions :deep(.q-btn) {
    width: 100%;
  }

  .crudv2-stats,
  .crudv2-filter-grid,
  .crudv2-form-grid {
    grid-template-columns: 1fr;
  }

  .crudv2-filter-grid > *,
  .crudv2-filter-wide,
  .crudv2-filter-actions,
  .crudv2-span-2 {
    grid-column: span 1 !important;
  }

  .crudv2-row-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .crudv2-modal {
    width: 96vw;
  }
}
</style>
