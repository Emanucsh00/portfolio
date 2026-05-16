import { body } from 'express-validator';

export const firebaseLoginValidation = [
  body('firebaseToken').isString().trim().isLength({ min: 20 }).withMessage('firebaseToken is required')
];

export const emailOtpValidation = [
  body('challengeToken').isString().trim().isLength({ min: 32 }).withMessage('challengeToken is required'),
  body('otp').isString().trim().matches(/^\d{6}$/).withMessage('OTP must be a 6 digit numeric code')
];

export const challengeOnlyValidation = [
  body('challengeToken').isString().trim().isLength({ min: 32 }).withMessage('challengeToken is required')
];

export const totpValidation = [
  body('challengeToken').isString().trim().isLength({ min: 32 }).withMessage('challengeToken is required'),
  body('token').isString().trim().matches(/^\d{6}$/).withMessage('TOTP token must be a 6 digit numeric code')
];

export const totpSetupConfirmValidation = [
  body('token').isString().trim().matches(/^\d{6}$/).withMessage('TOTP token must be a 6 digit numeric code')
];

export const disableTotpValidation = [
  body('token').isString().trim().matches(/^\d{6}$/).withMessage('Current TOTP token is required')
];
