<script setup>
import { computed, onMounted, ref } from 'vue';
import { profile } from '../../content/profile';
import { getPublicSkills } from '../../services/public.service';

const items = ref([]);
const loading = ref(false);
const displayItems = computed(() => (items.value.length ? items.value : profile.fallbackSkills));

const skillVisuals = {
  'skill-results': { icon: 'track_changes', tone: 'skill-card-amber' },
  'skill-adaptation': { icon: 'sync_alt', tone: 'skill-card-sky' },
  'skill-analysis': { icon: 'analytics', tone: 'skill-card-rose' },
  'skill-collaboration': { icon: 'groups', tone: 'skill-card-mint' },
  'skill-ownership': { icon: 'rocket_launch', tone: 'skill-card-plum' },
  'skill-problem-solving': { icon: 'auto_fix_high', tone: 'skill-card-sand' }
};

const getSkillIcon = (item) => skillVisuals[item.id]?.icon || 'workspace_premium';
const getSkillTone = (item) => skillVisuals[item.id]?.tone || 'skill-card-sand';

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getPublicSkills();
    items.value = response.data;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <q-page class="page-padding page-rich skills-page">
    <section class="shell-width page-hero page-hero-compact page-hero-rich">
      <div class="page-hero-copy">
        <div class="eyebrow">SOFT SKILLS</div>
        <h1>Capacidades de colaboracion</h1>
        <p>
          Habilidades blandas aplicadas a trabajo real: comunicacion, analisis, ejecucion y
          resolucion de problemas en equipos tecnicos.
        </p>

        <div class="hero-feature-row">
          <div class="hero-feature-pill">
            <q-icon name="groups_2" />
            <span>Equipo</span>
          </div>
          <div class="hero-feature-pill">
            <q-icon name="query_stats" />
            <span>Analisis</span>
          </div>
          <div class="hero-feature-pill">
            <q-icon name="bolt" />
            <span>Ejecucion</span>
          </div>
        </div>
      </div>

      <aside class="page-hero-aside page-hero-aside-rich">
        <div class="hero-metric">
          <span>Total</span>
          <strong>{{ displayItems.length }}</strong>
        </div>
        <div class="hero-tags">
          <q-chip color="accent" text-color="dark">Trabajo en equipo</q-chip>
          <q-chip color="secondary" text-color="white">Entrega end-to-end</q-chip>
        </div>
      </aside>
    </section>

    <div class="shell-width card-grid skills-grid">
      <q-inner-loading :showing="loading" />

      <article
        v-for="item in displayItems"
        :key="item.id"
        :class="['portfolio-card', 'skill-card', getSkillTone(item)]"
      >
        <div :class="['skill-icon-wrap', `${getSkillTone(item)}-icon`]">
          <q-icon :name="getSkillIcon(item)" />
        </div>
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
      </article>
    </div>
  </q-page>
</template>
