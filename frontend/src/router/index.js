import { createRouter, createWebHistory } from 'vue-router';
import PublicLayout from '../layouts/PublicLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import HomePage from '../pages/public/HomePage.vue';
import ProjectsPage from '../pages/public/ProjectsPage.vue';
import TechnologiesPage from '../pages/public/TechnologiesPage.vue';
import SkillsPage from '../pages/public/SkillsPage.vue';
import GithubHistoryPage from '../pages/public/GithubHistoryPage.vue';
import ExpositionPage from '../pages/public/ExpositionPage.vue';
import LoginPage from '../pages/auth/LoginPage.vue';
import VerifyEmailOtpPage from '../pages/auth/VerifyEmailOtpPage.vue';
import VerifyTotpPage from '../pages/auth/VerifyTotpPage.vue';
import SetupTotpPage from '../pages/auth/SetupTotpPage.vue';
import PortfolioCrudPage from '../pages/admin/PortfolioCrudPage.vue';
import PortfolioFormPage from '../pages/admin/PortfolioFormPage.vue';
import { useAuthStore } from '../stores/auth.store';

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: HomePage },
      { path: 'projects', name: 'projects', component: ProjectsPage },
      { path: 'technologies', name: 'technologies', component: TechnologiesPage },
      { path: 'skills', name: 'skills', component: SkillsPage },
      { path: 'github-history', name: 'github-history', component: GithubHistoryPage },
      { path: 'exposition', name: 'exposition', component: ExpositionPage }
    ]
  },
  { path: '/login', name: 'login', component: LoginPage, meta: { guestOnly: true } },
  { path: '/verify-email', name: 'verify-email', component: VerifyEmailOtpPage },
  { path: '/verify-totp', name: 'verify-totp', component: VerifyTotpPage },
  { path: '/setup-totp', name: 'setup-totp', component: SetupTotpPage },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'admin-portfolio', component: PortfolioCrudPage },
      { path: 'new', name: 'admin-portfolio-new', component: PortfolioFormPage },
      { path: ':id', name: 'admin-portfolio-edit', component: PortfolioFormPage }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.challengeToken && auth.isChallengeExpired()) {
    auth.clearChallengeState();
    if (['verify-email', 'verify-totp', 'setup-totp'].includes(String(to.name))) {
      return { name: 'login' };
    }
  }

  if (auth.token && !auth.user) {
    await auth.loadProfile();
  }

  if (to.meta.guestOnly && auth.authenticated) {
    return { name: 'admin-portfolio' };
  }

  if (to.meta.requiresAuth && !auth.authenticated) {
    return { name: 'login' };
  }

  if (to.name === 'verify-email' && !auth.challengeToken) {
    return { name: 'login' };
  }

  if (to.name === 'verify-totp' && !auth.challengeToken) {
    return { name: 'login' };
  }

  if (to.name === 'setup-totp' && !auth.setupToken) {
    return { name: 'login' };
  }

  return true;
});

export default router;
