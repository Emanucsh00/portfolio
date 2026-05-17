<script setup>
import { computed, ref } from 'vue';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../stores/auth.store';

const auth = useAuthStore();
const disableDialogOpen = ref(false);
const disableToken = ref('');
const disableLoading = ref(false);

const cards = computed(() => [
  {
    title: 'Sesion protegida',
    value: auth.authenticated ? 'JWT activo' : 'Sin sesion',
    description: 'El token final solo se entrega tras OTP y TOTP.'
  },
  {
    title: 'Rol actual',
    value: auth.user?.role || 'N/A',
    description: 'Las rutas administrativas verifican JWT y rol.'
  },
  {
    title: '2FA',
    value: auth.user?.totp_enabled ? 'Habilitado' : 'Pendiente',
    description: 'Google Authenticator reforzando el acceso.'
  }
]);

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
    <div class="admin-grid">
      <div class="page-title-block">
        <div class="eyebrow">DASHBOARD V3</div>
        <h1>Centro de control del portafolio</h1>
        <p>Gestiona contenido, seguridad y presencia visual desde un panel mas claro, ordenado y facil de usar.</p>
      </div>

      <section class="admin-summary-band">
        <article class="admin-summary-card">
          <span>Usuario actual</span>
          <strong>{{ auth.user?.full_name || 'Sin perfil cargado' }}</strong>
          <p>{{ auth.user?.email || 'Sin email disponible' }}</p>
        </article>

        <article class="admin-summary-card admin-summary-card-accent">
          <span>Estado del acceso</span>
          <strong>{{ auth.user?.totp_enabled ? 'OTP + TOTP activos' : 'TOTP pendiente' }}</strong>
          <p>Acceso controlado desde backend con JWT propio.</p>
        </article>
      </section>

      <div class="dashboard-cards">
        <article v-for="card in cards" :key="card.title" class="dashboard-card">
          <span>{{ card.title }}</span>
          <strong>{{ card.value }}</strong>
          <p>{{ card.description }}</p>
        </article>

        <article class="dashboard-card">
          <span>Administrar TOTP</span>
          <strong>{{ auth.user?.totp_enabled ? 'Proteccion activa' : 'Sin TOTP activo' }}</strong>
          <p>Para desactivar Google Authenticator debes confirmar con tu codigo actual.</p>
          <q-btn
            v-if="auth.user?.totp_enabled"
            color="negative"
            label="Desactivar TOTP"
            @click="disableDialogOpen = true"
          />
        </article>
      </div>
    </div>

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
