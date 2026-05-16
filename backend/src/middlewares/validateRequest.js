import { validationResult } from 'express-validator';
import { fail } from '../utils/response.js';

export function validateRequest(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return fail(
    res,
    'Validation failed',
    422,
    result.array().map(({ msg, path }) => ({ field: path, message: msg }))
  );
}
