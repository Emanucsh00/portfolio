# Auth Flow

## Alcance

Este proyecto usa un flujo de autenticacion hibrida y secuencial:

1. Firebase Auth con email/password como identidad primaria.
2. OTP por correo generado y enviado desde el backend.
3. TOTP de Google Authenticator generado y validado desde el backend.
4. JWT propio del sistema emitido solo despues de completar OTP + TOTP.

No se usa MFA nativo de Firebase. El proyecto no implementa `multiFactor`, `getMultiFactorResolver`, `PhoneAuthProvider`, `RecaptchaVerifier` ni APIs equivalentes porque el requerimiento academico pide factores personalizados y secuenciales.

## Flujo completo

1. El usuario inicia sesion con email/password en Firebase desde el frontend.
2. El frontend obtiene el Firebase ID token y lo envia a `POST /api/auth/firebase-login`.
3. El backend valida el ID token con Firebase Admin SDK.
4. El backend crea o sincroniza el usuario local por `firebase_uid` y `email`.
5. El backend crea un `login challenge` temporal.
6. El backend genera un OTP de 6 digitos, lo hashea y lo envia por SMTP.
7. El frontend envia el OTP a `POST /api/auth/verify-email-otp`.
8. Si el usuario ya tiene TOTP activo, envia el codigo a `POST /api/auth/verify-totp`.
9. Si el usuario aun no tiene TOTP activo, el backend entrega un setup token temporal para completar el enrolamiento inicial sin emitir todavia el JWT final.
10. El frontend pide `POST /api/2fa/setup`.
11. El backend genera un secret TOTP pendiente, lo guarda cifrado en servidor y devuelve solo `otpauthUrl`, `qrCodeDataUrl` y `expiresAt`.
12. El frontend muestra el QR y envia unicamente el codigo a `POST /api/2fa/confirm`.
13. El backend valida el codigo contra el secret pendiente. Si es valido, mueve el secret a `totp_secret_encrypted`, activa `totp_enabled` y limpia el estado pendiente.
14. Solo entonces el backend emite el JWT propio que protege `/api/admin/*`.

## Tokens del sistema

- `firebaseToken`: ID token emitido por Firebase. Solo se usa al inicio del flujo.
- `challengeToken`: token temporal del challenge de login para OTP/TOTP.
- `setupToken`: JWT temporal del backend para permitir el primer enrolamiento TOTP antes del JWT final.
- `portfolio_token`: JWT final del backend. Es el token que protege `/admin`.

## OTP por correo

- Lo genera el backend.
- Se almacena hasheado.
- Tiene expiracion y limite de intentos.
- Tiene limite de reenvios y cooldown.

## TOTP de Google Authenticator

### Setup

- `POST /api/2fa/setup` acepta JWT final o setup token temporal.
- El backend genera el secret TOTP y lo guarda en:
  - `pending_totp_secret_encrypted`
  - `pending_totp_expires_at`
- El secret no vuelve del frontend al backend.

### Confirmacion

- `POST /api/2fa/confirm` recibe solo:

```json
{
  "token": "123456"
}
```

- El backend carga el secret pendiente del usuario.
- Si expiro, limpia el pending secret y exige reiniciar setup.
- Si el codigo es valido, activa TOTP definitivo.

### Desactivacion

- `POST /api/2fa/disable` requiere JWT final del backend.
- El frontend debe pedir el codigo actual de Google Authenticator.
- El backend valida el codigo contra `totp_secret_encrypted`.
- Si es valido:
  - `totp_enabled = false`
  - `totp_secret_encrypted = null`
  - `pending_totp_secret_encrypted = null`
  - `pending_totp_expires_at = null`
  - `last_totp_step = null`

## Challenge de login

- Siempre esta ligado a `user_id`.
- Guarda `user_agent` como senal obligatoria.
- La IP se comporta segun `AUTH_CHALLENGE_STRICT_IP`.

### `AUTH_CHALLENGE_STRICT_IP=false`

- No bloquea si cambia la IP durante el flujo.
- Registra un evento de seguridad si detecta cambio.
- Es la opcion recomendada para desarrollo y despliegues detras de proxies, Nginx, Render, Railway o balanceadores.

### `AUTH_CHALLENGE_STRICT_IP=true`

- Exige coincidencia exacta de IP en cada paso del challenge.
- Conviene solo cuando la infraestructura tiene `TRUST_PROXY` bien configurado y la IP del cliente es estable.

## Relacion entre sesion local y Firebase

- Despues del login inicial, el sistema trabaja con el JWT propio del backend.
- El backend no conserva el Firebase ID token original para cada request protegida.
- Si `AUTH_CHECK_FIREBASE_REVOKED=true`, el middleware local puede consultar Firebase Admin con `firebase_uid` para verificar que el usuario aun exista y que no este `disabled`.
- Esto no equivale a validar revocacion inmediata del ID token original de Firebase, porque la sesion activa ya depende del JWT local.

## Variables relevantes de backend

- `REQUIRE_FIREBASE_EMAIL_VERIFIED`
- `AUTH_CHALLENGE_TTL_MINUTES`
- `AUTH_OTP_TTL_MINUTES`
- `AUTH_OTP_MAX_ATTEMPTS`
- `AUTH_TOTP_MAX_ATTEMPTS`
- `AUTH_OTP_RESEND_MAX`
- `AUTH_OTP_RESEND_COOLDOWN_SECONDS`
- `AUTH_TOTP_SETUP_TTL_MINUTES`
- `AUTH_CHALLENGE_STRICT_IP`
- `AUTH_CHECK_FIREBASE_REVOKED`
- `TRUST_PROXY`
