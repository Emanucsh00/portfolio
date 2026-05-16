import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { api } from '../boot/axios';
import { getFirebaseAuthInstance } from '../boot/firebase';

export async function loginWithFirebase(email, password) {
  const auth = getFirebaseAuthInstance();
  await setPersistence(auth, browserLocalPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseToken = await credential.user.getIdToken(true);

  const { data } = await api.post('/auth/firebase-login', { firebaseToken });
  return data;
}

export async function verifyEmailOtp(payload) {
  const { data } = await api.post('/auth/verify-email-otp', payload);
  return data;
}

export async function resendEmailOtp(payload) {
  const { data } = await api.post('/auth/resend-email-otp', payload);
  return data;
}

export async function verifyTotp(payload) {
  const { data } = await api.post('/auth/verify-totp', payload);
  return data;
}

export async function setupTotp(setupToken) {
  const { data } = await api.post(
    '/2fa/setup',
    {},
    {
      headers: setupToken
        ? {
            Authorization: `Bearer ${setupToken}`
          }
        : {}
    }
  );
  return data;
}

export async function confirmTotp(token, authToken) {
  const { data } = await api.post('/2fa/confirm', { token }, {
    headers: authToken
      ? {
          Authorization: `Bearer ${authToken}`
        }
      : {}
  });
  return data;
}

export async function disableTotp(token) {
  const { data } = await api.post('/2fa/disable', { token });
  return data;
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function logoutFirebase() {
  const auth = getFirebaseAuthInstance();
  await signOut(auth);
}
