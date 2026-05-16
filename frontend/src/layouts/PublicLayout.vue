<script setup>
import { useUiStore } from '../stores/ui.store';
import { profile } from '../content/profile';

const ui = useUiStore();

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Proyectos', to: '/projects' },
  { label: 'Tecnologias', to: '/technologies' },
  { label: 'Habilidades', to: '/skills' },
  { label: 'GitHub', to: '/github-history' },
  { label: 'Exposicion', to: '/exposition' }
];
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="public-shell">
    <q-header class="public-header">
      <div class="header-gradient-bar"></div>
      <div class="shell-width public-header-inner">
        <q-toolbar class="public-toolbar">
          <div class="brand-block">
            <div class="brand-kicker">PORTFOLIO</div>
            <div class="brand-title">{{ profile.shortName }} - Fullstack Developer</div>
            <div class="brand-subtitle">{{ profile.title }}</div>
          </div>

          <q-space />

          <div class="desktop-nav gt-sm">
            <router-link
              v-for="link in navLinks"
              :key="link.to"
              :to="link.to"
              class="nav-link"
            >
              {{ link.label }}
            </router-link>
            <router-link to="/login" class="nav-link nav-cta">Admin</router-link>
          </div>

          <q-btn
            flat
            round
            dense
            icon="menu"
            class="lt-md"
            @click="ui.toggleMobileMenu()"
          />
        </q-toolbar>
      </div>
    </q-header>

    <q-drawer v-model="ui.mobileMenuOpen" side="right" overlay bordered class="lt-md">
      <q-list padding>
        <q-item
          v-for="link in navLinks"
          :key="link.to"
          clickable
          :to="link.to"
          @click="ui.closeMobileMenu()"
        >
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
        <q-item clickable to="/login" @click="ui.closeMobileMenu()">
          <q-item-section>Admin</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

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
