<script setup>
import { computed, onMounted, ref } from 'vue';
import { getGithubHistory } from '../../services/github.service';

const loading = ref(false);
const github = ref({
  username: '',
  profile: null,
  repositories: [],
  recentEvents: []
});

const repositoryCount = computed(() => github.value.repositories?.length || 0);
const profileName = computed(() => github.value.profile?.name || github.value.username || 'GitHub');

onMounted(async () => {
  loading.value = true;
  try {
    const response = await getGithubHistory();
    github.value = response.data;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <q-page class="page-padding">
    <section class="shell-width page-hero page-hero-compact">
      <div class="page-hero-copy">
        <div class="eyebrow">GITHUB HISTORY</div>
        <h1>Actividad y repositorios publicos</h1>
        <p v-if="github.username">@{{ github.username }}</p>
      </div>

      <aside class="page-hero-aside">
        <div class="hero-metric">
          <span>Perfil en GitHub</span>
          <strong>{{ github.username || 'Sin usuario' }}</strong>
        </div>
        <div class="hero-tags">
          <q-chip color="secondary" text-color="white">Repos {{ repositoryCount }}</q-chip>
          <q-chip color="accent" text-color="dark">Perfil publico</q-chip>
        </div>
      </aside>
    </section>

    <div class="shell-width section-grid">
      <div class="section-card">
        <div v-if="github.profile" class="github-profile-card">
          <img :src="github.profile.avatar_url" :alt="profileName" class="github-avatar" />
          <div class="github-profile-copy">
            <h2>{{ profileName }}</h2>
            <p class="github-handle">@{{ github.profile.login }}</p>
            <p v-if="github.profile.bio">{{ github.profile.bio }}</p>

            <div class="chip-row">
              <q-chip color="secondary" text-color="white">{{ github.profile.public_repos }} repos</q-chip>
              <q-chip color="accent" text-color="dark">{{ github.profile.followers }} followers</q-chip>
              <q-chip color="positive" text-color="dark">{{ github.profile.following }} following</q-chip>
            </div>

            <div class="chip-row" v-if="github.profile.location || github.profile.company">
              <q-chip v-if="github.profile.location" outline color="secondary">{{ github.profile.location }}</q-chip>
              <q-chip v-if="github.profile.company" outline color="secondary">{{ github.profile.company }}</q-chip>
            </div>

            <a :href="github.profile.html_url" class="inline-link" target="_blank">Abrir perfil en GitHub</a>
          </div>
        </div>

        <h2>Repositorios</h2>

        <div class="card-grid">
          <q-inner-loading :showing="loading" />

          <article v-for="repo in github.repositories" :key="repo.id" class="portfolio-card">
            <h3>{{ repo.name }}</h3>
            <p>{{ repo.description }}</p>

            <div class="chip-row">
              <q-chip color="secondary" text-color="white">{{ repo.language || 'N/A' }}</q-chip>
              <q-chip color="accent" text-color="dark">Stars {{ repo.stargazers_count }}</q-chip>
            </div>

            <a class="inline-link" :href="repo.html_url" target="_blank">Abrir repositorio</a>
          </article>
        </div>
      </div>

      <div class="section-card">
        <h2>Panel visual</h2>

        <div v-if="github.profile" class="github-visual-stage">
          <div class="github-visual-orb github-visual-orb-a" />
          <div class="github-visual-orb github-visual-orb-b" />
          <div class="github-visual-orb github-visual-orb-c" />

          <div class="github-visual-mark">
            <div class="github-visual-ring" />
            <div class="github-visual-core">
              <span>GitHub</span>
              <strong>{{ github.profile.login }}</strong>
            </div>
          </div>

          <div class="github-visual-caption">
            <span>Presencia publica</span>
            <p>{{ profileName }}</p>
          </div>

          <div class="github-visual-grid">
            <div class="github-visual-dot" />
            <div class="github-visual-dot" />
            <div class="github-visual-dot" />
            <div class="github-visual-dot" />
            <div class="github-visual-dot" />
            <div class="github-visual-dot" />
            <div class="github-visual-dot" />
            <div class="github-visual-dot" />
            <div class="github-visual-dot" />
          </div>
        </div>

        <div v-else class="github-visual-stage" />
      </div>
    </div>
  </q-page>
</template>
