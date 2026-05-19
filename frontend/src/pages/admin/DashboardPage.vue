<script setup>
import { computed, onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../stores/auth.store';
import { usePortfolioStore } from '../../stores/portfolio.store';

const auth = useAuthStore();
const portfolio = usePortfolioStore();
const disableDialogOpen = ref(false);
const disableToken = ref('');
const disableLoading = ref(false);

const cards = computed(() => [
  {
    title: 'Registros del portfolio',
    value: portfolio.pagination.total || portfolio.items.length || 0,
    description: 'Resumen operativo del CRUD principal.'
  },
  {
    title: 'Sesion protegida',
    value: auth.authenticated ? 'JWT activo' : 'Sin sesion',
    description: 'El token final solo se entrega tras OTP y TOTP.'
  },
  {
    title: '2FA',
    value: auth.user?.totp_enabled ? 'Habilitado' : 'Pendiente',
    description: 'Google Authenticator reforzando el acceso.'
  }
]);

const adminModules = [
  {
    title: 'Portfolio',
    text: 'Tu CRUD mas importante. Ahora esta pensado para editar mejor 25 campos sin perder contexto.',
    icon: 'inventory_2'
  },
  {
    title: 'Tecnologias y skills',
    text: 'Catalogos auxiliares para enriquecer tu presencia tecnica y tus tarjetas publicas.',
    icon: 'deployed_code'
  },
  {
    title: 'Exposicion',
    text: 'Espacio para darle narrativa y peso a la forma en que te presentas.',
    icon: 'campaign'
  }
];

onMounted(async () => {
  if (!portfolio.items.length) {
    await portfolio.fetchItems();
  }
});

async function disableTotp() {
  disableLoading.value = true;
  try {
    await auth.turnOffTotp(disableToken.value);
    disableDialogOpen.value = false;
    disableToken.value = '';
    Swal.fire('TOTP desactivado', 'La doble verificacion fue desactivada correctamente.', 'success');
  } catch (error) {
    Swal.fire('No se pudo desactivar', error.response?.data?.message || error.message, 'error');
  } finally {
    disableLoading.value = false;
  }
}
</script>

<template>
  <q-page class="admin-page">
    <section class="admin-hero admin-hero-dashboard">
      <div class="admin-hero-copy">
        <div class="eyebrow">DASHBOARD</div>
        <h1>Centro de control mas claro para tu panel admin</h1>
        <p>
          El dashboard ahora sirve como punto de entrada real: resume seguridad, volumen de contenido y los modulos
          que sostienen tu portfolio.
        </p>
      </div>

      <div class="admin-hero-panel">
        <div class="admin-hero-stat">
          <span>Usuario actual</span>
          <strong>{{ auth.user?.full_name || 'Sin perfil cargado' }}</strong>
        </div>
        <div class="admin-hero-stat">
          <span>Correo</span>
          <strong>{{ auth.user?.email || 'Sin email disponible' }}</strong>
        </div>
        <div class="admin-hero-stat">
          <span>Rol</span>
          <strong>{{ auth.user?.role || 'N/A' }}</strong>
        </div>
      </div>
    </section>

    <section class="admin-kpi-grid">
      <article v-for="card in cards" :key="card.title" class="admin-kpi-card">
        <span>{{ card.title }}</span>
        <strong>{{ card.value }}</strong>
        <p>{{ card.description }}</p>
      </article>
    </section>

    <section class="admin-summary-band admin-summary-band-rich">
      <article class="admin-summary-card">
        <span>Estado del acceso</span>
        <strong>{{ auth.user?.totp_enabled ? 'OTP + TOTP activos' : 'TOTP pendiente' }}</strong>
        <p>Acceso controlado desde backend con JWT propio y doble verificacion.</p>
      </article>

      <article class="admin-summary-card admin-summary-card-accent">
        <span>Momento del admin</span>
        <strong>Mas orden, menos ruido</strong>
        <p>La refactorizacion prioriza contexto, bloques claros y acciones mas directas para editar.</p>
      </article>
    </section>

    <section class="dashboard-module-grid">
      <article v-for="module in adminModules" :key="module.title" class="dashboard-module-card">
        <q-icon :name="module.icon" size="24px" />
        <strong>{{ module.title }}</strong>
        <p>{{ module.text }}</p>
      </article>

      <article class="dashboard-module-card dashboard-module-card-accent">
        <q-icon name="verified_user" size="24px" />
        <strong>Administrar TOTP</strong>
        <p>Para desactivar Google Authenticator debes confirmar con tu codigo actual.</p>
        <q-btn
          v-if="auth.user?.totp_enabled"
          color="negative"
          label="Desactivar TOTP"
          @click="disableDialogOpen = true"
        />
      </article>
    </section>

    <q-dialog v-model="disableDialogOpen">
      <q-card style="width: min(420px, 92vw);">
        <q-card-section>
          <div class="text-h6">Desactivar TOTP</div>
          <div class="text-body2 q-mt-sm">
            Ingresa el codigo actual de Google Authenticator para confirmar.
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="disableToken"
            label="Codigo actual"
            outlined
            maxlength="6"
            autofocus
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" @click="disableDialogOpen = false" />
          <q-btn color="negative" label="Confirmar" :loading="disableLoading" @click="disableTotp" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
