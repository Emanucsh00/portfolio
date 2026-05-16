<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../stores/auth.store';

const auth = useAuthStore();
const router = useRouter();
const setupData = ref({
  otpauthUrl: '',
  qrCodeDataUrl: '',
  expiresAt: ''
});
const token = ref('');
const loading = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  try {
    const payload = await auth.requestTotpSetup();
    setupData.value = {
      ...payload,
      expiresAt: payload.expiresAt ? new Date(payload.expiresAt).toLocaleString() : ''
    };
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'No se pudo iniciar el setup TOTP.';
    errorMessage.value = message;
    Swal.fire('No se pudo iniciar', message, 'error');
    await router.push('/login');
  }
});

async function confirm() {
  if (!token.value.trim() || loading.value) {
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    await auth.confirmTotpSetup(token.value.trim());
    await router.push('/admin');
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'No se pudo confirmar el codigo.';
    errorMessage.value = message;
    Swal.fire('Configuracion invalida', message, 'error');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-page class="auth-page setup-page">
    <div class="auth-card wide setup-card">
      <div class="eyebrow">SETUP TOTP</div>
      <h1>Activa Google Authenticator antes de entrar al panel</h1>
      <p>Escanea el QR con Google Authenticator y luego escribe aqui el codigo de 6 digitos.</p>

      <div v-if="errorMessage" class="setup-error">
        {{ errorMessage }}
      </div>

      <div class="setup-grid">
        <div class="qr-box">
          <img v-if="setupData.qrCodeDataUrl" :src="setupData.qrCodeDataUrl" alt="QR TOTP" />
          <p class="setup-hint">Escanea este QR desde Google Authenticator.</p>
        </div>

        <form class="setup-meta" @submit.prevent="confirm">
          <label class="setup-field">
            <span class="setup-label">Expira</span>
            <input
              :value="setupData.expiresAt"
              class="setup-input setup-input-readonly"
              type="text"
              readonly
            />
          </label>

          <label class="setup-field">
            <span class="setup-label">Codigo de Google Authenticator</span>
            <input
              v-model="token"
              class="setup-input"
              inputmode="numeric"
              maxlength="6"
              autocomplete="one-time-code"
              placeholder="123456"
            />
          </label>

          <button class="setup-submit" type="submit" :disabled="loading || token.trim().length !== 6">
            <span v-if="loading">Confirmando...</span>
            <span v-else>Confirmar y entrar</span>
          </button>
        </form>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.setup-page {
  background: linear-gradient(180deg, #faf7f3 0%, #f2ece6 100%);
}

.setup-card {
  padding: 42px;
}

.setup-error {
  padding: 14px 16px;
  margin-top: 18px;
  border-radius: 16px;
  border: 1px solid rgba(183, 28, 28, 0.12);
  background: rgba(201, 79, 79, 0.08);
  color: #a12b2b;
  font-weight: 600;
}

.setup-hint {
  margin: 14px 0 0;
  text-align: center;
  color: rgba(17, 32, 49, 0.72);
  line-height: 1.6;
}

.setup-field {
  display: grid;
  gap: 8px;
}

.setup-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--brand-800);
}

.setup-input {
  min-height: 58px;
  border-radius: 16px;
  border: 1px solid rgba(105, 80, 60, 0.14);
  background: rgba(255, 255, 255, 0.9);
  padding: 0 16px;
  outline: 0;
  font-size: 1rem;
  color: var(--brand-900);
  font-family: inherit;
}

.setup-input:focus {
  border-color: rgba(105, 80, 60, 0.45);
  box-shadow: 0 0 0 4px rgba(199, 182, 159, 0.18);
}

.setup-input-readonly {
  background: rgba(244, 250, 247, 0.9);
}

.setup-submit {
  min-height: 52px;
  border-radius: 14px;
  border: 0;
  background: var(--brand-600);
  color: white;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: none;
}

.setup-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .setup-card {
    padding: 26px;
  }
}
</style>
