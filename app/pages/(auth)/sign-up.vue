<template>
  <div class="min-h-screen flex">
    <div
      class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-900">Create your account</h2>
          <p class="mt-2 text-sm text-gray-600">
            Join our platform to start posting bounties or finding opportunities
          </p>
        </div>

        <form @submit.prevent="handleSignUp" class="mt-8 space-y-6">
          <div class="space-y-4">
            <div>
              <Label for="name" class="block text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <Input
                id="name"
                v-model="formData.name"
                type="text"
                required
                class="mt-1"
                placeholder="Enter your full name" />
            </div>

            <div>
              <Label
                for="email"
                class="block text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="mt-1"
                placeholder="Enter your email address" />
            </div>

            <div>
              <Label
                for="password"
                class="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                v-model="formData.password"
                type="password"
                required
                class="mt-1"
                placeholder="Create a secure password" />
            </div>

            <div>
              <Label class="block text-sm font-medium text-gray-700 mb-3">
                Account Type
              </Label>
              <div class="space-y-3">
                <div
                  class="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors"
                  :class="
                    formData.userType === 'COMPANY'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  "
                  @click="formData.userType = 'COMPANY'">
                  <input
                    type="radio"
                    id="company"
                    v-model="formData.userType"
                    value="COMPANY"
                    class="mt-1" />
                  <div class="flex-1">
                    <Label
                      for="company"
                      class="font-medium text-gray-900 cursor-pointer">
                      Company
                    </Label>
                    <p class="text-sm text-gray-600">
                      Post bounties and hire talent for your projects
                    </p>
                  </div>
                </div>

                <div
                  class="flex items-start space-x-3 p-4 border rounded-lg cursor-pointer transition-colors"
                  :class="
                    formData.userType === 'RECRUITER'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  "
                  @click="formData.userType = 'RECRUITER'">
                  <input
                    type="radio"
                    id="recruiter"
                    v-model="formData.userType"
                    value="RECRUITER"
                    class="mt-1" />
                  <div class="flex-1">
                    <Label
                      for="recruiter"
                      class="font-medium text-gray-900 cursor-pointer">
                      Recruiter
                    </Label>
                    <p class="text-sm text-gray-600">
                      Post bounties and submit candidates to claim bounties
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-4">
            <Button
              type="submit"
              :disabled="isLoading"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="!isLoading">Create Account</span>
              <span v-else class="flex items-center">
                <svg
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            </Button>
          </div>

          <div v-if="error" class="mt-4">
            <div
              class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {{ error }}
            </div>
          </div>

          <div class="text-center">
            <p class="text-sm text-gray-600">
              Already have an account?
              <NuxtLink
                to="/sign-in"
                class="font-medium text-blue-600 hover:text-blue-500">
                Sign in here
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>
    </div>

    <div
      class="hidden lg:block flex-1 bg-gradient-to-br from-blue-600 to-purple-700">
      <div class="h-full flex items-center justify-center px-8">
        <div class="max-w-md text-center text-white">
          <div class="mb-8">
            <div
              class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold mb-4">Join RecruityHub</h3>
            <p class="text-lg text-white/90 mb-6">
              Connect companies with top talent through our bounty-based
              recruitment platform
            </p>
          </div>

          <div class="space-y-4 text-left">
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
              <span>Post bounties for hard-to-fill positions</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
              <span>Access a network of skilled recruiters</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-2 h-2 bg-white rounded-full"></div>
              <span>Pay only for successful placements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  userType: "COMPANY" | "RECRUITER";
}

const formData = ref<SignUpFormData>({
  name: "",
  email: "",
  password: "",
  userType: "COMPANY",
});

const isLoading = ref(false);
const error = ref("");

const handleSignUp = async () => {
  if (isLoading.value) return;

  error.value = "";
  isLoading.value = true;

  try {
    const { data, error: authError } = await authClient.signUp.email({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      userType: formData.value.userType,
      callbackURL: window.location.origin,
    });

    if (authError) {
      error.value = authError.message || "Failed to create account";
      return;
    }

    await navigateTo("/");
  } catch (err) {
    console.error("Sign up error:", err);
    error.value = "An unexpected error occurred. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: false,
  auth: false,
});
</script>
