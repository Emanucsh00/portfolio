<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { storeToRefs } from 'pinia';
import { usePortfolioStore } from '../../stores/portfolio.store';

const route = useRoute();
const router = useRouter();
const store = usePortfolioStore();
const { currentItem } = storeToRefs(store);

const isEditing = computed(() => Boolean(route.params.id));

onMounted(async () => {
  if (isEditing.value) {
    await store.fetchItem(route.params.id);
  } else {
    store.resetCurrentItem();
  }
});

function parseListValue(modelKey, value) {
  currentItem.value[modelKey] = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

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
  <q-page class="admin-page form-page">
    <div class="form-shell">
      <div class="form-header">
        <div>
          <div class="eyebrow">FORMULARIO PRINCIPAL</div>
          <h1>{{ isEditing ? 'Editar registro' : 'Nuevo registro' }}</h1>
        </div>
        <q-btn color="primary" label="Guardar" icon="save" @click="save" />
      </div>

      <div class="form-scroll">
        <section class="form-section">
          <h2>1. Informacion principal</h2>
          <div class="form-grid">
            <q-input v-model="currentItem.title" label="Titulo" outlined />
            <q-input v-model="currentItem.subtitle" label="Subtitulo" outlined />
            <q-input v-model="currentItem.slug" label="Slug" outlined />
            <q-input v-model="currentItem.category" label="Categoria" outlined />
            <q-input v-model="currentItem.summary" label="Resumen" outlined type="textarea" autogrow />
            <q-input v-model="currentItem.description" label="Descripcion" outlined type="textarea" autogrow />
          </div>
        </section>

        <section class="form-section">
          <h2>2. Tecnologias y enlaces</h2>
          <div class="form-grid">
            <q-input v-model="currentItem.project_type" label="Tipo de proyecto" outlined />
            <q-input v-model="currentItem.main_technology" label="Tecnologia principal" outlined />
            <q-input
              :model-value="(currentItem.secondary_technologies || []).join(', ')"
              label="Tecnologias secundarias"
              outlined
              @update:model-value="parseListValue('secondary_technologies', $event)"
            />
            <q-input v-model="currentItem.repository_url" label="Repositorio URL" outlined />
            <q-input v-model="currentItem.demo_url" label="Demo URL" outlined />
            <q-input v-model="currentItem.image_url" label="Imagen URL" outlined />
          </div>
        </section>

        <section class="form-section">
          <h2>3. Fechas y estado</h2>
          <div class="form-grid">
            <q-input v-model="currentItem.client_name" label="Cliente" outlined />
            <q-input v-model="currentItem.role_performed" label="Rol desempenado" outlined />
            <q-input v-model="currentItem.difficulty_level" label="Nivel de dificultad" outlined />
            <q-input v-model="currentItem.start_date" label="Fecha de inicio" type="date" outlined />
            <q-input v-model="currentItem.end_date" label="Fecha de fin" type="date" outlined />
            <q-select v-model="currentItem.status" :options="['draft', 'published', 'archived']" label="Estado" outlined />
          </div>
        </section>

        <section class="form-section">
          <h2>4. Detalles del proyecto</h2>
          <div class="form-grid">
            <q-input v-model="currentItem.objective" label="Objetivo" outlined type="textarea" autogrow />
            <q-input v-model="currentItem.result" label="Resultado" outlined type="textarea" autogrow />
            <q-input v-model="currentItem.learnings" label="Aprendizajes" outlined type="textarea" autogrow />
            <q-input
              :model-value="(currentItem.features || []).join(', ')"
              label="Features"
              outlined
              @update:model-value="parseListValue('features', $event)"
            />
          </div>
        </section>

        <section class="form-section">
          <h2>5. Configuracion publica</h2>
          <div class="form-grid">
            <q-toggle v-model="currentItem.is_public" label="Visible publicamente" />
            <q-input v-model.number="currentItem.display_order" label="Orden de despliegue" outlined type="number" />
          </div>
        </section>

        <section class="form-section">
          <h2>6. Notas internas</h2>
          <div class="form-grid single-column">
            <q-input v-model="currentItem.internal_notes" label="Notas internas" outlined type="textarea" autogrow />
          </div>
        </section>
      </div>
    </div>
  </q-page>
</template>
