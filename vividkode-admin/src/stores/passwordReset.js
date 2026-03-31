import { defineStore } from "pinia";
import { ref } from "vue";
import { authApi } from "@/services/api/modules/auth";

export const usePasswordResetStore = defineStore("passwordReset", () => {

  /* =========================
     STATE
  ========================= */

  const step = ref("email"); // email | reset
  const email = ref(null);

  const isLoading = ref(false);
  const error = ref(null);
  const successMessage = ref(null);


  /* =========================
     PRIVATE HELPERS
  ========================= */

  function clearMessages() {
    error.value = null;
    successMessage.value = null;
  }


  /* =========================
     ACTIONS
  ========================= */

  /**
   * Request password reset (send OTP to email)
   */
  async function requestPasswordReset(userEmail) {

    clearMessages();
    isLoading.value = true;

    try {

      const response = await authApi.requestPasswordReset({
        email: userEmail
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to send reset code");
      }

      email.value = userEmail;
      step.value = "reset";

      successMessage.value = response.message || "Reset code sent to your email.";

      return {
        success: true,
        message: successMessage.value
      };

    } catch (err) {

      error.value = err.message || "Failed to send reset code";

      return {
        success: false,
        error: error.value
      };

    } finally {
      isLoading.value = false;
    }
  }


  /**
   * Verify OTP and change password
   */
  async function resetPassword(otp, newPassword, confirmPassword) {

    clearMessages();
    isLoading.value = true;

    try {

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      /**
       * Step 1: Verify OTP
       */
      const otpResponse = await authApi.verifyOTP({
        email: email.value,
        otp: otp
      });

      if (!otpResponse.success) {
        throw new Error(otpResponse.message || "Invalid OTP");
      }


      /**
       * Step 2: Change password
       */
      const passwordResponse = await authApi.changePassword({
        email: email.value,
        otp: otp,
        new_password: newPassword
      });

      if (!passwordResponse.success) {
        throw new Error(passwordResponse.message || "Failed to change password");
      }

      successMessage.value =
        passwordResponse.message || "Password reset successful.";

      return {
        success: true,
        message: successMessage.value
      };

    } catch (err) {

      error.value = err.message || "Password reset failed";

      return {
        success: false,
        error: error.value
      };

    } finally {
      isLoading.value = false;
    }
  }


  /**
   * Resend OTP
   */
  async function resendOTP() {

    clearMessages();
    isLoading.value = true;

    try {

      const response = await authApi.requestPasswordReset({
        email: email.value
      });

      if (!response.success) {
        throw new Error(response.message || "Failed to resend OTP");
      }

      successMessage.value =
        response.message || "A new OTP has been sent.";

      return {
        success: true,
        message: successMessage.value
      };

    } catch (err) {

      error.value = err.message || "Failed to resend OTP";

      return {
        success: false,
        error: error.value
      };

    } finally {
      isLoading.value = false;
    }
  }


  /**
   * Reset store state
   */
  function resetStore() {
    step.value = "email";
    email.value = null;
    error.value = null;
    successMessage.value = null;
    isLoading.value = false;
  }


  /* =========================
     RETURN STORE
  ========================= */

  return {
    step,
    email,
    isLoading,
    error,
    successMessage,

    requestPasswordReset,
    resetPassword,
    resendOTP,
    resetStore
  };

});