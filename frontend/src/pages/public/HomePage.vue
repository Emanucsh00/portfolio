<script setup>
import { computed, onMounted, ref } from 'vue';
import { profile } from '../../content/profile';
import {
  getPublicPortfolio,
  getPublicProjects,
  getPublicSkills,
  getPublicTechnologies
} from '../../services/public.service';
import {
  getTechnologyIcon,
  getTechnologyInitials,
  getTechnologySurface
} from '../../utils/technologyVisuals';

const portfolio = ref([]);
const projects = ref([]);
const technologies = ref([]);
const skills = ref([]);
const loading = ref(false);

const displayTechnologies = computed(() =>
  technologies.value.length ? technologies.value.slice(0, 8) : profile.fallbackTechnologies.slice(0, 8)
);

const displaySkills = computed(() =>
  skills.value.length ? skills.value.slice(0, 6) : profile.fallbackSkills.slice(0, 6)
);

const displayProjects = computed(() =>
  projects.value.length ? projects.value.slice(0, 3) : profile.fallbackProjects.slice(0, 3)
);

onMounted(async () => {
  loading.value = true;
  try {
    const [portfolioRes, projectsRes, technologiesRes, skillsRes] = await Promise.all([
      getPublicPortfolio(),
      getPublicProjects(),
      getPublicTechnologies(),
      getPublicSkills()
    ]);

    portfolio.value = portfolioRes.data;
    projects.value = projectsRes.data;
    technologies.value = technologiesRes.data;
    skills.value = skillsRes.data;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <q-page class="page-padding personal-home landing-animated">
    <section class="shell-width personal-hero reveal-up reveal-delay-1">
      <div class="personal-hero-copy">
        <div class="eyebrow">PORTAFOLIO PROFESIONAL</div>
        <h1>{{ profile.shortName }}</h1>
        <h2>{{ profile.title }}</h2>
        <p>{{ profile.summary }}</p>
        <p>{{ profile.extendedSummary }}</p>

        <div class="profile-meta">
          <span>{{ profile.location }}</span>
          <a :href="`mailto:${profile.email}`">{{ profile.email }}</a>
          <a :href="profile.githubUrl" target="_blank">{{ profile.github }}</a>
        </div>

        <div class="chip-row">
          <q-chip v-for="item in profile.highlights" :key="item" color="accent" text-color="dark">
            {{ item }}
          </q-chip>
        </div>

        <div class="hero-actions">
          <q-btn color="secondary" label="Ver exposicion" to="/exposition" />
          <q-btn outline color="primary" label="Explorar proyectos" to="/projects" />
        </div>
      </div>

      <aside class="personal-hero-panel reveal-up reveal-delay-2">
        <div class="personal-stat-grid">
          <article class="personal-stat-card">
            <span>Portfolio</span>
            <strong>{{ portfolio.length || 1 }}</strong>
          </article>
          <article class="personal-stat-card">
            <span>Proyectos</span>
            <strong>{{ projects.length || profile.fallbackProjects.length }}</strong>
          </article>
          <article class="personal-stat-card">
            <span>Tecnologias</span>
            <strong>{{ technologies.length || profile.fallbackTechnologies.length }}</strong>
          </article>
          <article class="personal-stat-card">
            <span>Skills</span>
            <strong>{{ skills.length || profile.fallbackSkills.length }}</strong>
          </article>
        </div>

        <div class="personal-focus-card">
          <div class="landing-kicker">ENFOQUE ACTUAL</div>
          <h3>Aplicaciones fullstack, APIs seguras y despliegues productivos</h3>
          <p>Trabajo con soluciones administrativas, dashboards, autenticacion, observabilidad y arquitectura orientada a negocio.</p>
        </div>
      </aside>
    </section>

    <section class="shell-width personal-section reveal-up reveal-delay-2">
      <div class="landing-section-head compact">
        <div class="eyebrow">EXPERIENCIA</div>
        <h2>Trayectoria y fortalezas de trabajo</h2>
      </div>

      <div class="experience-timeline">
        <article
          v-for="item in profile.experience"
          :key="`${item.company}-${item.period}`"
          class="experience-timeline-card"
        >
          <span>{{ item.period }}</span>
          <h3>{{ item.role }}</h3>
          <strong>{{ item.company }}</strong>
          <ul class="landing-list landing-list-tight">
            <li v-for="point in item.points" :key="point">{{ point }}</li>
          </ul>
        </article>
      </div>
    </section>

    <section class="shell-width personal-section reveal-up reveal-delay-3">
      <div class="landing-section-head">
        <div class="eyebrow">STACK TECNICO</div>
        <h2>Tecnologias con las que trabajo</h2>
      </div>

      <div class="tech-grid tech-grid-refined">
        <article
          v-for="item in displayTechnologies"
          :key="item.id"
          class="tech-card tech-card-refined"
        >
          <div class="tech-card-top">
            <div class="tech-icon tech-icon-lg" :style="{ background: getTechnologySurface(item) }">
              <img
                v-if="getTechnologyIcon(item.name)"
                class="tech-icon-image"
                :src="getTechnologyIcon(item.name)"
                :alt="item.name"
              />
              <span v-else>{{ getTechnologyInitials(item.name) }}</span>
            </div>
            <q-badge color="secondary">{{ item.level || 'Core' }}</q-badge>
          </div>

          <div class="tech-copy tech-copy-refined">
            <h3>{{ item.name }}</h3>
            <p>{{ item.category }}</p>
          </div>
        </article>
      </div>
    </section>

    <section class="shell-width personal-section reveal-up reveal-delay-4">
      <div class="personal-two-column">
        <article class="landing-panel">
          <div class="landing-section-head compact">
            <div class="eyebrow">PROYECTOS DESTACADOS</div>
            <h2>Implementaciones relevantes</h2>
          </div>

          <q-inner-loading :showing="loading" />

          <div class="card-grid">
            <article v-for="item in displayProjects" :key="item.id" class="portfolio-card">
              <div class="badge-line badge-space">
                <q-badge color="secondary">{{ item.status || 'published' }}</q-badge>
                <q-badge color="positive" text-color="dark">{{ item.is_public ? 'Publico' : 'Privado' }}</q-badge>
              </div>
              <h3>{{ item.name || item.title }}</h3>
              <p>{{ item.summary }}</p>
            </article>
          </div>
        </article>

        <article class="landing-panel">
          <div class="landing-section-head compact">
            <div class="eyebrow">SOFT SKILLS</div>
            <h2>Forma de trabajo</h2>
          </div>

          <div class="soft-skill-stack">
            <article v-for="item in displaySkills" :key="item.id" class="soft-skill-row">
              <div class="soft-skill-dot"></div>
              <div>
                <h3>{{ item.name }}</h3>
                <p>{{ item.description }}</p>
              </div>
            </article>
          </div>
        </article>
      </div>
    </section>
  </q-page>
</template>
