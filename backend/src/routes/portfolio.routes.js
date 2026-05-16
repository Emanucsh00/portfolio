import { Router } from 'express';
import {
  createPortfolio,
  deletePortfolio,
  getPortfolioById,
  listPortfolio,
  patchPortfolioStatus,
  updatePortfolio
} from '../controllers/portfolio.controller.js';

const router = Router();

router.get('/', listPortfolio);
router.post('/', createPortfolio);
router.get('/:id', getPortfolioById);
router.put('/:id', updatePortfolio);
router.patch('/:id/status', patchPortfolioStatus);
router.delete('/:id', deletePortfolio);

export default router;
