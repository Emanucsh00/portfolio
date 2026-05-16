<script setup>
import { computed, onMounted, ref } from 'vue';
import { profile } from '../../content/profile';
import { getPublicProjects } from '../../services/public.service';
import { getTechnologyIcon } from '../../utils/technologyVisuals';

const items = ref([]);
const loading = ref(false);
const displayItems = computed(() => (items.value.length ? items.value : profile.fallbackProjects));

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getPublicProjects();
    items.value = response.data;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <q-page class="page-padding page-rich projects-page">
    <section class="shell-width page-hero page-hero-compact page-hero-rich">
      <div class="page-hero-copy">
        <div class="eyebrow">PROYECTOS</div>
        <h1>Implementaciones publicadas</h1>
        <p>
          Soluciones orientadas a negocio, operaciones internas y paneles de control con
          enfoque en claridad, estabilidad y despliegue real.
        </p>

        <div class="hero-feature-row">
          <div class="hero-feature-pill">
            <q-icon name="lan" />
            <span>APIs</span>
          </div>
          <div class="hero-feature-pill">
            <q-icon name="dashboard_customize" />
            <span>Dashboards</span>
          </div>
          <div class="hero-feature-pill">
            <q-icon name="cloud_done" />
            <span>Deploy real</span>
          </div>
        </div>
      </div>

      <aside class="page-hero-aside page-hero-aside-rich">
        <div class="hero-metric">
          <span>Total</span>
          <strong>{{ displayItems.length }}</strong>
        </div>
        <div class="hero-tags">
          <q-chip color="secondary" text-color="white">Node.js</q-chip>
          <q-chip color="accent" text-color="dark">Vue 3</q-chip>
          <q-chip color="primary" text-color="white">AWS</q-chip>
        </div>
      </aside>
    </section>

    <div class="shell-width card-grid projects-grid">
      <q-inner-loading :showing="loading" />

      <article v-for="item in displayItems" :key="item.id" class="portfolio-card project-card">
        <div class="badge-line badge-space">
          <q-badge color="secondary">{{ item.status }}</q-badge>
          <q-badge color="positive" text-color="dark">{{ item.is_public ? 'Publico' : 'Privado' }}</q-badge>
        </div>

        <div class="project-card-icon">
          <q-icon name="deployed_code" />
        </div>

        <h3>{{ item.name }}</h3>
        <p>{{ item.summary }}</p>

        <div class="chip-row chip-grid">
          <q-chip
            v-for="tech in item.technologies || []"
            :key="tech"
            color="accent"
            text-color="dark"
            dense
          >
            <q-avatar v-if="getTechnologyIcon(tech)" rounded>
              <img :src="getTechnologyIcon(tech)" :alt="tech" />
            </q-avatar>
            {{ tech }}
          </q-chip>
        </div>

        <div class="link-row">
          <a v-if="item.repository_url" class="inline-link" :href="item.repository_url" target="_blank">Repositorio</a>
          <a v-if="item.demo_url" class="inline-link" :href="item.demo_url" target="_blank">Demo</a>
        </div>
      </article>
    </div>
  </q-page>
</template>
