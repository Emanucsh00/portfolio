<script setup>
import { computed, onMounted, ref } from 'vue';
import { profile } from '../../content/profile';
import { getPublicTechnologies } from '../../services/public.service';
import {
  getTechnologyIcon,
  getTechnologyInitials,
  getTechnologySurface
} from '../../utils/technologyVisuals';

const items = ref([]);
const loading = ref(false);
const displayItems = computed(() => (items.value.length ? items.value : profile.fallbackTechnologies));

const groupedPreview = computed(() => {
  const categories = [...new Set(displayItems.value.map((item) => item.category).filter(Boolean))];
  return categories.slice(0, 4);
});

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getPublicTechnologies();
    items.value = response.data;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <q-page class="page-padding page-rich technologies-page">
    <section class="shell-width page-hero page-hero-compact page-hero-rich">
      <div class="page-hero-copy">
        <div class="eyebrow">TECNOLOGIAS</div>
        <h1>Stack de trabajo</h1>
        <p>
          Tecnologias que uso para construir sistemas administrativos, APIs, interfaces
          modernas y despliegues productivos.
        </p>
      </div>

      <div class="page-hero-aside page-hero-aside-rich">
        <div class="hero-metric">
          <span>Total</span>
          <strong>{{ displayItems.length }}</strong>
        </div>
        <div class="hero-tags">
          <q-chip
            v-for="category in groupedPreview"
            :key="category"
            color="accent"
            text-color="dark"
            dense
          >
            {{ category }}
          </q-chip>
        </div>
      </div>
    </section>

    <div class="shell-width tech-grid tech-grid-refined technologies-grid">
      <q-inner-loading :showing="loading" />
      <article v-for="item in displayItems" :key="item.id" class="tech-card tech-card-refined">
        <div class="tech-card-top">
          <div
            class="tech-icon tech-icon-lg"
            :style="{ background: `linear-gradient(135deg, ${getTechnologySurface(item)}, #ffffff)` }"
          >
            <img
              v-if="getTechnologyIcon(item.name)"
              class="tech-icon-image"
              :src="getTechnologyIcon(item.name)"
              :alt="item.name"
            />
            <span v-else>{{ getTechnologyInitials(item.name) }}</span>
          </div>

          <q-chip color="positive" text-color="dark" class="tech-level">
            {{ item.level || 'Pro' }}
          </q-chip>
        </div>

        <div class="tech-copy tech-copy-refined">
          <h3>{{ item.name }}</h3>
          <p>{{ item.category || 'General' }}</p>
        </div>
      </article>
    </div>
  </q-page>
</template>
