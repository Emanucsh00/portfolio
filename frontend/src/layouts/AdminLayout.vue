<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useUiStore } from '../stores/ui.store';

const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();

const links = computed(() => [
  { label: 'Registros', icon: 'table_view', to: '/admin' },
  { label: 'Nuevo registro', icon: 'post_add', to: '/admin/new' }
]);

async function logout() {
  await auth.logout();
  ui.closeMobileMenu();
  router.push('/login');
}
</script>

<template>
  <q-layout view="lHh Lpr lFf" class="admin-shell">
    <q-header class="admin-header">
      <div class="admin-header-strip"></div>
      <q-toolbar class="shell-width admin-toolbar">
        <q-btn flat round dense icon="menu" class="lt-lg" @click="ui.toggleMobileMenu()" />
        <div class="admin-toolbar-copy">
          <div class="brand-kicker">ADMINISTRACION</div>
          <div class="admin-toolbar-title">CRUD principal del portafolio</div>
        </div>
        <q-space />
        <div class="header-user gt-xs">
          <span>{{ auth.user?.full_name || 'Usuario' }}</span>
          <q-chip color="secondary" text-color="white" size="sm">{{ auth.user?.role || 'admin' }}</q-chip>
        </div>
        <q-btn unelevated icon="logout" label="Cerrar sesion" class="admin-logout-btn" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="ui.mobileMenuOpen" side="left" overlay bordered class="admin-drawer lt-lg">
      <div class="drawer-head">
        <div class="brand-kicker">ADMIN</div>
        <div class="brand-title small">{{ auth.user?.full_name || 'Portfolio Admin' }}</div>
        <div class="brand-subtitle">{{ auth.user?.email }}</div>
        <div class="admin-drawer-badge">JWT activo</div>
      </div>
      <q-list padding>
        <q-item v-for="link in links" :key="link.to" clickable :to="link.to" exact @click="ui.closeMobileMenu()">
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>{{ link.label }}</q-item-section>
        </q-item>
      </q-list>
      <div class="drawer-footer">
        <q-btn unelevated color="secondary" icon="logout" label="Cerrar sesion" class="full-width" @click="logout" />
      </div>
    </q-drawer>

    <q-page-container>
      <div class="admin-app shell-width">
        <aside class="admin-sidebar gt-md">
          <div class="admin-sidebar-head">
            <div class="brand-kicker">ADMIN</div>
            <h2>Formulario central</h2>
            <p>Un solo CRUD con 25 campos para crear, editar y publicar registros.</p>
          </div>

          <div class="admin-user-card">
            <span>{{ auth.user?.role || 'admin' }}</span>
            <strong>{{ auth.user?.full_name || 'Portfolio Admin' }}</strong>
            <p>{{ auth.user?.email || 'Sin correo disponible' }}</p>
          </div>

          <nav class="admin-sidebar-nav">
            <router-link
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="admin-nav-link"
            >
              <q-icon :name="link.icon" size="18px" />
              <span>{{ link.label }}</span>
            </router-link>
          </nav>

          <div class="admin-sidebar-actions">
            <q-btn unelevated color="primary" icon="post_add" label="Nuevo registro" class="full-width" @click="router.push('/admin/new')" />
            <q-btn unelevated color="secondary" icon="logout" label="Cerrar sesion" class="full-width" @click="logout" />
            <q-btn flat color="secondary" icon="open_in_new" label="Ver sitio publico" class="full-width" @click="router.push('/')" />
          </div>
        </aside>

        <section class="admin-content">
          <router-view />
        </section>
      </div>
    </q-page-container>
  </q-layout>
</template>
