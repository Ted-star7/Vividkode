<template>
  <div class="p-6 max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="page-title">Settings</h1>
      <p class="text-sm text-gray-400 mt-0.5">
        Manage your account and application preferences
      </p>
    </div>

    <div class="space-y-5">
      <!-- Profile -->
      <div class="card p-6">
        <h2 class="section-title mb-5 pb-4 border-b border-gray-100">
          Profile Information
        </h2>
        <div class="flex items-center gap-5 mb-6">
          <div
            class="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-display"
          >
            {{ getUserInitial() }}
          </div>
          <div>
            <div class="font-semibold text-navy-800">
              {{ auth.user?.name || "Admin User" }}
            </div>
            <div class="text-sm text-gray-400">
              {{ auth.user?.email || "admin@vividkode.com" }}
            </div>
            <span
              :class="[
                'badge text-xs mt-1',
                auth.user?.role === 'super_admin' ? 'badge-gold' : 'badge-navy',
              ]"
            >
              {{
                auth.user?.role === "super_admin"
                  ? "⭐ Super Admin"
                  : "✏️ Editor"
              }}
            </span>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Full Name</label>
            <input
              :value="auth.user?.name || 'Admin User'"
              class="input-field"
              readonly
              disabled
            />
          </div>
          <div>
            <label class="label">Email Address</label>
            <input
              :value="auth.user?.email || 'admin@vividkode.com'"
              class="input-field"
              readonly
              disabled
            />
          </div>
          <div>
            <label class="label">Role</label>
            <input
              :value="
                auth.user?.role === 'super_admin' ? 'Super Admin' : 'Editor'
              "
              class="input-field"
              readonly
              disabled
            />
          </div>
        </div>
        <p class="text-xs text-gray-400 mt-3">
          Profile editing is managed by the Super Admin.
        </p>
      </div>

      <!-- Company -->
      <div class="card p-6">
        <h2 class="section-title mb-5 pb-4 border-b border-gray-100">
          Company Details
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="label">Company Name</label>
            <input
              v-model="company.name"
              class="input-field"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label class="label">Website</label>
            <input
              v-model="company.website"
              class="input-field"
              placeholder="https://"
            />
          </div>
          <div>
            <label class="label">Email</label>
            <input
              v-model="company.email"
              class="input-field"
              type="email"
              placeholder="contact@company.com"
            />
          </div>
          <div>
            <label class="label">Phone</label>
            <input
              v-model="company.phone"
              class="input-field"
              placeholder="+123 456 7890"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="label">Address</label>
            <input
              v-model="company.address"
              class="input-field"
              placeholder="Full address"
            />
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            @click="saveCompany"
            :disabled="companySaving"
            class="btn-primary"
          >
            {{ companySaving ? "Saving..." : "Save Company Info" }}
          </button>
        </div>
        <Transition name="fade">
          <p
            v-if="companySaved"
            class="text-sm text-emerald-600 mt-2 text-right"
          >
            ✓ Company information saved successfully!
          </p>
        </Transition>
      </div>

      <!-- Notifications -->
      <div class="card p-6">
        <h2 class="section-title mb-5 pb-4 border-b border-gray-100">
          Notification Preferences
        </h2>
        <div class="space-y-4">
          <div
            v-for="notif in notifications"
            :key="notif.id"
            class="flex items-start justify-between gap-4 cursor-pointer group"
          >
            <div>
              <div
                class="text-sm font-medium text-navy-800 group-hover:text-navy-900"
              >
                {{ notif.label }}
              </div>
              <div class="text-xs text-gray-400 mt-0.5">{{ notif.desc }}</div>
            </div>
            <div class="relative shrink-0 mt-0.5">
              <input
                type="checkbox"
                v-model="notif.enabled"
                class="sr-only peer"
              />
              <div
                @click="notif.enabled = !notif.enabled"
                :class="[
                  'toggle-switch',
                  notif.enabled
                    ? 'toggle-switch-checked'
                    : 'toggle-switch-unchecked',
                ]"
              >
                <div
                  :class="[
                    'toggle-slider',
                    notif.enabled
                      ? 'toggle-slider-checked'
                      : 'toggle-slider-unchecked',
                  ]"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button
            @click="saveNotificationPreferences"
            class="btn-outline text-sm"
          >
            Save Preferences
          </button>
        </div>
        <Transition name="fade">
          <p
            v-if="notificationSaved"
            class="text-sm text-emerald-600 mt-2 text-right"
          >
            ✓ Notification preferences saved!
          </p>
        </Transition>
      </div>

      <!-- Security -->
      <div class="card p-6">
        <h2 class="section-title mb-5 pb-4 border-b border-gray-100">
          Security
        </h2>
        <div
          class="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
        >
          <div>
            <div class="text-sm font-medium text-navy-800">Password</div>
            <div class="text-xs text-gray-400 mt-0.5">
              Last changed never (demo)
            </div>
          </div>
          <button
            @click="showChangePasswordModal = true"
            class="btn-outline text-sm"
          >
            Change Password
          </button>
        </div>
        <div
          class="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-xl"
        >
          <div>
            <div class="text-sm font-medium text-navy-800">
              Two-Factor Authentication
            </div>
            <div class="text-xs text-gray-400 mt-0.5">
              Add an extra layer of security
            </div>
          </div>
          <span
            class="badge-gray text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600"
            >Coming Soon</span
          >
        </div>
      </div>

      <!-- Danger zone -->
      <div class="card p-6 border border-red-100">
        <h2 class="section-title mb-4 text-red-600">Danger Zone</h2>
        <div
          class="flex items-center justify-between p-4 bg-red-50/50 rounded-xl"
        >
          <div>
            <div class="text-sm font-medium text-navy-800">
              Sign out of all sessions
            </div>
            <div class="text-xs text-gray-400 mt-0.5">
              This will log you out everywhere
            </div>
          </div>
          <button @click="showLogoutConfirm = true" class="btn-danger text-sm">
            Sign Out
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showChangePasswordModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showChangePasswordModal = false"
        >
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div
            class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in"
          >
            <div
              class="flex items-center justify-between p-6 border-b border-gray-100"
            >
              <h2 class="font-display text-lg font-bold text-navy-900">
                Change Password
              </h2>
              <button
                @click="showChangePasswordModal = false"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>
            <form @submit.prevent="changePassword" class="p-6 space-y-4">
              <div>
                <label class="label">Current Password</label>
                <input
                  v-model="passwordForm.current"
                  type="password"
                  class="input-field"
                  required
                />
              </div>
              <div>
                <label class="label">New Password</label>
                <input
                  v-model="passwordForm.new"
                  type="password"
                  class="input-field"
                  required
                />
              </div>
              <div>
                <label class="label">Confirm New Password</label>
                <input
                  v-model="passwordForm.confirm"
                  type="password"
                  class="input-field"
                  required
                />
              </div>
              <div class="flex gap-3 pt-2">
                <button
                  type="button"
                  @click="showChangePasswordModal = false"
                  class="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button type="submit" class="btn-primary flex-1">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Logout Confirmation Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showLogoutConfirm"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showLogoutConfirm = false"
        >
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div
            class="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-scale-in text-center"
          >
            <div class="text-4xl mb-3">🚪</div>
            <h3 class="font-display text-lg font-bold text-navy-900 mb-2">
              Sign Out?
            </h3>
            <p class="text-sm text-gray-500 mb-6">
              Are you sure you want to sign out of your account?
            </p>
            <div class="flex gap-3">
              <button
                @click="showLogoutConfirm = false"
                class="btn-outline flex-1"
              >
                Cancel
              </button>
              <button @click="handleLogout" class="btn-danger flex-1">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const auth = useAuthStore();
const router = useRouter();

// Company settings
const company = reactive({
  name: "VividKode Creations",
  website: "https://vividkode.com",
  email: "hello@vividkode.com",
  phone: "+254 700 000 000",
  address: "Nairobi, Kenya",
});

const companySaving = ref(false);
const companySaved = ref(false);

// Notification settings
const notifications = ref([
  {
    id: 1,
    label: "New Messages",
    desc: "Get notified when a new contact message arrives",
    enabled: true,
  },
  {
    id: 2,
    label: "New Leads",
    desc: "Get notified when a new client lead is added",
    enabled: true,
  },
  {
    id: 3,
    label: "Project Updates",
    desc: "Notifications when a project status changes",
    enabled: false,
  },
  {
    id: 4,
    label: "Weekly Reports",
    desc: "Receive a weekly summary of dashboard activity",
    enabled: false,
  },
]);

const notificationSaved = ref(false);

// Password change
const showChangePasswordModal = ref(false);
const passwordForm = reactive({
  current: "",
  new: "",
  confirm: "",
});

// Logout confirmation
const showLogoutConfirm = ref(false);

// Helper functions
function getUserInitial() {
  const name = auth.user?.name || "Admin User";
  return name.charAt(0).toUpperCase();
}

async function saveCompany() {
  companySaving.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    companySaved.value = true;
    setTimeout(() => {
      companySaved.value = false;
    }, 2500);
  } finally {
    companySaving.value = false;
  }
}

async function saveNotificationPreferences() {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    notificationSaved.value = true;
    setTimeout(() => {
      notificationSaved.value = false;
    }, 2500);
  } catch (error) {
    console.error("Failed to save notification preferences:", error);
  }
}

async function changePassword() {
  if (passwordForm.new !== passwordForm.confirm) {
    alert("New passwords do not match!");
    return;
  }

  if (passwordForm.new.length < 6) {
    alert("Password must be at least 6 characters long!");
    return;
  }

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    alert("Password changed successfully!");
    showChangePasswordModal.value = false;
    // Reset form
    passwordForm.current = "";
    passwordForm.new = "";
    passwordForm.confirm = "";
  } catch (error) {
    console.error("Failed to change password:", error);
    alert("Failed to change password. Please try again.");
  }
}

function handleLogout() {
  auth.logout();
  router.push("/login");
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a1929;
  font-family: "Playfair Display", serif;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0a1929;
}

.card {
  background-color: white;
  border-radius: 1rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-primary {
  background-color: #c8861a;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #b07816;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-outline {
  border: 1px solid #e5e7eb;
  background-color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-outline:hover {
  background-color: #f9fafb;
  border-color: #c8861a;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}

.btn-danger:hover {
  background-color: #b91c1c;
  transform: translateY(-1px);
}

.input-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  background-color: white;
}

.input-field:focus {
  outline: none;
  border-color: #c8861a;
  box-shadow: 0 0 0 2px rgba(200, 134, 26, 0.2);
}

.input-field:disabled,
.input-field[readonly] {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

.badge-gold {
  background-color: #fef3c7;
  color: #c8861a;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-navy {
  background-color: #e0e7ff;
  color: #102a43;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-gray {
  background-color: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Toggle Switch */
.toggle-switch {
  width: 2.5rem;
  height: 1.25rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
  cursor: pointer;
  position: relative;
}

.toggle-switch-checked {
  background-color: #102a43;
}

.toggle-switch-unchecked {
  background-color: #e5e7eb;
}

.toggle-slider {
  width: 1rem;
  height: 1rem;
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  position: absolute;
  top: 0.125rem;
}

.toggle-slider-checked {
  transform: translateX(1.25rem);
}

.toggle-slider-unchecked {
  transform: translateX(0.125rem);
}

/* Animation */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}
</style>
