<template>
  <div class="login-root">
    <!-- Animated background -->
    <div class="bg-layer">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Left panel – branding -->
    <div class="left-panel">
      <div class="left-inner">
        <div class="brand-logo">
          <div class="logo-ring">
            <img
              src="@/assets/logo.jpeg"
              alt="VividKode Logo"
              class="logo-img"
            />
          </div>
        </div>

        <div class="brand-text">
          <p class="brand-eyebrow">VividKode</p>
          <h1 class="brand-headline">Creations</h1>
          <p class="brand-tagline">Where vision meets velocity.</p>
        </div>

        <div class="brand-divider"></div>

        <ul class="brand-features">
          <li><span class="feat-dot"></span>Full-stack web solutions</li>
          <li><span class="feat-dot"></span>Design-first development</li>
          <li><span class="feat-dot"></span>Scalable digital products</li>
        </ul>

        <p class="brand-copy">
          &copy; {{ new Date().getFullYear() }} VividKode Creations
        </p>
      </div>
    </div>

    <!-- Right panel – form -->
    <div class="right-panel">
      <div class="form-card">
        <!-- Mobile logo -->
        <div class="mobile-logo">
          <div class="logo-ring small">
            <img
              src="@/assets/logo.jpeg"
              alt="VividKode Logo"
              class="logo-img"
            />
          </div>
          <div>
            <span class="brand-eyebrow" style="font-size: 11px">VividKode</span>
            <span
              class="brand-headline"
              style="font-size: 18px; display: block; line-height: 1"
              >Creations</span
            >
          </div>
        </div>

        <div class="form-header">
          <h2 class="form-title">Admin Portal</h2>
          <p class="form-sub">Sign in to continue to your dashboard</p>
        </div>

        <form @submit.prevent="handleLogin" class="form-body">
          <!-- Error -->
          <Transition name="slide-fade">
            <div v-if="error" class="msg msg-error">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {{ error }}
            </div>
          </Transition>

          <!-- Success -->
          <Transition name="slide-fade">
            <div v-if="successMessage" class="msg msg-success">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {{ successMessage }}
            </div>
          </Transition>

          <!-- Email -->
          <div class="field-group">
            <label class="field-label">Email address</label>
            <div class="input-wrap">
              <svg
                class="input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="2,4 12,13 22,4" />
              </svg>
              <input
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                required
                :disabled="loading"
                class="field-input"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="field-group">
            <label class="field-label">Password</label>
            <div class="input-wrap">
              <svg
                class="input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••••"
                required
                :disabled="loading"
                class="field-input"
              />
              <button
                type="button"
                class="toggle-pw"
                @click="showPassword = !showPassword"
                :disabled="loading"
              >
                <svg
                  v-if="!showPassword"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" :disabled="loading" class="submit-btn">
            <span v-if="loading" class="spinner"></span>
            <span>{{ loading ? "Signing in…" : "Sign In" }}</span>
            <svg
              v-if="!loading"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </form>

        <p class="form-footer">Secure access · VividKode Admin</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({ email: "", password: "" });
const loading = ref(false);
const error = ref("");
const successMessage = ref("");
const showPassword = ref(false);

async function handleLogin() {
  if (!form.email || !form.password) {
    error.value = "Please enter both email and password";
    return;
  }
  loading.value = true;
  error.value = "";
  successMessage.value = "";
  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password,
    });
    if (result.success) {
      successMessage.value = result.message || "Login successful! Redirecting…";
      const redirect = route.query.redirect || "/dashboard";
      setTimeout(() => router.push(redirect), 500);
    } else {
      error.value = result.error || "Invalid email or password";
    }
  } catch (err) {
    error.value = err.message || "An error occurred. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
/* ── Base ─────────────────────────────────────────── */
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.login-root {
  min-height: 100vh;
  display: flex;
  background: #0e1f3b;
  font-family: "DM Sans", sans-serif;
  position: relative;
  overflow: hidden;
}

/* ── Animated background ──────────────────────────── */
.bg-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.38;
  animation: drift 12s ease-in-out infinite alternate;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #d4a840 0%, transparent 70%);
  top: -150px;
  left: -100px;
  animation-duration: 14s;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #2a5298 0%, transparent 70%);
  bottom: -100px;
  right: 30%;
  animation-duration: 10s;
  animation-delay: -4s;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #d4a840 0%, transparent 70%);
  bottom: 10%;
  right: -80px;
  opacity: 0.25;
  animation-duration: 18s;
  animation-delay: -8s;
}

@keyframes drift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(30px, 20px) scale(1.07);
  }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(201, 151, 58, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(201, 151, 58, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
}

/* ── Left panel ───────────────────────────────────── */
.left-panel {
  width: 42%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border-right: 1px solid rgba(201, 151, 58, 0.18);
}

.left-panel::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(201, 151, 58, 0.4) 40%,
    rgba(201, 151, 58, 0.4) 60%,
    transparent
  );
}

.left-inner {
  max-width: 320px;
  animation: fadeUp 0.8s ease both;
}

.logo-ring {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  border: 1.5px solid rgba(201, 151, 58, 0.5);
  padding: 3px;
  background: rgba(201, 151, 58, 0.06);
  margin-bottom: 36px;
  box-shadow: 0 0 40px rgba(201, 151, 58, 0.15);
}

.logo-ring.small {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-bottom: 0;
  flex-shrink: 0;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

.brand-eyebrow {
  font-family: "DM Sans", sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: #c9973a;
  margin: 0 0 4px;
}

.brand-headline {
  font-family: "Cormorant Garamond", serif;
  font-size: 52px;
  font-weight: 700;
  color: #f5e8cc;
  line-height: 1;
  margin: 0 0 12px;
  letter-spacing: -0.01em;
}

.brand-tagline {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin: 0;
  font-family: "Cormorant Garamond", serif;
  font-size: 17px;
}

.brand-divider {
  width: 48px;
  height: 1px;
  background: linear-gradient(to right, #c9973a, transparent);
  margin: 32px 0;
}

.brand-features {
  list-style: none;
  padding: 0;
  margin: 0 0 48px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.brand-features li {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.02em;
}

.feat-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #c9973a;
  flex-shrink: 0;
  box-shadow: 0 0 6px #c9973a;
}

.brand-copy {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  letter-spacing: 0.04em;
}

/* ── Right panel ──────────────────────────────────── */
.right-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 48px;
}

.form-card {
  width: 100%;
  max-width: 400px;
  animation: fadeUp 0.8s 0.15s ease both;
}

.mobile-logo {
  display: none;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
}

.form-header {
  margin-bottom: 36px;
}

.form-title {
  font-family: "Cormorant Garamond", serif;
  font-size: 36px;
  font-weight: 700;
  color: #f5e8cc;
  margin: 0 0 6px;
  letter-spacing: -0.01em;
}

.form-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

/* ── Form ─────────────────────────────────────────── */
.form-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.msg {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  border-radius: 10px;
  padding: 12px 14px;
  border: 1px solid;
}

.msg-error {
  background: rgba(220, 60, 60, 0.12);
  border-color: rgba(220, 60, 60, 0.3);
  color: #f08080;
}

.msg-success {
  background: rgba(60, 180, 100, 0.1);
  border-color: rgba(60, 180, 100, 0.3);
  color: #6ddba0;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(201, 151, 58, 0.95);
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 12px;
  padding: 13px 44px 13px 42px;
  font-size: 14px;
  font-family: "DM Sans", sans-serif;
  color: #fff;
  outline: none;
  transition:
    border-color 0.2s,
    background 0.2s,
    box-shadow 0.2s;
}

.field-input::placeholder {
  color: rgba(255, 255, 255, 0.38);
}

.field-input:hover {
  border-color: rgba(201, 151, 58, 0.3);
  background: rgba(255, 255, 255, 0.06);
}

.field-input:focus {
  border-color: rgba(201, 151, 58, 0.6);
  background: rgba(201, 151, 58, 0.05);
  box-shadow: 0 0 0 3px rgba(201, 151, 58, 0.08);
}

.field-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.field-input:-webkit-autofill,
.field-input:-webkit-autofill:hover,
.field-input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0 40px #172d55 inset !important;
  -webkit-text-fill-color: #fff !important;
  caret-color: #fff;
}

.toggle-pw {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.45);
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.toggle-pw:hover {
  color: rgba(201, 151, 58, 0.8);
}
.toggle-pw:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ── Submit button ────────────────────────────────── */
.submit-btn {
  width: 100%;
  margin-top: 8px;
  padding: 14px 20px;
  background: linear-gradient(135deg, #c9973a 0%, #e8b84b 50%, #c9973a 100%);
  background-size: 200% 200%;
  border: none;
  border-radius: 12px;
  font-family: "DM Sans", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #1a0f00;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.04em;
  transition:
    opacity 0.2s,
    transform 0.15s,
    box-shadow 0.2s,
    background-position 0.4s;
  box-shadow: 0 4px 24px rgba(201, 151, 58, 0.3);
}

.submit-btn:hover:not(:disabled) {
  background-position: 100% 0;
  box-shadow: 0 6px 32px rgba(201, 151, 58, 0.45);
  transform: translateY(-1px);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(26, 15, 0, 0.3);
  border-top-color: #1a0f00;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* ── Footer ───────────────────────────────────────── */
.form-footer {
  margin-top: 28px;
  text-align: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.08em;
}

/* ── Transitions ──────────────────────────────────── */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ── Keyframes ────────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Responsive ───────────────────────────────────── */
@media (max-width: 768px) {
  .login-root {
    flex-direction: column;
  }
  .left-panel {
    display: none;
  }
  .right-panel {
    padding: 48px 24px;
  }
  .mobile-logo {
    display: flex;
  }
  .form-title {
    font-size: 28px;
  }
}
</style>
