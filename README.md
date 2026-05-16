# Portfolio Fullstack

Monorepo inicial con frontend y backend separados por carpetas:

```text
portfolio-fullstack/
├── backend/
└── frontend/
```

## Stack

- Backend: Node.js, Express, Sequelize, MariaDB/PostgreSQL, JWT, Firebase Admin SDK, Nodemailer, OTP + TOTP
- Frontend: Vue 3, Vite, Quasar como librería UI, Pinia, Vue Router, Axios, Firebase Auth

## Cómo correr en local

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Configura en `backend/.env`:

- Base de datos MariaDB o PostgreSQL
- Credenciales de Firebase Admin SDK
- SMTP para envío de OTP
- `JWT_SECRET` y `CRYPTO_SECRET`
- `CORS_ORIGIN=http://localhost:5173`

Inicia el backend:

```bash
npm run dev
```

El servidor hace `sequelize.sync()` automáticamente al arrancar.

### 2. Crear primer admin

Con el backend ya configurado:

```bash
cd backend
npm run seed:admin -- admin@tu-dominio.com "Administrador Principal" firebase-seed-admin
```

Si omites argumentos, usará `DEFAULT_ADMIN_EMAIL` y `DEFAULT_ADMIN_NAME` del `.env`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Configura en `frontend/.env`:

- `VITE_API_URL=http://localhost:3000/api`
- Todas las variables `VITE_FIREBASE_*` del proyecto Firebase

Inicia el frontend:

```bash
npm run dev
```

## Flujo de login

1. El usuario inicia sesión con email/password en Firebase desde el frontend.
2. El frontend obtiene el Firebase ID Token y lo envía a `POST /api/auth/firebase-login`.
3. El backend valida el token con Firebase Admin SDK, crea o sincroniza el usuario local y genera un challenge temporal.
4. El backend crea un OTP de 6 dígitos, lo hashea y lo envía por correo.
5. El frontend envía el OTP a `POST /api/auth/verify-email-otp`.
6. Si el usuario no tiene TOTP, recibe un setup token temporal y pasa a `/setup-totp`.
7. Si ya tiene TOTP, pasa a `/verify-totp` y envía el código a `POST /api/auth/verify-totp`.
8. Cuando ambas verificaciones se completan, el backend emite el JWT propio.
9. El frontend guarda `portfolio_token` en `localStorage` y Axios lo manda como `Authorization: Bearer ...`.

Documento detallado del flujo: [docs/AUTH_FLOW.md](C:/Users/Castro/Desktop/PORTFOLIO/docs/AUTH_FLOW.md)

## Rutas públicas

- `GET /api/public/portfolio`
- `GET /api/public/projects`
- `GET /api/public/technologies`
- `GET /api/public/soft-skills`
- `GET /api/public/github-history`
- `GET /api/public/exposition`

## Rutas protegidas

Autenticación:

- `POST /api/auth/firebase-login`
- `POST /api/auth/verify-email-otp`
- `POST /api/auth/verify-totp`
- `GET /api/auth/me`

Configuración TOTP:

- `POST /api/2fa/setup`
- `POST /api/2fa/confirm`
- `POST /api/2fa/disable`

Administración:

- `/api/admin/portfolio`
- `/api/admin/projects`
- `/api/admin/technologies`
- `/api/admin/soft-skills`
- `/api/admin/exposition`

## Seguridad incluida

- `helmet`
- CORS con whitelist desde `.env`
- Rate limiting para login, OTP y TOTP
- OTP hasheado con `bcryptjs`
- Secret TOTP cifrado con helper de `crypto`
- JWT firmado y validado por middleware
- Validación de challenge con expiración e intentos máximos
- Respuestas JSON uniformes
- Middleware global de errores

## CI/CD

Se dejaron ejemplos en:

- `.github/workflows/frontend-deploy.yml`
- `.github/workflows/backend-deploy.yml`

Están preparados para build, chequeos básicos y despliegues futuros separados.
