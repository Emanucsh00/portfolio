import { getFirebaseAuth, validateFirebaseIdentity } from '../config/firebase.js';
import { fail } from '../utils/response.js';

export async function validateFirebaseToken(req, res, next) {
  try {
    const firebaseToken = req.body.firebaseToken || req.headers['x-firebase-token'];

    if (!firebaseToken) {
      return fail(res, 'Firebase token is required', 400);
    }

    const decoded = await getFirebaseAuth().verifyIdToken(firebaseToken);
    validateFirebaseIdentity(decoded);
    req.firebaseUser = decoded;
    return next();
  } catch (error) {
    return fail(res, 'Invalid Firebase token', error.status || 401, error.message);
  }
}
