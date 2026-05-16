import { Router } from 'express';
import {
  createTechnology,
  deleteTechnology,
  getTechnology,
  listTechnologies,
  updateTechnology
} from '../controllers/technology.controller.js';

const router = Router();

router.get('/', listTechnologies);
router.post('/', createTechnology);
router.get('/:id', getTechnology);
router.put('/:id', updateTechnology);
router.delete('/:id', deleteTechnology);

export default router;
