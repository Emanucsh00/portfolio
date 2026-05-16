import { Router } from 'express';
import {
  createSkill,
  deleteSkill,
  getSkill,
  listSkills,
  updateSkill
} from '../controllers/skill.controller.js';

const router = Router();

router.get('/', listSkills);
router.post('/', createSkill);
router.get('/:id', getSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

export default router;
