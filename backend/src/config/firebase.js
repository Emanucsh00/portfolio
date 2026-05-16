import admin from 'firebase-admin';
import { getBooleanEnv } from './env.js';

let firebaseApp = null;

export function getFirebaseApp() {
  if (firebaseApp) {
    return firebaseApp;
  }

  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error('Firebase Admin SDK environment variables are not configured');
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });

  return firebaseApp;
}

export function getFirebaseAuth() {
  return getFirebaseApp().auth();
}

export function validateFirebaseIdentity(decodedToken) {
  if (getBooleanEnv('REQUIRE_FIREBASE_EMAIL_VERIFIED', false) && !decodedToken.email_verified) {
    const error = new Error('Firebase email must be verified');
    error.status = 401;
    throw error;
  }
}

export async function assertFirebaseUserActive(uid) {
  const firebaseUser = await getFirebaseAuth().getUser(uid);

  if (firebaseUser.disabled) {
    const error = new Error('Firebase user is disabled');
    error.status = 401;
    throw error;
  }

  return firebaseUser;
}
