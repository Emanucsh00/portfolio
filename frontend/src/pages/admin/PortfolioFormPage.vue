<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { storeToRefs } from 'pinia';
import { usePortfolioStore } from '../../stores/portfolio.store';

const route = useRoute();
const router = useRouter();
const store = usePortfolioStore();
const { currentItem } = storeToRefs(store);

const isEditing = computed(() => Boolean(route.params.id));
const imgError = ref(false);

const categoryOptions = [
  'Web App', 'Mobile App', 'API / Backend', 'Full Stack',
  'Data / ML', 'DevOps', 'CLI Tool', 'Otro'
];

const projectTypeOptions = [
  'Personal', 'Freelance', 'Académico', 'Empresarial', 'Open Source'
];

const techOptions = [
  'Vue 3', 'React', 'Angular', 'Node.js', 'Express', 'NestJS',
  'Python', 'Django', 'FastAPI', 'PostgreSQL', 'MySQL', 'MongoDB',
  'Redis', 'Docker', 'Firebase', 'Quasar', 'TypeScript', 'JavaScript',
  'Sequelize', 'JWT', 'REST', 'GraphQL', 'AWS', 'GCP', 'Azure'
];

const featureOptions = [
  'Autenticación', 'CRUD completo', 'API REST', 'GraphQL', 'WebSockets',
  'Notificaciones', 'Pagos en línea', 'Carga de archivos', 'Dashboard',
  'Roles y permisos', 'Modo oscuro', 'Internacionalización', 'SEO',
  'PWA', 'Exportar PDF', 'Caché', 'CI/CD', 'Testing automatizado'
];

const statusOptions = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Publicado', value: 'published' },
  { label: 'Archivado', value: 'archived' }
];

const difficultyLabels = { 1: 'Básico', 2: 'Intermedio', 3: 'Avanzado', 4: 'Expert' };

const difficultyRating = computed({
  get() {
    const reverseMap = { 'Básico': 1, 'Intermedio': 2, 'Avanzado': 3, 'Expert': 4 };
    return reverseMap[currentItem.value.difficulty_level] || 0;
  },
  set(val) {
    currentItem.value.difficulty_level = difficultyLabels[val] || '';
  }
});

onMounted(async () => {
  if (isEditing.value) {
    await store.fetchItem(route.params.id);
  } else {
    store.resetCurrentItem();
  }
  imgError.value = false;
});

async function save() {
  try {
    await store.saveCurrentItem();
    Swal.fire('Guardado', 'El registro fue almacenado correctamente.', 'success');
    router.push('/admin');
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || error.message, 'error');
  }
}
</script>

<template>
  <q-page class="admin-page">
    <div class="admin-page-header">
      <div>
        <div class="eyebrow">{{ isEditing ? 'EDITAR PROYECTO' : 'NUEVO PROYECTO' }}</div>
        <h1>{{ isEditing ? 'Editar registro' : 'Crear nuevo registro' }}</h1>
        <p>Formulario completo con todos los campos del modelo de portafolio.</p>
      </div>
      <div class="form-header-actions">
        <q-btn flat label="Cancelar" icon="close" @click="router.push('/admin')" />
        <q-btn unelevated color="primary" label="Guardar" icon="save" @click="save" />
      </div>
    </div>

    <!-- 1. Información básica -->
    <div class="form-card">
      <div class="form-section-head">
        <q-icon name="info" size="22px" />
        <div>
          <p class="form-section-title">1. Información básica</p>
          <p class="form-section-subtitle">Identidad del proyecto: título, slug y resumen ejecutivo.</p>
        </div>
      </div>
      <div class="form-grid">
        <q-input
          v-model="currentItem.title"
          label="Título del proyecto *"
          outlined
          counter
          maxlength="120"
          hint="Nombre claro y descriptivo"
        />
        <q-input
          v-model="currentItem.subtitle"
          label="Subtítulo"
          outlined
          hint="Complemento del título"
        />
        <q-input
          v-model="currentItem.slug"
          label="Slug (URL)"
          outlined
          hint="Identificador único en la URL"
        >
          <template #prepend>
            <span class="form-slug-prefix">/</span>
          </template>
        </q-input>
        <q-input
          v-model="currentItem.summary"
          label="Resumen ejecutivo *"
          outlined
          type="textarea"
          autogrow
          counter
          maxlength="300"
          hint="Descripción corta para tarjetas y listados"
          class="col-span-2"
        />
      </div>
    </div>

    <!-- 2. Clasificación y estado -->
    <div class="form-card">
      <div class="form-section-head">
        <q-icon name="label" size="22px" />
        <div>
          <p class="form-section-title">2. Clasificación y estado</p>
          <p class="form-section-subtitle">Categoría, tipo, visibilidad y posición en el listado.</p>
        </div>
      </div>
      <div class="form-grid">
        <q-select
          v-model="currentItem.category"
          :options="categoryOptions"
          label="Categoría"
          outlined
          emit-value
          map-options
          clearable
        />
        <q-select
          v-model="currentItem.project_type"
          :options="projectTypeOptions"
          label="Tipo de proyecto"
          outlined
          emit-value
          map-options
          clearable
        />

        <div class="col-span-2">
          <p class="form-label">Estado de publicación</p>
          <q-btn-toggle
            v-model="currentItem.status"
            unelevated
            rounded
            :options="statusOptions"
            color="grey-3"
            text-color="grey-8"
            toggle-color="primary"
            toggle-text-color="white"
          />
        </div>

        <div class="form-toggle-row col-span-2">
          <q-toggle v-model="currentItem.is_public" color="positive" />
          <span class="form-label">Visible públicamente en el portafolio</span>
        </div>

        <div class="col-span-2">
          <p class="form-label">Orden de despliegue: <strong>{{ currentItem.display_order }}</strong></p>
          <q-slider
            v-model="currentItem.display_order"
            :min="0"
            :max="100"
            :step="1"
            label
            color="primary"
          />
        </div>
      </div>
    </div>

    <!-- 3. Stack técnico -->
    <div class="form-card">
      <div class="form-section-head">
        <q-icon name="code" size="22px" />
        <div>
          <p class="form-section-title">3. Stack técnico</p>
          <p class="form-section-subtitle">Tecnología principal y stack secundario del proyecto.</p>
        </div>
      </div>
      <div class="form-grid">
        <q-input
          v-model="currentItem.main_technology"
          label="Tecnología principal"
          outlined
          hint="Ej: Vue 3, React, Node.js"
        >
          <template #prepend><q-icon name="star" /></template>
        </q-input>

        <q-select
          v-model="currentItem.secondary_technologies"
          :options="techOptions"
          label="Tecnologías secundarias"
          outlined
          multiple
          use-chips
          new-value-mode="add-unique"
          hint="Selecciona o escribe y presiona Enter"
        />
      </div>
    </div>

    <!-- 4. Descripción completa -->
    <div class="form-card">
      <div class="form-section-head">
        <q-icon name="article" size="22px" />
        <div>
          <p class="form-section-title">4. Descripción completa</p>
          <p class="form-section-subtitle">Texto detallado para la página de detalle del proyecto.</p>
        </div>
      </div>
      <div class="form-grid">
        <q-input
          v-model="currentItem.description"
          label="Descripción"
          outlined
          type="textarea"
          autogrow
          class="col-span-2"
          hint="Descripción larga con contexto, retos y soluciones"
        />
      </div>
    </div>

    <!-- 5. URLs y multimedia -->
    <div class="form-card">
      <div class="form-section-head">
        <q-icon name="link" size="22px" />
        <div>
          <p class="form-section-title">5. URLs y multimedia</p>
          <p class="form-section-subtitle">Repositorio, demo en vivo e imagen representativa.</p>
        </div>
      </div>
      <div class="form-grid">
        <q-input
          v-model="currentItem.repository_url"
          label="Repositorio URL"
          outlined
          type="url"
        >
          <template #prepend><q-icon name="code" /></template>
        </q-input>
        <q-input
          v-model="currentItem.demo_url"
          label="Demo URL"
          outlined
          type="url"
        >
          <template #prepend><q-icon name="open_in_new" /></template>
        </q-input>
        <q-input
          v-model="currentItem.image_url"
          label="Imagen URL"
          outlined
          type="url"
          class="col-span-2"
          @update:model-value="imgError = false"
        >
          <template #prepend><q-icon name="image" /></template>
        </q-input>
        <div v-if="currentItem.image_url && !imgError" class="img-preview col-span-2">
          <img
            :src="currentItem.image_url"
            alt="Preview"
            @error="imgError = true"
          />
        </div>
        <div v-if="imgError" class="img-preview-error col-span-2">
          La URL de imagen no pudo cargarse.
        </div>
      </div>
    </div>

    <!-- 6. Contexto del proyecto -->
    <div class="form-card">
      <div class="form-section-head">
        <q-icon name="business_center" size="22px" />
        <div>
          <p class="form-section-title">6. Contexto del proyecto</p>
          <p class="form-section-subtitle">Cliente, rol, dificultad y rango de fechas.</p>
        </div>
      </div>
      <div class="form-grid">
        <q-input
          v-model="currentItem.client_name"
          label="Cliente / Organización"
          outlined
        >
          <template #prepend><q-icon name="person" /></template>
        </q-input>
        <q-input
          v-model="currentItem.role_performed"
          label="Rol desempeñado"
          outlined
          hint="Ej: Fullstack Developer, Tech Lead"
        >
          <template #prepend><q-icon name="badge" /></template>
        </q-input>

        <div class="col-span-2">
          <div class="form-rating-row">
            <span class="form-label">Nivel de dificultad:</span>
            <q-rating
              v-model="difficultyRating"
              :max="4"
              size="28px"
              color="amber-8"
              icon="star_border"
              icon-selected="star"
            />
            <q-badge
              v-if="currentItem.difficulty_level"
              color="secondary"
              :label="currentItem.difficulty_level"
              class="q-ml-sm"
            />
            <span v-else class="form-hint">Sin seleccionar</span>
          </div>
        </div>

        <q-input
          v-model="currentItem.start_date"
          label="Fecha de inicio"
          type="date"
          outlined
        />
        <q-input
          v-model="currentItem.end_date"
          label="Fecha de fin"
          type="date"
          outlined
        />
      </div>
    </div>

    <!-- 7. Narrativa técnica -->
    <div class="form-card">
      <div class="form-section-head">
        <q-icon name="psychology" size="22px" />
        <div>
          <p class="form-section-title">7. Narrativa técnica</p>
          <p class="form-section-subtitle">Objetivo, resultado, aprendizajes y funcionalidades clave.</p>
        </div>
      </div>
      <div class="form-grid">
        <q-input
          v-model="currentItem.objective"
          label="Objetivo del proyecto"
          outlined
          type="textarea"
          autogrow
          hint="¿Qué problema resuelve?"
        />
        <q-input
          v-model="currentItem.result"
          label="Resultado obtenido"
          outlined
          type="textarea"
          autogrow
          hint="¿Qué se logró?"
        />
        <q-input
          v-model="currentItem.learnings"
          label="Aprendizajes"
          outlined
          type="textarea"
          autogrow
          class="col-span-2"
          hint="¿Qué aprendiste o qué mejorarías?"
        />
        <q-select
          v-model="currentItem.features"
          :options="featureOptions"
          label="Funcionalidades destacadas"
          outlined
          multiple
          use-chips
          new-value-mode="add-unique"
          class="col-span-2"
          hint="Selecciona o escribe y presiona Enter"
        />
      </div>
    </div>

    <!-- 8. Notas internas -->
    <div class="form-card form-card-private">
      <div class="form-section-head">
        <q-icon name="lock" size="22px" color="negative" />
        <div>
          <p class="form-section-title">8. Notas internas</p>
          <p class="form-section-subtitle">Solo visible en el panel de administración. No se muestra al público.</p>
        </div>
      </div>
      <div class="form-grid">
        <q-input
          v-model="currentItem.internal_notes"
          label="Notas internas"
          outlined
          type="textarea"
          autogrow
          class="col-span-2"
          hint="TODOs, pendientes, contexto privado"
        />
      </div>
    </div>

    <div class="form-bottom-actions">
      <q-btn flat label="Cancelar" icon="close" @click="router.push('/admin')" />
      <q-btn unelevated color="primary" label="Guardar registro" icon="save" @click="save" />
    </div>
  </q-page>
</template>
