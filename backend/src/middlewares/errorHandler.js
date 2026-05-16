import { fail } from '../utils/response.js';

export function notFoundHandler(req, res) {
  return fail(res, `Route ${req.originalUrl} not found`, 404);
}

export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';

  if (res.headersSent) {
    return next(error);
  }

  return fail(res, message, status, process.env.NODE_ENV === 'development' ? error.stack : null);
}
