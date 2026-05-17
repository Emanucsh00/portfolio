<script setup>
import { ref } from 'vue';
import { profile } from '../content/profile';

const mobileOpen = ref(false);

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Proyectos', to: '/projects' },
  { label: 'Tecnologias', to: '/technologies' },
  { label: 'Habilidades', to: '/skills' },
  { label: 'GitHub', to: '/github-history' },
  { label: 'Exposicion', to: '/exposition' }
];

function close() {
  mobileOpen.value = false;
}
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="public-shell">
    <q-header
      class="public-header"
      :class="{ 'public-header--open': mobileOpen }"
    >
      <div class="header-gradient-bar"></div>

      <div class="shell-width public-toolbar-wrap">
        <div class="public-toolbar">
          <div class="brand-block" @click="$router.push('/')">
            <div class="brand-kicker">PORTFOLIO</div>
            <div class="brand-title">{{ profile.shortName }} - Fullstack Developer</div>
            <div class="brand-subtitle">{{ profile.title }}</div>
          </div>

          <nav class="desktop-nav">
            <router-link
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="nav-link"
            >{{ link.label }}</router-link>
            <router-link to="/login" class="nav-link nav-cta">Admin</router-link>
          </nav>

          <button
            class="nav-hamburger"
            :class="{ 'nav-hamburger--open': mobileOpen }"
            aria-label="Abrir menú"
            @click="mobileOpen = !mobileOpen"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div class="mobile-nav" :class="{ 'mobile-nav--open': mobileOpen }">
        <div class="shell-width mobile-nav-inner">
          <router-link
            v-for="(link, i) in navLinks"
            :key="link.to"
            :to="link.to"
            class="mobile-nav-link"
            @click="close"
          >
            <span class="mobile-nav-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <span>{{ link.label }}</span>
          </router-link>
          <router-link to="/login" class="mobile-nav-cta" @click="close">
            Panel Admin
          </router-link>
        </div>
      </div>
    </q-header>

    <q-page-container>
      <main class="public-main">
        <router-view />
      </main>

      <footer class="public-footer">
        <div class="shell-width footer-inner">
          <div class="footer-copy">
            <strong>Portfolio Fullstack</strong>
            <p>Vue 3, Quasar, Express, Sequelize, JWT y doble factor secuencial.</p>
          </div>
          <div class="footer-badges">
            <div class="footer-chip">Responsive desktop / tablet / mobile</div>
            <div class="footer-chip footer-chip-accent">Firebase + OTP + TOTP</div>
          </div>
        </div>
      </footer>
    </q-page-container>
  </q-layout>
</template>
