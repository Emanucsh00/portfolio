<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const $q = useQuasar();
const router = useRouter();
const auth = useAuthStore();

const sidebarOpen = ref(false);

const navGroups = [
  {
    label: 'GENERAL',
    links: [
      { label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' }
    ]
  },
  {
    label: 'CONTENIDO',
    links: [
      { label: 'Portfolio', icon: 'table_view', to: '/admin', exact: true },
      { label: 'Proyectos', icon: 'folder_open', to: '/admin/projects' },
      { label: 'Tecnologías', icon: 'code', to: '/admin/technologies' },
      { label: 'Habilidades', icon: 'psychology', to: '/admin/skills' },
      { label: 'Exposición', icon: 'present_to_all', to: '/admin/exposition' }
    ]
  }
];

async function logout() {
  await auth.logout();
  sidebarOpen.value = false;
  router.push('/login');
}

function onNavClick() {
  sidebarOpen.value = false;
}
</script>

<template>
  <q-layout view="lhh LpR lff" class="admin-shell">

    <!-- Mobile top bar -->
    <q-header v-if="$q.screen.lt.md" class="admin-mobile-bar" elevated>
      <q-toolbar class="admin-mobile-toolbar">
        <q-btn flat round dense icon="menu" color="white" class="q-mr-sm" @click="sidebarOpen = true" />
        <div class="admin-mobile-brand">
          <span>PORTFOLIO</span>
          <span>Admin</span>
        </div>
        <q-space />
        <q-btn flat round dense icon="logout" color="white" @click="logout" />
      </q-toolbar>
    </q-header>

    <!-- Sidebar: persistente en desktop, overlay en mobile -->
    <q-drawer
      v-model="sidebarOpen"
      show-if-above
      side="left"
      :width="260"
      class="admin-sidebar-drawer"
    >
      <!-- Brand -->
      <div class="asb-brand" @click="router.push('/admin')">
        <div class="asb-brand-icon">
          <q-icon name="admin_panel_settings" size="22px" />
        </div>
        <div class="asb-brand-text">
          <strong>Portfolio</strong>
          <span>Admin Panel</span>
        </div>
      </div>

      <!-- Navegación agrupada -->
      <nav class="asb-nav">
        <template v-for="group in navGroups" :key="group.label">
          <p class="asb-nav-label">{{ group.label }}</p>
          <router-link
            v-for="link in group.links"
            :key="link.to"
            :to="link.to"
            class="asb-link"
            :exact-active-class="link.exact ? 'asb-link--active' : ''"
            :active-class="link.exact ? '' : 'asb-link--active'"
            @click="onNavClick"
          >
            <q-icon :name="link.icon" size="18px" />
            <span>{{ link.label }}</span>
          </router-link>
        </template>
      </nav>

      <!-- Footer: usuario + acciones -->
      <div class="asb-footer">
        <div class="asb-user">
          <div class="asb-user-avatar">
            <q-icon name="person" size="18px" />
          </div>
          <div class="asb-user-info">
            <strong>{{ auth.user?.full_name || 'Admin' }}</strong>
            <span>{{ auth.user?.email || '' }}</span>
          </div>
        </div>
        <div class="asb-role">{{ auth.user?.role || 'admin' }}</div>
        <button class="asb-footer-btn asb-footer-btn--site" @click="router.push('/'); onNavClick()">
          <q-icon name="public" size="16px" />
          <span>Ver portafolio</span>
        </button>
        <button class="asb-footer-btn asb-footer-btn--logout" @click="logout">
          <q-icon name="logout" size="16px" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </q-drawer>

    <!-- Contenido -->
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
