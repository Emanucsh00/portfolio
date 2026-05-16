import { Router } from 'express';
import {
  publicExposition,
  publicGithubHistory,
  publicPortfolio,
  publicProjects,
  publicSkills,
  publicTechnologies
} from '../controllers/public.controller.js';

const router = Router();

router.get('/portfolio', publicPortfolio);
router.get('/projects', publicProjects);
router.get('/technologies', publicTechnologies);
router.get('/soft-skills', publicSkills);
router.get('/github-history', publicGithubHistory);
router.get('/exposition', publicExposition);

export default router;
