<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { useAuthStore } from '../../stores/auth.store';

const router = useRouter();
const auth = useAuthStore();

const form = ref({
  email: '',
  password: ''
});
const loading = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

const canSubmit = computed(() => Boolean(form.value.email.trim() && form.value.password));

async function submit() {
  if (!canSubmit.value || loading.value) {
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    await auth.login(form.value.email.trim(), form.value.password);
    await router.push('/verify-email');
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'No fue posible iniciar sesion. Verifica tus credenciales e intenta nuevamente.';

    errorMessage.value = message;
    await Swal.fire('Acceso fallido', message, 'error');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <q-page class="auth-page login-page">
    <div class="login-shell">
      <section class="login-info">
        <div class="eyebrow">LOGIN ADMINISTRATIVO</div>
        <h1>Ingreso con Firebase + doble verificacion</h1>
        <p>
          Accede con tu cuenta principal en Firebase y completa el flujo academico de
          verificacion secuencial: OTP por correo y codigo TOTP de Google Authenticator.
        </p>

        <div class="login-points">
          <article class="login-point">
            <strong>1. Identidad primaria</strong>
            <span>Email y password validados por Firebase Auth.</span>
          </article>
          <article class="login-point">
            <strong>2. OTP por correo</strong>
            <span>El backend genera y envia el codigo temporal al correo del usuario.</span>
          </article>
          <article class="login-point">
            <strong>3. JWT final del sistema</strong>
            <span>Solo se emite despues de completar OTP y TOTP correctamente.</span>
          </article>
        </div>
      </section>

      <section class="login-panel">
        <div class="login-panel-head">
          <span class="login-chip">Acceso seguro</span>
          <h2>Iniciar sesion</h2>
          <p>Ingresa tus credenciales para comenzar el flujo de autenticacion hibrida.</p>
        </div>

        <div v-if="errorMessage" class="login-error">
          {{ errorMessage }}
        </div>

        <form class="auth-form login-form" @submit.prevent="submit">
          <label class="login-field">
            <span class="login-label">Email</span>
            <div class="login-input-wrap">
              <span class="login-input-icon">✉</span>
              <input
                v-model="form.email"
                class="login-input"
                type="email"
                autocomplete="username"
                placeholder="tu-correo@dominio.com"
              />
            </div>
          </label>

          <label class="login-field">
            <span class="login-label">Contrasena</span>
            <div class="login-input-wrap">
              <span class="login-input-icon">●</span>
              <input
                v-model="form.password"
                class="login-input"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Escribe tu contrasena"
              />
              <button
                type="button"
                class="login-toggle"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Ocultar' : 'Ver' }}
              </button>
            </div>
          </label>

          <button
            class="login-submit"
            type="submit"
            :disabled="!canSubmit || loading"
          >
            <span v-if="loading">Autenticando...</span>
            <span v-else>Iniciar sesion</span>
          </button>
        </form>
      </section>
    </div>

    <router-link to="/" class="login-back-link">
      ← Ver portafolio público
    </router-link>
  </q-page>
</template>

<style scoped>
.login-page {
  background: linear-gradient(180deg, #faf7f3 0%, #f2ece6 100%);
}

.login-shell {
  width: min(1100px, 100%);
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 32px;
  align-items: stretch;
}

.login-info,
.login-panel {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(52, 91, 99, 0.08);
  box-shadow: var(--shadow-soft);
  border-radius: var(--radius-lg);
  min-width: 0;
}

.login-info {
  padding: 48px;
  display: grid;
  align-content: space-between;
  gap: 32px;
  background: linear-gradient(160deg, #51463f, #3c3c3c);
  color: white;
}

.login-info .eyebrow,
.login-info p,
.login-point span {
  color: rgba(255, 255, 255, 0.82);
}

.login-info h1 {
  margin: 0;
  font-size: clamp(2.1rem, 4vw, 3.6rem);
  line-height: 1.08;
}

.login-points {
  display: grid;
  gap: 14px;
}

.login-point {
  padding: 20px 22px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.login-point strong,
.login-point span {
  display: block;
}

.login-point strong {
  margin-bottom: 8px;
  font-size: 1rem;
}

.login-panel {
  padding: 42px;
  display: grid;
  align-content: center;
  gap: 20px;
}

.login-panel-head h2 {
  margin: 10px 0 10px;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  color: var(--brand-900);
}

.login-panel-head p {
  margin: 0;
  color: rgba(17, 32, 49, 0.74);
  line-height: 1.7;
}

.login-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(199, 182, 159, 0.28);
  color: var(--brand-900);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-form {
  margin-top: 6px;
}

.login-error {
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid rgba(183, 28, 28, 0.12);
  background: rgba(201, 79, 79, 0.08);
  color: #a12b2b;
  font-weight: 600;
  line-height: 1.5;
}

.login-field {
  display: grid;
  gap: 8px;
}

.login-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--brand-800);
}

.login-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 58px;
  padding: 0 14px;
  border-radius: 16px;
  border: 1px solid rgba(105, 80, 60, 0.14);
  background: rgba(255, 255, 255, 0.88);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.login-input-wrap:focus-within {
  border-color: rgba(105, 80, 60, 0.45);
  box-shadow: 0 0 0 4px rgba(199, 182, 159, 0.18);
}

.login-input-icon {
  flex: 0 0 auto;
  color: var(--brand-600);
  font-size: 1rem;
  font-weight: 700;
}

.login-input {
  width: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--brand-900);
  font-size: 1rem;
  font-family: inherit;
}

.login-input::placeholder {
  color: rgba(17, 32, 49, 0.42);
}

.login-toggle {
  flex: 0 0 auto;
  border: 0;
  background: transparent;
  color: var(--brand-600);
  font-weight: 700;
  cursor: pointer;
}

.login-submit {
  min-height: 54px;
  border-radius: 14px;
  border: 0;
  background: var(--brand-600);
  color: white;
  font-size: 1rem;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.18s ease, opacity 0.18s ease, box-shadow 0.18s ease;
  box-shadow: none;
}

.login-submit:hover:not(:disabled) {
  transform: translateY(-1px);
}

.login-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

@media (max-width: 900px) {
  .login-shell {
    grid-template-columns: 1fr;
  }
}

.login-back-link {
  display: block;
  text-align: center;
  margin-top: 24px;
  color: var(--brand-600);
  font-weight: 600;
  font-size: 0.92rem;
  transition: color 0.18s ease;
}

.login-back-link:hover {
  color: var(--brand-900);
}

@media (max-width: 768px) {
  .login-info,
  .login-panel {
    padding: 26px;
  }
}
</style>
