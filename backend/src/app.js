import 'dotenv/config';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import expositionRoutes from './routes/exposition.routes.js';
import portfolioRoutes from './routes/portfolio.routes.js';
import projectRoutes from './routes/project.routes.js';
import publicRoutes from './routes/public.routes.js';
import skillRoutes from './routes/skill.routes.js';
import technologyRoutes from './routes/technology.routes.js';
import twoFactorRoutes from './routes/twoFactor.routes.js';
import { corsOptions } from './config/cors.js';
import { validateEnv, getBooleanEnv } from './config/env.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { requireAuth } from './middlewares/requireAuth.js';
import { requireRole } from './middlewares/requireRole.js';

validateEnv();

const app = express();

if (getBooleanEnv('TRUST_PROXY', false)) {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(compression());
app.use(cors(corsOptions));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Portfolio backend running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin/portfolio', requireAuth, requireRole('admin'), portfolioRoutes);
app.use('/api/admin/projects', requireAuth, requireRole('admin'), projectRoutes);
app.use('/api/admin/technologies', requireAuth, requireRole('admin'), technologyRoutes);
app.use('/api/admin/soft-skills', requireAuth, requireRole('admin'), skillRoutes);
app.use('/api/admin/exposition', requireAuth, requireRole('admin'), expositionRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
