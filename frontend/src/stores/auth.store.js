import { defineStore } from 'pinia';
import {
  confirmTotp,
  disableTotp,
  fetchMe,
  loginWithFirebase,
  logoutFirebase,
  resendEmailOtp,
  setupTotp,
  verifyEmailOtp,
  verifyTotp
} from '../services/auth.service';

const tokenKey = 'portfolio_token';
const challengeKey = 'portfolio_challenge_token';
const setupKey = 'portfolio_setup_token';
const challengeIssuedAtKey = 'portfolio_challenge_issued_at';
const challengeMaxAgeMs = 10 * 60 * 1000;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    firebaseAuthenticated: false,
    pendingEmailOtp: false,
    pendingTotp: false,
    requiresTotpSetup: false,
    authenticated: Boolean(localStorage.getItem(tokenKey)),
    user: null,
    token: localStorage.getItem(tokenKey) || '',
    challengeToken: sessionStorage.getItem(challengeKey) || '',
    setupToken: sessionStorage.getItem(setupKey) || '',
    challengeIssuedAt: Number(sessionStorage.getItem(challengeIssuedAtKey) || 0)
  }),
  getters: {
    isAdmin: (state) => state.user?.role === 'admin'
  },
  actions: {
    persistChallenge() {
      if (this.challengeToken) {
        sessionStorage.setItem(challengeKey, this.challengeToken);
      } else {
        sessionStorage.removeItem(challengeKey);
      }

      if (this.setupToken) {
        sessionStorage.setItem(setupKey, this.setupToken);
      } else {
        sessionStorage.removeItem(setupKey);
      }

      if (this.challengeIssuedAt) {
        sessionStorage.setItem(challengeIssuedAtKey, String(this.challengeIssuedAt));
      } else {
        sessionStorage.removeItem(challengeIssuedAtKey);
      }
    },
    isChallengeExpired() {
      if (!this.challengeToken || !this.challengeIssuedAt) {
        return true;
      }

      return Date.now() - this.challengeIssuedAt > challengeMaxAgeMs;
    },
    clearChallengeState() {
      this.pendingEmailOtp = false;
      this.pendingTotp = false;
      this.requiresTotpSetup = false;
      this.challengeToken = '';
      this.setupToken = '';
      this.challengeIssuedAt = 0;
      this.persistChallenge();
    },
    setToken(token) {
      this.token = token;
      this.authenticated = Boolean(token);

      if (token) {
        localStorage.setItem(tokenKey, token);
      } else {
        localStorage.removeItem(tokenKey);
      }
    },
    async login(email, password) {
      const response = await loginWithFirebase(email, password);
      const payload = response.data;

      this.firebaseAuthenticated = true;
      this.pendingEmailOtp = payload.requiresEmailOtp;
      this.pendingTotp = false;
      this.requiresTotpSetup = false;
      this.challengeToken = payload.challengeToken;
      this.setupToken = '';
      this.challengeIssuedAt = Date.now();
      this.persistChallenge();
      return payload;
    },
    async submitEmailOtp(otp) {
      const response = await verifyEmailOtp({
        challengeToken: this.challengeToken,
        otp
      });
      const payload = response.data;

      this.pendingEmailOtp = false;
      this.pendingTotp = Boolean(payload.pendingTotp);
      this.requiresTotpSetup = Boolean(payload.requiresTotpSetup);
      this.setupToken = payload.setupToken || '';
      this.persistChallenge();
      return payload;
    },
    async resendOtp() {
      if (this.isChallengeExpired()) {
        this.clearChallengeState();
        throw new Error('Challenge expired. Please log in again.');
      }

      const response = await resendEmailOtp({
        challengeToken: this.challengeToken
      });
      return response.data;
    },
    async submitTotp(token) {
      const response = await verifyTotp({
        challengeToken: this.challengeToken,
        token
      });
      const payload = response.data;
      this.setToken(payload.token);
      this.user = payload.user;
      this.pendingTotp = false;
      this.clearChallengeState();
      return payload;
    },
    async requestTotpSetup() {
      const response = await setupTotp(this.setupToken || null);
      return response.data;
    },
    async confirmTotpSetup(token) {
      const response = await confirmTotp(token, this.setupToken || null);
      const payload = response.data;

      if (payload.token) {
        this.setToken(payload.token);
      }

      if (payload.user) {
        this.user = payload.user;
      } else if (this.user) {
        this.user.totp_enabled = true;
      }

      this.pendingTotp = false;
      this.requiresTotpSetup = false;

      if (this.setupToken) {
        this.clearChallengeState();
      }

      return payload;
    },
    async loadProfile() {
      if (!this.token) {
        return null;
      }

      try {
        const response = await fetchMe();
        this.user = response.data;
        this.authenticated = true;
        return this.user;
      } catch (error) {
        await this.logout();
        return null;
      }
    },
    async turnOffTotp(token) {
      const response = await disableTotp(token);
      if (this.user) {
        this.user.totp_enabled = false;
      }
      return response.data;
    },
    async logout() {
      this.firebaseAuthenticated = false;
      this.clearChallengeState();
      this.user = null;
      this.setToken('');
      await logoutFirebase();
    }
  }
});
