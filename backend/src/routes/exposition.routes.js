import { Router } from 'express';
import {
  createExposition,
  deleteExposition,
  getExposition,
  listExpositions,
  updateExposition
} from '../controllers/exposition.controller.js';

const router = Router();

router.get('/', listExpositions);
router.post('/', createExposition);
router.get('/:id', getExposition);
router.put('/:id', updateExposition);
router.delete('/:id', deleteExposition);

export default router;
