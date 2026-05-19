<script setup>
import { computed, onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';
import { usePortfolioStore } from '../../stores/portfolio.store';

const router = useRouter();
const auth = useAuthStore();
const store = usePortfolioStore();
const { currentItem, saving } = storeToRefs(store);

const modalOpen = ref(false);
const modalMode = ref('create');
const multiselectOpen = ref({});
const multiselectSearch = ref({});

const statusOptions = ['draft', 'published', 'archived'];
const categoryOptions = ['Web App', 'Mobile App', 'API / Backend', 'Full Stack', 'Data / ML', 'DevOps', 'CLI Tool', 'Otro'];
const projectTypeOptions = ['Personal', 'Freelance', 'Academico', 'Empresarial', 'Open Source'];
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
const difficultyOptions = ['Basico', 'Intermedio', 'Avanzado', 'Expert'];
const booleanOptions = [
  { label: 'Si', value: true },
  { label: 'No', value: false }
];

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2200,
  timerProgressBar: true
});

const demoFields = [
  { key: 'title', label: 'Campo 01', title: 'Input text', description: 'Ejemplo de campo de texto simple para nombres o titulos.', type: 'text', placeholder: 'Escribe texto libre', span: 1 },
  { key: 'subtitle', label: 'Campo 02', title: 'Input email', description: 'Ejemplo de campo para correos electronicos.', type: 'email', placeholder: 'correo@ejemplo.com', span: 1 },
  { key: 'slug', label: 'Campo 03', title: 'Input usuario', description: 'Ejemplo de campo alfanumerico sin espacios.', type: 'text', placeholder: 'usuario-demo', span: 1 },
  { key: 'summary', label: 'Campo 04', title: 'Textarea corta', description: 'Ejemplo de area de texto para observaciones breves.', type: 'textarea', placeholder: 'Escribe una descripcion corta', span: 2, rows: 3 },
  { key: 'description', label: 'Campo 05', title: 'Textarea larga', description: 'Ejemplo de area de texto para contenido mas extenso.', type: 'textarea', placeholder: 'Escribe un contenido largo', span: 2, rows: 5 },
  { key: 'category', label: 'Campo 06', title: 'Selector simple', description: 'Ejemplo de select con una opcion a elegir.', type: 'select', options: categoryOptions, placeholder: 'Selecciona una categoria', span: 1 },
  { key: 'project_type', label: 'Campo 07', title: 'Selector simple', description: 'Otro ejemplo de select de una sola opcion.', type: 'select', options: projectTypeOptions, placeholder: 'Selecciona un tipo', span: 1 },
  { key: 'main_technology', label: 'Campo 08', title: 'Input text tecnico', description: 'Ejemplo de input para tecnologia principal o palabra clave.', type: 'text', placeholder: 'Ej: JavaScript', span: 1 },
  { key: 'secondary_technologies', label: 'Campo 09', title: 'Selector multiple', description: 'Ejemplo de campo multiple para varias opciones.', type: 'multiselect', options: techOptions, span: 2 },
  { key: 'repository_url', label: 'Campo 10', title: 'Input URL', description: 'Ejemplo de campo para enlaces web.', type: 'url', placeholder: 'https://ejemplo.com', span: 1 },
  { key: 'demo_url', label: 'Campo 11', title: 'Input password', description: 'Ejemplo de campo de contrasena; se guarda como texto de demostracion.', type: 'password', placeholder: '********', span: 1 },
  { key: 'image_url', label: 'Campo 12', title: 'Input telefono', description: 'Ejemplo de campo para telefonos o identificadores numericos.', type: 'tel', placeholder: '+502 5555 5555', span: 1 },
  { key: 'client_name', label: 'Campo 13', title: 'Input empresa', description: 'Ejemplo de campo de texto para empresas o instituciones.', type: 'text', placeholder: 'Empresa Demo', span: 1 },
  { key: 'role_performed', label: 'Campo 14', title: 'Input cargo', description: 'Ejemplo de campo para cargos o roles.', type: 'text', placeholder: 'Analista / Desarrollador', span: 1 },
  { key: 'difficulty_level', label: 'Campo 15', title: 'Selector enumerado', description: 'Ejemplo de selector con niveles predefinidos.', type: 'select', options: difficultyOptions, placeholder: 'Selecciona una dificultad', span: 1 },
  { key: 'objective', label: 'Campo 16', title: 'Textarea objetivo', description: 'Ejemplo de textarea para metas u objetivos.', type: 'textarea', placeholder: 'Describe un objetivo', span: 1, rows: 3 },
  { key: 'result', label: 'Campo 17', title: 'Textarea resultado', description: 'Ejemplo de textarea para resultados.', type: 'textarea', placeholder: 'Describe un resultado', span: 1, rows: 3 },
  { key: 'learnings', label: 'Campo 18', title: 'Textarea aprendizajes', description: 'Ejemplo de textarea para notas y aprendizajes.', type: 'textarea', placeholder: 'Escribe aprendizajes', span: 2, rows: 4 },
  { key: 'features', label: 'Campo 19', title: 'Selector multiple', description: 'Ejemplo de multiselect para caracteristicas o tags.', type: 'multiselect', options: featureOptions, span: 2 },
  { key: 'start_date', label: 'Campo 20', title: 'Input date', description: 'Ejemplo de campo para fechas.', type: 'date', span: 1 },
  { key: 'end_date', label: 'Campo 21', title: 'Input date', description: 'Segundo ejemplo de campo de fecha.', type: 'date', span: 1 },
  { key: 'status', label: 'Campo 22', title: 'Selector de estado', description: 'Ejemplo de selector usado para estados del registro.', type: 'select', options: statusOptions, placeholder: 'Selecciona un estado', span: 1 },
  { key: 'is_public', label: 'Campo 23', title: 'Checkbox', description: 'Ejemplo de campo booleano con casilla de verificacion.', type: 'checkbox', span: 1 },
  { key: 'display_order', label: 'Campo 24', title: 'Input number', description: 'Ejemplo de campo numerico entero.', type: 'number', placeholder: '0', span: 1 },
  { key: 'internal_notes', label: 'Campo 25', title: 'Textarea privada', description: 'Ejemplo de textarea adicional para datos internos.', type: 'textarea', placeholder: 'Escribe cualquier dato adicional', span: 2, rows: 4 }
];

const userMeta = computed(() => ({
  name: auth.user?.full_name || 'Portfolio Admin',
  email: auth.user?.email || 'Sin correo',
  role: auth.user?.role || 'admin'
}));

const modalTitle = computed(() => {
  if (modalMode.value === 'read') return 'Ver registro';
  if (modalMode.value === 'edit') return 'Editar registro';
  return 'Crear registro';
});

const modalReadonly = computed(() => modalMode.value === 'read');

const filteredRows = computed(() => {
  const search = store.filters.search.trim().toLowerCase();

  return (store.items || []).filter((item) => {
    const matchesSearch = !search || [
      item.title,
      item.subtitle,
      item.summary,
      item.main_technology,
      item.category,
      item.client_name
    ].some((value) => String(value || '').toLowerCase().includes(search));

    const matchesStatus = !store.filters.status || item.status === store.filters.status;
    const matchesCategory = !store.filters.category || String(item.category || '').toLowerCase().includes(store.filters.category.toLowerCase());
    const matchesVisibility = store.filters.isPublic === ''
      || String(Boolean(item.is_public)) === store.filters.isPublic;

    return matchesSearch && matchesStatus && matchesCategory && matchesVisibility;
  });
});

const stats = computed(() => {
  const rows = store.items || [];
  return [
    { label: 'Total registros', value: rows.length },
    { label: 'Publicados', value: rows.filter((item) => item.status === 'published').length },
    { label: 'Borradores', value: rows.filter((item) => item.status === 'draft').length },
    { label: 'Publicos', value: rows.filter((item) => item.is_public).length }
  ];
});

onMounted(async () => {
  await store.fetchItems();
});

function resetFilters() {
  store.filters.search = '';
  store.filters.status = '';
  store.filters.category = '';
  store.filters.isPublic = '';
  toast.fire({ icon: 'info', title: 'Filtros reiniciados' });
}

function toggleMultiselect(key) {
  multiselectOpen.value[key] = !multiselectOpen.value[key];
}

function closeMultiselect(key) {
  multiselectOpen.value[key] = false;
}

function isOptionSelected(key, option) {
  return Array.isArray(currentItem.value[key]) && currentItem.value[key].includes(option);
}

function toggleOption(key, option) {
  const currentValues = Array.isArray(currentItem.value[key]) ? [...currentItem.value[key]] : [];
  const index = currentValues.indexOf(option);

  if (index >= 0) {
    currentValues.splice(index, 1);
  } else {
    currentValues.push(option);
  }

  currentItem.value[key] = currentValues;
}

function removeOption(key, option) {
  currentItem.value[key] = (currentItem.value[key] || []).filter((value) => value !== option);
}

function filteredMultiselectOptions(field) {
  const search = String(multiselectSearch.value[field.key] || '').trim().toLowerCase();

  if (!search) {
    return field.options;
  }

  return field.options.filter((option) => option.toLowerCase().includes(search));
}

function openCreateModal() {
  store.resetCurrentItem();
  modalMode.value = 'create';
  modalOpen.value = true;
  toast.fire({ icon: 'info', title: 'Formulario listo para crear' });
}

async function openReadModal(id) {
  await store.fetchItem(id);
  modalMode.value = 'read';
  modalOpen.value = true;
  toast.fire({ icon: 'info', title: 'Registro cargado en modo lectura' });
}

async function openEditModal(id) {
  await store.fetchItem(id);
  modalMode.value = 'edit';
  modalOpen.value = true;
  toast.fire({ icon: 'info', title: 'Registro cargado para edicion' });
}

function closeModal() {
  modalOpen.value = false;
  store.resetCurrentItem();
}

function switchToEdit() {
  modalMode.value = 'edit';
  toast.fire({ icon: 'info', title: 'Modo edicion activado' });
}

async function saveRecord() {
  try {
    const saved = await store.saveCurrentItem();
    await store.fetchItems();
    await store.fetchItem(saved.id);
    modalMode.value = 'edit';
    await Swal.fire('Guardado', 'El registro fue almacenado correctamente.', 'success');
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

  await Swal.fire('Eliminado', 'El registro fue eliminado correctamente.', 'success');
}

async function deactivateRecord(row) {
  await store.updateStatus(row.id, {
    status: 'archived',
    is_public: false
  });
  await store.fetchItems();
  toast.fire({ icon: 'success', title: 'Registro desactivado' });
}

async function logout() {
  const result = await Swal.fire({
    title: 'Cerrar sesion',
    text: 'Se cerrara la sesion actual del administrador.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Cerrar sesion',
    cancelButtonText: 'Cancelar'
  });

  if (!result.isConfirmed) {
    return;
  }

  await auth.logout();
  router.push('/login');
}
</script>

<template>
  <div class="adminsolo">
    <header class="adminsolo__topbar">
      <div class="adminsolo__brand">
        <span class="adminsolo__kicker">ADMIN DEMO</span>
        <strong>CRUD de tipos de campos</strong>
      </div>

      <div class="adminsolo__session">
        <span>{{ userMeta.name }}</span>
        <small>{{ userMeta.email }}</small>
        <em>{{ userMeta.role }}</em>
      </div>

      <div class="adminsolo__topbarActions">
        <button class="adminsolo__button adminsolo__button--ghost" type="button" @click="router.push('/')">
          Ver landing page
        </button>
        <button class="adminsolo__button adminsolo__button--danger" type="button" @click="logout">
          Cerrar sesion
        </button>
      </div>
    </header>

    <main class="adminsolo__main">


      <section class="adminsolo__stats">
        <article v-for="card in stats" :key="card.label" class="adminsolo__statCard">
          <span>{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
        </article>
      </section>

      <section class="adminsolo__panel">
        <div class="adminsolo__panelHead">
          <div>
            <span class="adminsolo__sectionKicker">Filtros y buscador</span>
            <strong>Registros guardados</strong>
          </div>
          <button class="adminsolo__button adminsolo__button--primary" type="button" @click="openCreateModal">
            Nuevo registro
          </button>
        </div>

        <div class="adminsolo__filters">
          <input v-model="store.filters.search" class="adminsolo__input" type="text" placeholder="Buscar por texto general" />
          <select v-model="store.filters.status" class="adminsolo__input">
            <option value="">Todos los estados</option>
            <option v-for="option in statusOptions" :key="option" :value="option">{{ option }}</option>
          </select>
          <input v-model="store.filters.category" class="adminsolo__input" type="text" placeholder="Filtrar por categoria" />
          <select v-model="store.filters.isPublic" class="adminsolo__input">
            <option value="">Todos</option>
            <option value="true">Publico</option>
            <option value="false">Privado</option>
          </select>
          <div class="adminsolo__filterActions">
            <button class="adminsolo__button adminsolo__button--secondary" type="button" @click="store.fetchItems()">
              Buscar
            </button>
            <button class="adminsolo__button adminsolo__button--ghost" type="button" @click="resetFilters">
              Limpiar
            </button>
          </div>
        </div>

        <div class="adminsolo__tableWrap">
          <table class="adminsolo__table">
            <thead>
              <tr>
                <th>Campo principal</th>
                <th>Categoria</th>
                <th>Campo tecnico</th>
                <th>Estado</th>
                <th>Publico</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody v-if="filteredRows.length">
              <tr v-for="row in filteredRows" :key="row.id">
                <td>
                  <div class="adminsolo__titleCell">
                    <strong>{{ row.title }}</strong>
                    <span>{{ row.summary || 'Sin resumen disponible' }}</span>
                  </div>
                </td>
                <td><span class="adminsolo__pill">{{ row.category || 'Sin categoria' }}</span></td>
                <td>{{ row.main_technology || 'Sin valor tecnico' }}</td>
                <td><span class="adminsolo__status">{{ row.status }}</span></td>
                <td>
                  <span :class="row.is_public ? 'adminsolo__bool adminsolo__bool--on' : 'adminsolo__bool'">
                    {{ row.is_public ? 'Si' : 'No' }}
                  </span>
                </td>
                <td>
                  <div class="adminsolo__rowActions">
                    <button class="adminsolo__textButton" type="button" @click="openReadModal(row.id)">Ver</button>
                    <button class="adminsolo__textButton" type="button" @click="openEditModal(row.id)">Editar</button>
                    <button class="adminsolo__textButton adminsolo__textButton--warn" type="button" @click="deactivateRecord(row)">Desactivar</button>
                    <button class="adminsolo__textButton adminsolo__textButton--danger" type="button" @click="removeRecord(row.id)">Eliminar</button>
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="6">
                  <div class="adminsolo__empty">
                    <strong>No hay registros guardados</strong>
                    <p>Crea uno nuevo desde el boton superior para abrir el modal y guardar datos de ejemplo.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>

    <div v-if="modalOpen" class="adminsolo__modalOverlay" @click.self="closeModal">
      <div class="adminsolo__modal">
        <div class="adminsolo__modalHead">
          <div>
            <span class="adminsolo__sectionKicker">Formulario de ejemplo</span>
            <strong>{{ modalTitle }}</strong>
          </div>
          <div class="adminsolo__modalActions">
            <button
              v-if="modalReadonly && currentItem.id"
              class="adminsolo__button adminsolo__button--secondary"
              type="button"
              @click="switchToEdit"
            >
              Editar
            </button>
            <button class="adminsolo__button adminsolo__button--ghost" type="button" @click="closeModal">
              Cerrar
            </button>
            <button
              class="adminsolo__button adminsolo__button--primary"
              type="button"
              :disabled="modalReadonly || saving"
              @click="saveRecord"
            >
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>

        <div class="adminsolo__modalBody">
          <div class="adminsolo__fieldsGrid">
            <article
              v-for="field in demoFields"
              :key="field.key"
              class="adminsolo__fieldCard"
              :class="{ 'adminsolo__fieldCard--wide': field.span === 2 }"
            >
              <div class="adminsolo__fieldHead">
                <span>{{ field.label }}</span>
                <strong>{{ field.title }}</strong>
                <p>{{ field.description }}</p>
              </div>

              <template v-if="field.type === 'textarea'">
                <textarea
                  v-model="currentItem[field.key]"
                  class="adminsolo__textarea"
                  :rows="field.rows || 4"
                  :placeholder="field.placeholder"
                  :disabled="modalReadonly"
                ></textarea>
              </template>

              <template v-else-if="field.type === 'select'">
                <select v-model="currentItem[field.key]" class="adminsolo__input" :disabled="modalReadonly">
                  <option value="">{{ field.placeholder }}</option>
                  <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
                </select>
              </template>

              <template v-else-if="field.type === 'multiselect'">
                <div class="adminsolo__multiselectWrap">
                  <button
                    class="adminsolo__multiselectTrigger"
                    :class="{ 'adminsolo__multiselectTrigger--disabled': modalReadonly }"
                    type="button"
                    :disabled="modalReadonly"
                    @click="toggleMultiselect(field.key)"
                  >
                    <div class="adminsolo__multiselectValue">
                      <template v-if="(currentItem[field.key] || []).length">
                        <span
                          v-for="option in currentItem[field.key]"
                          :key="option"
                          class="adminsolo__multiselectChip"
                        >
                          {{ option }}
                          <button
                            v-if="!modalReadonly"
                            type="button"
                            class="adminsolo__multiselectChipRemove"
                            @click.stop="removeOption(field.key, option)"
                          >
                            ×
                          </button>
                        </span>
                      </template>
                      <span v-else class="adminsolo__multiselectPlaceholder">Selecciona una o varias opciones</span>
                    </div>
                    <span class="adminsolo__multiselectArrow">{{ multiselectOpen[field.key] ? '▲' : '▼' }}</span>
                  </button>

                  <div v-if="multiselectOpen[field.key]" class="adminsolo__multiselectPanel">
                    <input
                      v-model="multiselectSearch[field.key]"
                      class="adminsolo__input adminsolo__multiselectSearch"
                      type="text"
                      placeholder="Buscar opcion"
                    />
                    <div class="adminsolo__multiselectList">
                      <label
                        v-for="option in filteredMultiselectOptions(field)"
                        :key="option"
                        class="adminsolo__multiselectOption"
                      >
                        <input
                          type="checkbox"
                          :checked="isOptionSelected(field.key, option)"
                          @change="toggleOption(field.key, option)"
                        />
                        <span>{{ option }}</span>
                      </label>
                      <div v-if="!filteredMultiselectOptions(field).length" class="adminsolo__multiselectEmpty">
                        No hay opciones para esa búsqueda.
                      </div>
                    </div>
                    <div class="adminsolo__multiselectFooter">
                      <button class="adminsolo__button adminsolo__button--ghost" type="button" @click="closeMultiselect(field.key)">
                        Cerrar selector
                      </button>
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="field.type === 'checkbox'">
                <label class="adminsolo__checkRow">
                  <input v-model="currentItem[field.key]" type="checkbox" :disabled="modalReadonly" />
                  <span>Activar opcion booleana</span>
                </label>
              </template>

              <template v-else>
                <input
                  v-model="currentItem[field.key]"
                  class="adminsolo__input"
                  :type="field.type"
                  :placeholder="field.placeholder"
                  :disabled="modalReadonly"
                />
              </template>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adminsolo {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.12), transparent 26%),
    linear-gradient(180deg, #f4f7fb 0%, #e9eef6 100%);
  color: #0f172a;
}

.adminsolo__topbar {
  width: min(1520px, calc(100% - 32px));
  margin: 0 auto;
  padding: 22px 0 16px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: center;
}

.adminsolo__brand {
  display: grid;
  gap: 4px;
}

.adminsolo__kicker,
.adminsolo__sectionKicker {
  display: block;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #2563eb;
}

.adminsolo__brand strong {
  font-size: 1.05rem;
  color: #0f172a;
}

.adminsolo__session {
  display: grid;
  justify-items: center;
  gap: 2px;
}

.adminsolo__session span {
  font-weight: 700;
}

.adminsolo__session small {
  color: #64748b;
}

.adminsolo__session em {
  color: #2563eb;
  font-style: normal;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.adminsolo__topbarActions,
.adminsolo__heroActions,
.adminsolo__filterActions,
.adminsolo__rowActions,
.adminsolo__modalActions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.adminsolo__button,
.adminsolo__textButton {
  border: 0;
  border-radius: 14px;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.adminsolo__button:hover,
.adminsolo__textButton:hover {
  transform: translateY(-1px);
}

.adminsolo__button {
  min-height: 44px;
  padding: 10px 16px;
}

.adminsolo__button--primary {
  background: #2563eb;
  color: white;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.22);
}

.adminsolo__button--secondary {
  background: #0f766e;
  color: white;
  box-shadow: 0 10px 24px rgba(15, 118, 110, 0.18);
}

.adminsolo__button--ghost {
  background: white;
  color: #0f172a;
  border: 1px solid #cbd5e1;
}

.adminsolo__button--danger {
  background: #dc2626;
  color: white;
  box-shadow: 0 10px 24px rgba(220, 38, 38, 0.18);
}

.adminsolo__main {
  width: min(1520px, calc(100% - 32px));
  margin: 0 auto;
  padding: 6px 0 40px;
  display: grid;
  gap: 20px;
}

.adminsolo__hero,
.adminsolo__panel,
.adminsolo__statCard {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(203, 213, 225, 0.95);
  box-shadow: 0 22px 48px rgba(15, 23, 42, 0.08);
}

.adminsolo__hero {
  border-radius: 28px;
  padding: 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.adminsolo__hero h1 {
  margin: 12px 0 10px;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.04;
}

.adminsolo__hero p {
  margin: 0;
  max-width: 860px;
  color: #475569;
  line-height: 1.72;
}

.adminsolo__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.adminsolo__statCard {
  border-radius: 22px;
  padding: 22px;
}

.adminsolo__statCard span {
  display: block;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2563eb;
}

.adminsolo__statCard strong {
  display: block;
  margin-top: 12px;
  font-size: clamp(1.8rem, 2.5vw, 2.4rem);
}

.adminsolo__panel {
  border-radius: 28px;
  padding: 24px;
}

.adminsolo__panelHead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.adminsolo__panelHead strong {
  display: block;
  margin-top: 8px;
  font-size: 1.12rem;
}

.adminsolo__filters {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.adminsolo__filters > * {
  grid-column: span 2;
}

.adminsolo__filters > .adminsolo__input:first-child {
  grid-column: span 4;
}

.adminsolo__filterActions {
  grid-column: span 2;
  justify-content: flex-end;
}

.adminsolo__input,
.adminsolo__textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: white;
  color: #0f172a;
  font: inherit;
  padding: 12px 14px;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.adminsolo__input:focus,
.adminsolo__textarea:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.18);
}

.adminsolo__textarea {
  resize: vertical;
}

.adminsolo__multiselectWrap {
  position: relative;
}

.adminsolo__multiselectTrigger {
  width: 100%;
  min-height: 52px;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  background: white;
  color: #0f172a;
  padding: 10px 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  cursor: pointer;
}

.adminsolo__multiselectTrigger--disabled {
  background: #f8fafc;
  cursor: default;
}

.adminsolo__multiselectValue {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-height: 28px;
}

.adminsolo__multiselectPlaceholder {
  color: #64748b;
  padding-top: 3px;
}

.adminsolo__multiselectArrow {
  color: #475569;
  font-size: 0.8rem;
  padding-top: 6px;
}

.adminsolo__multiselectChip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 0.82rem;
  font-weight: 700;
}

.adminsolo__multiselectChipRemove {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  line-height: 1;
  padding: 0;
}

.adminsolo__multiselectPanel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 10;
  border: 1px solid #cbd5e1;
  border-radius: 18px;
  background: white;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
  padding: 12px;
}

.adminsolo__multiselectSearch {
  margin-bottom: 10px;
}

.adminsolo__multiselectList {
  max-height: 220px;
  overflow: auto;
  display: grid;
  gap: 6px;
  padding-right: 4px;
}

.adminsolo__multiselectOption {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.16s ease;
}

.adminsolo__multiselectOption:hover {
  background: #f8fafc;
}

.adminsolo__multiselectOption input {
  width: 16px;
  height: 16px;
}

.adminsolo__multiselectEmpty {
  padding: 12px;
  color: #64748b;
  text-align: center;
}

.adminsolo__multiselectFooter {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.adminsolo__tableWrap {
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  background: white;
}

.adminsolo__table {
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
}

.adminsolo__table th,
.adminsolo__table td {
  padding: 16px 14px;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  vertical-align: top;
}

.adminsolo__table th {
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.adminsolo__titleCell {
  display: grid;
  gap: 6px;
}

.adminsolo__titleCell strong {
  color: #0f172a;
}

.adminsolo__titleCell span {
  color: #64748b;
  line-height: 1.5;
}

.adminsolo__pill,
.adminsolo__status,
.adminsolo__bool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.adminsolo__pill {
  background: #eff6ff;
  color: #2563eb;
}

.adminsolo__status {
  background: #ecfeff;
  color: #0f766e;
}

.adminsolo__bool {
  background: #e2e8f0;
  color: #475569;
}

.adminsolo__bool--on {
  background: #dcfce7;
  color: #15803d;
}

.adminsolo__textButton {
  background: transparent;
  color: #2563eb;
  padding: 6px 0;
}

.adminsolo__textButton--warn {
  color: #d97706;
}

.adminsolo__textButton--danger {
  color: #dc2626;
}

.adminsolo__empty {
  padding: 36px 18px;
  text-align: center;
}

.adminsolo__empty strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
}

.adminsolo__empty p {
  margin: 0;
  color: #64748b;
}

.adminsolo__modalOverlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 18px;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
}

.adminsolo__modal {
  width: min(1200px, 100%);
  max-height: calc(100vh - 36px);
  overflow: hidden;
  border-radius: 28px;
  background: #f8fafc;
  box-shadow: 0 28px 72px rgba(15, 23, 42, 0.28);
  display: grid;
  grid-template-rows: auto 1fr;
}

.adminsolo__modalHead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  padding: 24px 26px;
  background: linear-gradient(135deg, #eff6ff, #f8fafc);
  border-bottom: 1px solid #dbeafe;
}

.adminsolo__modalHead strong {
  display: block;
  margin-top: 8px;
  font-size: 1.22rem;
}

.adminsolo__modalBody {
  overflow: auto;
  padding: 24px;
}

.adminsolo__fieldsGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.adminsolo__fieldCard {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
  min-width: 0;
}

.adminsolo__fieldCard--wide {
  grid-column: 1 / -1;
}

.adminsolo__fieldHead {
  margin-bottom: 14px;
}

.adminsolo__fieldHead span {
  display: block;
  color: #2563eb;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.adminsolo__fieldHead strong {
  display: block;
  margin-top: 8px;
  font-size: 1rem;
}

.adminsolo__fieldHead p {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.55;
}

.adminsolo__checkRow {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 48px;
  font-weight: 600;
}

@media (max-width: 1100px) {
  .adminsolo__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .adminsolo__filters > * {
    grid-column: span 3;
  }

  .adminsolo__filters > .adminsolo__input:first-child {
    grid-column: span 6;
  }
}

@media (max-width: 768px) {
  .adminsolo__topbar,
  .adminsolo__main {
    width: min(100%, calc(100% - 24px));
  }

  .adminsolo__topbar {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .adminsolo__session {
    justify-items: start;
  }

  .adminsolo__hero,
  .adminsolo__panelHead,
  .adminsolo__modalHead {
    flex-direction: column;
    align-items: flex-start;
  }

  .adminsolo__topbarActions,
  .adminsolo__heroActions,
  .adminsolo__filterActions,
  .adminsolo__modalActions {
    width: 100%;
  }

  .adminsolo__button {
    width: 100%;
  }

  .adminsolo__stats,
  .adminsolo__filters,
  .adminsolo__fieldsGrid {
    grid-template-columns: 1fr;
  }

  .adminsolo__filters > *,
  .adminsolo__filters > .adminsolo__input:first-child,
  .adminsolo__filterActions,
  .adminsolo__fieldCard--wide {
    grid-column: span 1 !important;
  }

  .adminsolo__rowActions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
