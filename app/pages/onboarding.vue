<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-background p-6">
    <div class="w-full max-w-4xl">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="text-2xl font-bold inline-block mb-4">
          RecruityHub
        </NuxtLink>
        <div class="flex items-center justify-center gap-2 mt-6">
          <div
            v-for="step in 2"
            :key="step"
            class="h-2 rounded-full transition-all"
            :class="[
              currentStep >= step ? 'bg-primary w-16' : 'bg-muted w-8',
            ]" />
        </div>
      </div>

      <div class="bg-card border rounded-lg shadow-sm p-8">
        <div v-if="currentStep === 1" class="space-y-8">
          <div class="text-center space-y-2">
            <h1 class="text-3xl font-bold">Choose Your Account Type</h1>
            <p class="text-muted-foreground">
              Select the option that best describes how you'll use RecruityHub
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <button
              @click="selectedType = 'COMPANY'"
              class="group relative p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg"
              :class="[
                selectedType === 'COMPANY'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-primary/50',
              ]">
              <div class="absolute top-4 right-4">
                <div
                  class="w-5 h-5 rounded-full border-2 transition-all"
                  :class="[
                    selectedType === 'COMPANY'
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/30',
                  ]">
                  <svg
                    v-if="selectedType === 'COMPANY'"
                    class="w-full h-full text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    class="w-6 h-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                <div>
                  <h3 class="text-xl font-semibold mb-2">Company</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">
                    Post recruitment bounties and connect with a global network
                    of talented recruiters. Pay only for successful hires.
                  </p>
                </div>

                <div class="pt-2 space-y-2">
                  <div class="flex items-start gap-2 text-sm">
                    <svg
                      class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-muted-foreground"
                      >Post unlimited bounties</span
                    >
                  </div>
                  <div class="flex items-start gap-2 text-sm">
                    <svg
                      class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-muted-foreground"
                      >Access top recruiters</span
                    >
                  </div>
                  <div class="flex items-start gap-2 text-sm">
                    <svg
                      class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-muted-foreground"
                      >Performance-based pricing</span
                    >
                  </div>
                </div>
              </div>
            </button>

            <button
              @click="selectedType = 'RECRUITER'"
              class="group relative p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg"
              :class="[
                selectedType === 'RECRUITER'
                  ? 'border-primary bg-primary/5'
                  : 'border-muted hover:border-primary/50',
              ]">
              <div class="absolute top-4 right-4">
                <div
                  class="w-5 h-5 rounded-full border-2 transition-all"
                  :class="[
                    selectedType === 'RECRUITER'
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground/30',
                  ]">
                  <svg
                    v-if="selectedType === 'RECRUITER'"
                    class="w-full h-full text-primary-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="3">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div class="space-y-4">
                <div
                  class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    class="w-6 h-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>

                <div>
                  <h3 class="text-xl font-semibold mb-2">Recruiter</h3>
                  <p class="text-sm text-muted-foreground leading-relaxed">
                    Browse bounties from companies worldwide and earn rewards by
                    submitting qualified candidates who get hired.
                  </p>
                </div>

                <div class="pt-2 space-y-2">
                  <div class="flex items-start gap-2 text-sm">
                    <svg
                      class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-muted-foreground"
                      >Browse global opportunities</span
                    >
                  </div>
                  <div class="flex items-start gap-2 text-sm">
                    <svg
                      class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-muted-foreground"
                      >Earn competitive rewards</span
                    >
                  </div>
                  <div class="flex items-start gap-2 text-sm">
                    <svg
                      class="w-4 h-4 text-primary mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    <span class="text-muted-foreground">No upfront costs</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div class="flex justify-center pt-4">
            <Button
              @click="goToStep2"
              :disabled="!selectedType"
              size="lg"
              class="px-8">
              Continue
            </Button>
          </div>
        </div>

        <div v-if="currentStep === 2" class="space-y-8">
          <div class="text-center space-y-2">
            <h1 class="text-3xl font-bold">How It Works</h1>
            <p class="text-muted-foreground">
              {{
                selectedType === "COMPANY"
                  ? "Start hiring with RecruityHub in 3 simple steps"
                  : "Start earning with RecruityHub in 3 simple steps"
              }}
            </p>
          </div>

          <div
            v-if="selectedType === 'COMPANY'"
            class="space-y-6 max-w-2xl mx-auto">
            <div class="flex gap-6 items-start">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div class="pt-2">
                <h3 class="text-xl font-semibold mb-2">Post a Bounty</h3>
                <p class="text-muted-foreground">
                  Create a detailed job listing with your requirements, budget,
                  and timeline. Set a reward amount for successful placements.
                </p>
              </div>
            </div>

            <div class="flex gap-6 items-start">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div class="pt-2">
                <h3 class="text-xl font-semibold mb-2">Review Candidates</h3>
                <p class="text-muted-foreground">
                  Recruiters from around the world submit qualified candidates.
                  Review their profiles, resumes, and conduct interviews at your
                  pace.
                </p>
              </div>
            </div>

            <div class="flex gap-6 items-start">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div class="pt-2">
                <h3 class="text-xl font-semibold mb-2">Hire & Pay</h3>
                <p class="text-muted-foreground">
                  Make your hiring decision and pay the recruiter their reward
                  only when you successfully hire a candidate. No upfront fees,
                  no hidden costs.
                </p>
              </div>
            </div>
          </div>

          <div v-else class="space-y-6 max-w-2xl mx-auto">
            <div class="flex gap-6 items-start">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div class="pt-2">
                <h3 class="text-xl font-semibold mb-2">Browse Bounties</h3>
                <p class="text-muted-foreground">
                  Explore job bounties from companies worldwide. Filter by
                  industry, location, role type, and reward amount to find the
                  perfect opportunities.
                </p>
              </div>
            </div>

            <div class="flex gap-6 items-start">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div class="pt-2">
                <h3 class="text-xl font-semibold mb-2">Submit Candidates</h3>
                <p class="text-muted-foreground">
                  Source and submit qualified candidates from your network.
                  Provide detailed information to increase your chances of a
                  successful placement.
                </p>
              </div>
            </div>

            <div class="flex gap-6 items-start">
              <div
                class="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div class="pt-2">
                <h3 class="text-xl font-semibold mb-2">Get Paid</h3>
                <p class="text-muted-foreground">
                  When the company hires your candidate, you receive your
                  reward. Track all your submissions and earnings in your
                  dashboard.
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-center gap-4 pt-4">
            <Button @click="currentStep = 1" variant="outline" size="lg">
              Back
            </Button>
            <Button
              @click="completeOnboarding"
              :disabled="isLoading"
              size="lg"
              class="px-8">
              <span v-if="!isLoading">Get Started</span>
              <span v-else class="flex items-center gap-2">
                <svg
                  class="animate-spin h-4 w-4"
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
                Setting up...
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from "@/lib/auth-client";

const currentStep = ref(1);
const selectedType = ref<"COMPANY" | "RECRUITER" | null>(null);
const isLoading = ref(false);

const session = authClient.useSession();

const goToStep2 = () => {
  if (selectedType.value) {
    currentStep.value = 2;
  }
};

const completeOnboarding = async () => {
  if (!selectedType.value || !session.value?.data?.user?.id) return;

  isLoading.value = true;

  try {
    await $fetch("/api/onboarding/complete", {
      method: "POST",
      body: {
        userId: session.value.data.user.id,
        userType: selectedType.value,
      },
    });

    await navigateTo("/");
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  layout: false,
});
</script>
