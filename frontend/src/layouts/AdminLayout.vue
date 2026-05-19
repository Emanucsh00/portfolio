<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const auth = useAuthStore();

const userMeta = computed(() => ({
  name: auth.user?.full_name || 'Portfolio Admin',
  email: auth.user?.email || 'Sin correo',
  role: auth.user?.role || 'admin'
}));

async function logout() {
  await auth.logout();
  router.push('/login');
}
</script>

<template>
  <q-layout view="hHh lpR fFf" class="admin-layout-shell">
    <q-header class="admin-layout-header">
      <q-toolbar class="admin-layout-toolbar">
        <div class="admin-layout-brand">
          <span class="admin-layout-kicker">ADMIN</span>
          <strong>Modulo CRUD</strong>
        </div>

        <q-space />

        <div class="admin-layout-user">
          <span>{{ userMeta.name }}</span>
          <small>{{ userMeta.email }}</small>
          <em>{{ userMeta.role }}</em>
        </div>

        <div class="admin-layout-actions">
          <q-btn unelevated color="primary" icon="public" label="Landing page" @click="router.push('/')" />
          <q-btn unelevated color="negative" icon="logout" label="Cerrar sesion" @click="logout" />
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="admin-layout-container">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.admin-layout-shell {
  background: linear-gradient(180deg, #f3f6fb 0%, #e9eef6 100%);
}

.admin-layout-header {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
  color: #0f172a;
}

.admin-layout-toolbar {
  min-height: 78px;
  padding: 0 24px;
  gap: 18px;
}

.admin-layout-brand {
  display: grid;
  gap: 4px;
}

.admin-layout-kicker {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #2563eb;
}

.admin-layout-brand strong {
  font-size: 1.08rem;
  line-height: 1.2;
  color: #0f172a;
}

.admin-layout-user {
  display: grid;
  justify-items: end;
  gap: 2px;
  text-align: right;
}

.admin-layout-user span {
  color: #0f172a;
  font-weight: 700;
}

.admin-layout-user small {
  color: #64748b;
}

.admin-layout-user em {
  color: #2563eb;
  font-style: normal;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 800;
}

.admin-layout-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.admin-layout-container {
  background: transparent;
}

@media (max-width: 900px) {
  .admin-layout-toolbar {
    padding: 14px 16px;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .admin-layout-user {
    justify-items: start;
    text-align: left;
  }

  .admin-layout-actions {
    width: 100%;
  }

  .admin-layout-actions :deep(.q-btn) {
    flex: 1 1 220px;
  }
}
</style>
