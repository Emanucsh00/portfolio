import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  firebaseLogin,
  me,
  resendEmailOtp,
  verifyEmailOtp,
  verifyTotp
} from '../controllers/auth.controller.js';
import {
  challengeOnlyValidation,
  emailOtpValidation,
  firebaseLoginValidation,
  totpValidation
} from '../middlewares/authValidators.js';
import { requireAuth } from '../middlewares/requireAuth.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { validateFirebaseToken } from '../middlewares/validateFirebaseToken.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again later.' }
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many verification attempts, please try again later.' }
});

const resendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many resend attempts, please try again later.' }
});

router.post('/firebase-login', loginLimiter, firebaseLoginValidation, validateRequest, validateFirebaseToken, firebaseLogin);
router.post('/resend-email-otp', resendLimiter, challengeOnlyValidation, validateRequest, resendEmailOtp);
router.post('/verify-email-otp', otpLimiter, emailOtpValidation, validateRequest, verifyEmailOtp);
router.post('/verify-totp', otpLimiter, totpValidation, validateRequest, verifyTotp);
router.get('/me', requireAuth, me);

export default router;
