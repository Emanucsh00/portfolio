<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { storeToRefs } from 'pinia';
import { usePortfolioStore } from '../../stores/portfolio.store';

const route = useRoute();
const router = useRouter();
const store = usePortfolioStore();
const { currentItem, saving } = storeToRefs(store);

const isEditing = computed(() => Boolean(route.params.id));
const imgError = ref(false);

const statusOptions = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Publicado', value: 'published' },
  { label: 'Archivado', value: 'archived' }
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

const difficultyLabels = { 1: 'Basico', 2: 'Intermedio', 3: 'Avanzado', 4: 'Expert' };
const requiredKeys = ['title', 'slug', 'summary', 'description', 'status', 'main_technology'];

const formSections = [
  {
    id: 'identity',
    title: 'Identidad del proyecto',
    subtitle: 'La base del registro: como se presenta, como se resume y como se enruta.',
    icon: 'edit_note',
    fields: [
      {
        key: 'title',
        component: 'q-input',
        class: 'col-span-2',
        props: {
          label: 'Titulo del proyecto *',
          outlined: true,
          counter: true,
          maxlength: 120,
          hint: 'Nombre claro y descriptivo'
        }
      },
      {
        key: 'subtitle',
        component: 'q-input',
        props: {
          label: 'Subtitulo',
          outlined: true,
          hint: 'Complemento del titulo'
        }
      },
      {
        key: 'slug',
        component: 'q-input',
        props: {
          label: 'Slug *',
          outlined: true,
          hint: 'Identificador unico en la URL'
        },
        prefixText: '/'
      },
      {
        key: 'summary',
        component: 'q-input',
        class: 'col-span-2',
        props: {
          label: 'Resumen ejecutivo *',
          outlined: true,
          type: 'textarea',
          autogrow: true,
          counter: true,
          maxlength: 300,
          hint: 'Descripcion corta para tarjetas y listados'
        }
      },
      {
        key: 'description',
        component: 'q-input',
        class: 'col-span-2',
        props: {
          label: 'Descripcion completa *',
          outlined: true,
          type: 'textarea',
          autogrow: true,
          hint: 'Cuenta el contexto, el reto y la solucion'
        }
      }
    ]
  },
  {
    id: 'classification',
    title: 'Clasificacion y despliegue',
    subtitle: 'Ayuda a ordenar el contenido y controlar donde aparece.',
    icon: 'grid_view',
    fields: [
      {
        key: 'category',
        component: 'q-select',
        props: {
          label: 'Categoria',
          outlined: true,
          options: categoryOptions,
          clearable: true
        }
      },
      {
        key: 'project_type',
        component: 'q-select',
        props: {
          label: 'Tipo de proyecto',
          outlined: true,
          options: projectTypeOptions,
          clearable: true
        }
      },
      {
        key: 'main_technology',
        component: 'q-input',
        props: {
          label: 'Tecnologia principal *',
          outlined: true,
          hint: 'Ej: Vue 3, React, Node.js'
        },
        prependIcon: 'star'
      },
      {
        key: 'secondary_technologies',
        component: 'q-select',
        class: 'col-span-2',
        props: {
          label: 'Tecnologias secundarias',
          outlined: true,
          multiple: true,
          useChips: true,
          useInput: true,
          newValueMode: 'add-unique',
          options: techOptions,
          hint: 'Selecciona o escribe y presiona Enter'
        }
      }
    ]
  },
  {
    id: 'links',
    title: 'Links y recursos visuales',
    subtitle: 'Conexion entre la ficha administrativa y la vista publica.',
    icon: 'link',
    fields: [
      {
        key: 'repository_url',
        component: 'q-input',
        props: {
          label: 'Repositorio URL',
          outlined: true,
          type: 'url'
        },
        prependIcon: 'code'
      },
      {
        key: 'demo_url',
        component: 'q-input',
        props: {
          label: 'Demo URL',
          outlined: true,
          type: 'url'
        },
        prependIcon: 'open_in_new'
      },
      {
        key: 'image_url',
        component: 'q-input',
        class: 'col-span-2',
        props: {
          label: 'Imagen URL',
          outlined: true,
          type: 'url'
        },
        prependIcon: 'image'
      }
    ]
  },
  {
    id: 'context',
    title: 'Contexto profesional',
    subtitle: 'Cliente, rol, fechas y complejidad para dar peso real al proyecto.',
    icon: 'work_history',
    fields: [
      {
        key: 'client_name',
        component: 'q-input',
        props: {
          label: 'Cliente u organizacion',
          outlined: true
        },
        prependIcon: 'apartment'
      },
      {
        key: 'role_performed',
        component: 'q-input',
        props: {
          label: 'Rol desempenado',
          outlined: true,
          hint: 'Ej: Fullstack Developer, Tech Lead'
        },
        prependIcon: 'badge'
      },
      {
        key: 'start_date',
        component: 'q-input',
        props: {
          label: 'Fecha de inicio',
          type: 'date',
          outlined: true
        }
      },
      {
        key: 'end_date',
        component: 'q-input',
        props: {
          label: 'Fecha de fin',
          type: 'date',
          outlined: true
        }
      }
    ]
  },
  {
    id: 'narrative',
    title: 'Narrativa tecnica',
    subtitle: 'Convierte el proyecto en una historia entendible para reclutadores y clientes.',
    icon: 'psychology_alt',
    fields: [
      {
        key: 'objective',
        component: 'q-input',
        props: {
          label: 'Objetivo del proyecto',
          outlined: true,
          type: 'textarea',
          autogrow: true,
          hint: 'Que problema resuelve'
        }
      },
      {
        key: 'result',
        component: 'q-input',
        props: {
          label: 'Resultado obtenido',
          outlined: true,
          type: 'textarea',
          autogrow: true,
          hint: 'Que se logro'
        }
      },
      {
        key: 'learnings',
        component: 'q-input',
        class: 'col-span-2',
        props: {
          label: 'Aprendizajes',
          outlined: true,
          type: 'textarea',
          autogrow: true,
          hint: 'Que aprendiste o que mejorarias'
        }
      },
      {
        key: 'features',
        component: 'q-select',
        class: 'col-span-2',
        props: {
          label: 'Funcionalidades destacadas',
          outlined: true,
          multiple: true,
          useChips: true,
          useInput: true,
          newValueMode: 'add-unique',
          options: featureOptions,
          hint: 'Selecciona o escribe y presiona Enter'
        }
      }
    ]
  },
  {
    id: 'internal',
    title: 'Notas internas',
    subtitle: 'Contexto privado para mantenimiento, mejoras y pendientes.',
    icon: 'lock',
    private: true,
    fields: [
      {
        key: 'internal_notes',
        component: 'q-input',
        class: 'col-span-2',
        props: {
          label: 'Notas internas',
          outlined: true,
          type: 'textarea',
          autogrow: true,
          hint: 'TODOs, pendientes o decisiones tecnicas'
        }
      }
    ]
  }
];

const difficultyRating = computed({
  get() {
    const reverseMap = { Basico: 1, Intermedio: 2, Avanzado: 3, Expert: 4 };
    return reverseMap[currentItem.value.difficulty_level] || 0;
  },
  set(value) {
    currentItem.value.difficulty_level = difficultyLabels[value] || '';
  }
});

const completion = computed(() => {
  const completed = requiredKeys.filter((key) => {
    const value = currentItem.value[key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return Boolean(String(value || '').trim());
  }).length;

  return Math.round((completed / requiredKeys.length) * 100);
});

const healthItems = computed(() => [
  {
    label: 'Estado',
    value: currentItem.value.status || 'draft'
  },
  {
    label: 'Visible al publico',
    value: currentItem.value.is_public ? 'Si' : 'No'
  },
  {
    label: 'Orden',
    value: currentItem.value.display_order ?? 0
  },
  {
    label: 'Features',
    value: currentItem.value.features?.length || 0
  }
]);

onMounted(async () => {
  if (isEditing.value) {
    await store.fetchItem(route.params.id);
  } else {
    store.resetCurrentItem();
  }

  imgError.value = false;
});

function getFieldProps(field) {
  return field.props;
}

async function save() {
  try {
    await store.saveCurrentItem();
    await Swal.fire('Guardado', 'El registro fue almacenado correctamente.', 'success');
    router.push('/admin');
  } catch (error) {
    Swal.fire('Error', error.response?.data?.message || error.message, 'error');
  }
}
</script>

<template>
  <q-page class="admin-page">
    <section class="admin-hero admin-hero-form">
      <div class="admin-hero-copy">
        <div class="eyebrow">{{ isEditing ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO' }}</div>
        <h1>{{ isEditing ? 'Formulario guiado para actualizar tu portfolio' : 'Crea un registro sin pelearte con 25 campos' }}</h1>
        <p>
          Reordene el formulario en bloques de decision natural para que primero definas identidad, luego contexto,
          despues narrativa y por ultimo notas internas.
        </p>
      </div>

      <div class="admin-hero-panel">
        <div class="admin-hero-stat">
          <span>Completitud base</span>
          <strong>{{ completion }}%</strong>
        </div>
        <div class="admin-hero-stat">
          <span>Modo</span>
          <strong>{{ isEditing ? 'Edicion' : 'Creacion' }}</strong>
        </div>
        <div class="admin-hero-stat">
          <span>Slug actual</span>
          <strong>{{ currentItem.slug || 'pendiente' }}</strong>
        </div>
      </div>
    </section>

    <div class="portfolio-form-workspace">
      <div class="portfolio-form-main">
        <section class="form-card form-card-highlight">
          <div class="form-section-head">
            <q-icon name="tune" size="22px" />
            <div>
              <p class="form-section-title">Publicacion y orden visual</p>
              <p class="form-section-subtitle">Estas decisiones afectan el listado publico antes de entrar al detalle.</p>
            </div>
          </div>

          <div class="form-grid">
            <div class="col-span-2">
              <p class="form-label">Estado de publicacion</p>
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

            <div class="form-toggle-row">
              <q-toggle v-model="currentItem.is_public" color="positive" />
              <span class="form-label form-label-inline">Visible publicamente</span>
            </div>

            <div>
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

            <div>
              <div class="form-rating-row">
                <span class="form-label form-label-inline">Dificultad:</span>
                <q-rating
                  v-model="difficultyRating"
                  :max="4"
                  size="28px"
                  color="amber-8"
                  icon="star_border"
                  icon-selected="star"
                />
                <q-badge v-if="currentItem.difficulty_level" color="secondary" :label="currentItem.difficulty_level" />
                <span v-else class="form-hint">Sin seleccionar</span>
              </div>
            </div>
          </div>
        </section>

        <section
          v-for="section in formSections"
          :key="section.id"
          class="form-card"
          :class="{ 'form-card-private': section.private }"
        >
          <div class="form-section-head">
            <q-icon :name="section.icon" size="22px" :color="section.private ? 'negative' : undefined" />
            <div>
              <p class="form-section-title">{{ section.title }}</p>
              <p class="form-section-subtitle">{{ section.subtitle }}</p>
            </div>
          </div>

          <div class="form-grid">
            <component
              :is="field.component"
              v-for="field in section.fields"
              :key="field.key"
              v-model="currentItem[field.key]"
              v-bind="getFieldProps(field)"
              :class="field.class"
              @update:model-value="field.key === 'image_url' ? (imgError = false) : undefined"
            >
              <template v-if="field.prependIcon || field.prefixText" #prepend>
                <q-icon v-if="field.prependIcon" :name="field.prependIcon" />
                <span v-else class="form-slug-prefix">{{ field.prefixText }}</span>
              </template>
            </component>

            <div
              v-if="section.id === 'links' && currentItem.image_url && !imgError"
              class="img-preview col-span-2"
            >
              <img :src="currentItem.image_url" alt="Preview" @error="imgError = true" />
            </div>

            <div v-if="section.id === 'links' && imgError" class="img-preview-error col-span-2">
              La URL de imagen no pudo cargarse.
            </div>
          </div>
        </section>
      </div>

      <aside class="portfolio-form-aside">
        <section class="portfolio-side-card">
          <span class="portfolio-side-label">Salud del registro</span>
          <strong>{{ completion }}% de base completa</strong>
          <p>Este indicador toma los campos minimos para que el item tenga buena presencia en el admin y en el portfolio.</p>
          <q-linear-progress rounded size="12px" color="primary" :value="completion / 100" class="q-mt-md" />
        </section>

        <section class="portfolio-side-card">
          <span class="portfolio-side-label">Resumen rapido</span>
          <strong>{{ currentItem.title || 'Sin titulo aun' }}</strong>
          <p>{{ currentItem.summary || 'Agrega un resumen ejecutivo para que esta ficha gane claridad.' }}</p>
          <div class="portfolio-side-stats">
            <div v-for="item in healthItems" :key="item.label" class="portfolio-side-stat">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
          </div>
        </section>

        <section class="portfolio-side-card">
          <span class="portfolio-side-label">Acciones</span>
          <strong>Guarda cuando el registro se vea coherente</strong>
          <p>Puedes volver al listado en cualquier momento; el formulario ya esta organizado por grupos para futuras iteraciones.</p>
          <div class="portfolio-side-actions">
            <q-btn flat icon="arrow_back" label="Volver al listado" @click="router.push('/admin')" />
            <q-btn color="primary" icon="save" label="Guardar registro" :loading="saving" @click="save" />
          </div>
        </section>
      </aside>
    </div>
  </q-page>
</template>
