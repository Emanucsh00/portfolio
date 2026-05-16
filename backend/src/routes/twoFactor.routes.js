import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  confirmTotp,
  disableTotp,
  setupTotp
} from '../controllers/twoFactor.controller.js';
import {
  disableTotpValidation,
  totpSetupConfirmValidation
} from '../middlewares/authValidators.js';
import { requireAuth, requireAuthOrSetupToken } from '../middlewares/requireAuth.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = Router();

const setupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many 2FA setup attempts, please try again later.' }
});

router.post('/setup', setupLimiter, requireAuthOrSetupToken, setupTotp);
router.post('/confirm', setupLimiter, totpSetupConfirmValidation, validateRequest, requireAuthOrSetupToken, confirmTotp);
router.post('/disable', setupLimiter, requireAuth, disableTotpValidation, validateRequest, disableTotp);

export default router;
