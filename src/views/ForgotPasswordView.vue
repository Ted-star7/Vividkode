<template>
  <div
    class="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden"
  >
    <div class="relative z-10 w-full max-w-md px-6">
      <!-- Logo and header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden"
          >
            <img
              src="@/assets/logo.jpeg"
              alt="VividKode Logo"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="text-left">
            <div class="font-display text-xl font-bold text-white leading-none">
              VividKode
            </div>
            <div
              class="text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase mt-0.5"
            >
              Creations
            </div>
          </div>
        </div>
        <h1 class="font-display text-3xl font-bold text-white mb-2">
          Reset Password
        </h1>
        <p class="text-navy-300 text-sm">
          We'll send you a code to reset your password
        </p>
      </div>

      <!-- Reset password card -->
      <div class="bg-white/10 border border-white/20 rounded-2xl p-8">
        <!-- Email Step -->
        <div v-if="store.step === 'email'" class="space-y-5">
          <div>
            <label
              class="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1.5"
            >
              Email Address
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
              :disabled="store.isLoading"
              class="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-lg text-white placeholder-navy-300 text-base focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
            />
          </div>

          <button
            @click="handleRequestReset"
            :disabled="store.isLoading || !email"
            class="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-white font-semibold rounded-lg transition-all duration-150 text-base"
          >
            <span
              v-if="store.isLoading"
              class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
            ></span>
            {{ store.isLoading ? "Sending..." : "Send Reset Code" }}
          </button>
        </div>

        <!-- Reset Password Step (with OTP and new password) -->
        <div v-else-if="store.step === 'reset'" class="space-y-5">
          <div>
            <label
              class="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1.5"
            >
              OTP Code
            </label>
            <input
              v-model="otp"
              type="text"
              placeholder="Enter 6-digit code"
              required
              :disabled="store.isLoading"
              class="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-lg text-white placeholder-navy-300 text-base focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400"
            />
            <p class="text-xs text-navy-400 mt-2">
              We've sent a code to
              <span class="text-gold-400">{{ store.email }}</span>
            </p>
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1.5"
            >
              New Password
            </label>
            <div class="relative">
              <input
                v-model="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                required
                :disabled="store.isLoading"
                class="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-lg text-white placeholder-navy-300 text-base focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 pr-12"
              />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-white text-sm"
              >
                {{ showNewPassword ? "Hide" : "Show" }}
              </button>
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-navy-300 uppercase tracking-wider mb-1.5"
            >
              Confirm Password
            </label>
            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm new password"
                required
                :disabled="store.isLoading"
                class="w-full px-4 py-3 bg-white/15 border border-white/25 rounded-lg text-white placeholder-navy-300 text-base focus:outline-none focus:ring-2 focus:ring-gold-400/50 focus:border-gold-400 pr-12"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300 hover:text-white text-sm"
              >
                {{ showConfirmPassword ? "Hide" : "Show" }}
              </button>
            </div>
          </div>

          <button
            @click="handleResetPassword"
            :disabled="
              store.isLoading || !otp || !newPassword || !confirmPassword
            "
            class="w-full py-3 bg-gold-500 hover:bg-gold-400 disabled:opacity-60 text-white font-semibold rounded-lg transition-all duration-150 text-base"
          >
            <span
              v-if="store.isLoading"
              class="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"
            ></span>
            {{ store.isLoading ? "Resetting..." : "Reset Password" }}
          </button>

          <button
            @click="handleResendOTP"
            :disabled="store.isLoading"
            class="w-full py-2 text-navy-300 hover:text-white text-sm transition-colors"
          >
            Didn't receive code? Resend
          </button>
        </div>

        <!-- Messages -->
        <Transition name="fade">
          <div
            v-if="store.error"
            class="mt-4 p-3 bg-red-500/20 border border-red-500/40 text-red-300 text-sm rounded-lg"
          >
            {{ store.error }}
          </div>
        </Transition>

        <Transition name="fade">
          <div
            v-if="store.successMessage"
            class="mt-4 p-3 bg-green-500/20 border border-green-500/40 text-green-300 text-sm rounded-lg"
          >
            {{ store.successMessage }}
          </div>
        </Transition>

        <!-- Back to login link -->
        <div class="mt-6 text-center">
          <RouterLink
            to="/login"
            class="text-sm text-navy-300 hover:text-white transition-colors"
          >
            ← Back to Login
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePasswordResetStore } from "@/stores/passwordReset";

const router = useRouter();
const store = usePasswordResetStore();

const email = ref("");
const otp = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

async function handleRequestReset() {
  const result = await store.requestPasswordReset(email.value);

  if (result.success) {
    // Clear fields for next step
    otp.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
  }
}

async function handleResetPassword() {
  const result = await store.resetPassword(
    otp.value,
    newPassword.value,
    confirmPassword.value,
  );

  if (result.success) {
    // Redirect to login after 2 seconds
    setTimeout(() => {
      store.resetStore();
      router.push("/login");
    }, 2000);
  }
}

async function handleResendOTP() {
  await store.resendOTP();
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
