import { defineStore } from "pinia";
import { ref } from "vue";
import { authApi } from "@/services";

export const usePasswordResetStore = defineStore('passwordReset', () => {
  // State
  const email = ref('');
  const isLoading = ref(false);
  const error = ref('');
  const successMessage = ref('');
  const step = ref('email'); // 'email' or 'reset'
  
  // Actions
  async function requestPasswordReset(userEmail) {
    isLoading.value = true;
    error.value = '';
    successMessage.value = '';
    
    try {
      const response = await authApi.forgotPassword(userEmail);
      
      if (response.success) {
        email.value = userEmail;
        successMessage.value = response.message || 'Reset code sent to your email!';
        step.value = 'reset'; // Move directly to reset step (includes OTP)
        return { success: true, data: response };
      } else {
        error.value = response.message || 'Failed to send reset code';
        return { success: false, error: error.value };
      }
    } catch (err) {
      error.value = err.message || 'An error occurred. Please try again.';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }
  
  async function resetPassword(otp, newPassword, confirmPassword) {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      error.value = 'Passwords do not match';
      return { success: false, error: 'Passwords do not match' };
    }
    
    // Validate password strength
    if (newPassword.length < 6) {
      error.value = 'Password must be at least 6 characters';
      return { success: false, error: 'Password must be at least 6 characters' };
    }
    
    // Validate OTP
    if (!otp || otp.length < 4) {
      error.value = 'Please enter a valid OTP code';
      return { success: false, error: 'Please enter a valid OTP code' };
    }
    
    isLoading.value = true;
    error.value = '';
    
    try {
      const response = await authApi.resetPassword({
        email: email.value,
        otp: otp,
        newPassword: newPassword
      });
      
      if (response.success) {
        successMessage.value = response.message || 'Password reset successful!';
        return { success: true, data: response };
      } else {
        error.value = response.message || 'Failed to reset password';
        return { success: false, error: error.value };
      }
    } catch (err) {
      error.value = err.message || 'An error occurred. Please try again.';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }
  
  async function resendOTP() {
    isLoading.value = true;
    error.value = '';
    
    try {
      const response = await authApi.resendOtp(email.value);
      
      if (response.success) {
        successMessage.value = response.message || 'New OTP sent to your email!';
        return { success: true, data: response };
      } else {
        error.value = response.message || 'Failed to resend OTP';
        return { success: false, error: error.value };
      }
    } catch (err) {
      error.value = err.message || 'Failed to resend OTP';
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  }
  
  function resetStore() {
    email.value = '';
    isLoading.value = false;
    error.value = '';
    successMessage.value = '';
    step.value = 'email';
  }
  
  return {
    // State
    email,
    isLoading,
    error,
    successMessage,
    step,
    
    // Actions
    requestPasswordReset,
    resetPassword,
    resendOTP,
    resetStore
  };
});