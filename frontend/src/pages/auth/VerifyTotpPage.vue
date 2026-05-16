<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../stores/auth.store';

const auth = useAuthStore();
const router = useRouter();
const token = ref('');
const loading = ref(false);
const errorMessage = ref('');

async function submit() {
  if (!token.value.trim() || loading.value) {
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    await auth.submitTotp(token.value.trim());
    await router.push('/admin');
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'No se pudo validar el codigo TOTP.';
    errorMessage.value = message;
    Swal.fire('TOTP invalido', message, 'error');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-page class="auth-page otp-page">
    <div class="otp-shell">
      <div class="auth-card otp-card">
        <div class="eyebrow">PASO 3</div>
        <h1>Introduce el codigo de Google Authenticator</h1>
        <p>Solo cuando el TOTP es valido el backend firma el JWT final del sistema.</p>

        <div v-if="errorMessage" class="otp-error">
          {{ errorMessage }}
        </div>

        <form class="auth-form otp-form" @submit.prevent="submit">
          <label class="otp-field">
            <span class="otp-label">Codigo TOTP</span>
            <input
              v-model="token"
              class="otp-input"
              inputmode="numeric"
              maxlength="6"
              autocomplete="one-time-code"
              placeholder="123456"
            />
          </label>

          <button class="otp-submit" type="submit" :disabled="loading || token.trim().length !== 6">
            <span v-if="loading">Validando...</span>
            <span v-else>Ingresar al panel</span>
          </button>
        </form>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.otp-page {
  background: linear-gradient(180deg, #faf7f3 0%, #f2ece6 100%);
}

.otp-shell {
  width: min(640px, 100%);
}

.otp-card {
  width: 100%;
  padding: 42px;
}

.otp-error {
  padding: 14px 16px;
  margin-top: 18px;
  border-radius: 16px;
  border: 1px solid rgba(183, 28, 28, 0.12);
  background: rgba(201, 79, 79, 0.08);
  color: #a12b2b;
  font-weight: 600;
}

.otp-form {
  margin-top: 24px;
}

.otp-field {
  display: grid;
  gap: 8px;
}

.otp-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--brand-800);
}

.otp-input {
  min-height: 58px;
  border-radius: 16px;
  border: 1px solid rgba(105, 80, 60, 0.14);
  background: rgba(255, 255, 255, 0.9);
  padding: 0 16px;
  outline: 0;
  font-size: 1.05rem;
  letter-spacing: 0.18em;
  color: var(--brand-900);
  font-family: inherit;
}

.otp-input:focus {
  border-color: rgba(105, 80, 60, 0.45);
  box-shadow: 0 0 0 4px rgba(199, 182, 159, 0.18);
}

.otp-submit {
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

.otp-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .otp-card {
    padding: 26px;
  }
}
</style>
