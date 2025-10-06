<template>
  <div
    class="min-h-screen w-full flex items-center justify-center bg-background p-6">
    <div class="w-full max-w-4xl">
      <div class="mb-8 text-center">
        <NuxtLink to="/" class="text-2xl font-bold inline-block mb-4">
          BountyHog
        </NuxtLink>
        <div class="flex items-center justify-center gap-2 mt-6">
          <div
            v-for="step in 3"
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
            <h1 class="text-3xl font-bold">Complete Your Profile</h1>
            <p class="text-muted-foreground">
              All fields are optional, but filling them out makes you more
              trustworthy
            </p>
          </div>

          <div class="max-w-2xl mx-auto space-y-6">
            <div class="flex justify-center">
              <div class="relative">
                <Avatar class="w-24 h-24">
                  <AvatarImage v-if="formData.image" :src="formData.image" />
                  <AvatarFallback class="text-2xl">
                    {{ getInitials(formData.name) }}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="name">Full Name</Label>
                <Input
                  id="name"
                  v-model="formData.name"
                  placeholder="John Doe" />
              </div>

              <div class="space-y-2">
                <Label for="email">Business Email</Label>
                <Input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  placeholder="john@company.com" />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="phone">Phone Number</Label>
              <Input
                id="phone"
                v-model="formData.phone"
                type="tel"
                placeholder="+1 (555) 123-4567" />
            </div>

            <div class="space-y-2">
              <Label for="company">Company</Label>
              <Input
                id="company"
                v-model="formData.companyName"
                placeholder="Acme Inc." />
            </div>

            <div class="space-y-2">
              <Label for="bio">Bio</Label>
              <Textarea
                id="bio"
                v-model="formData.bio"
                placeholder="Tell us about yourself..."
                class="min-h-[100px]" />
            </div>

            <div class="space-y-4">
              <Label>Social Links</Label>

              <div class="space-y-2">
                <Label for="linkedin" class="text-sm text-muted-foreground"
                  >LinkedIn URL</Label
                >
                <Input
                  id="linkedin"
                  v-model="formData.linkedinUrl"
                  placeholder="https://linkedin.com/in/johndoe" />
              </div>

              <div class="space-y-2">
                <Label for="facebook" class="text-sm text-muted-foreground"
                  >Facebook URL</Label
                >
                <Input
                  id="facebook"
                  v-model="formData.facebookUrl"
                  placeholder="https://facebook.com/johndoe" />
              </div>

              <div class="space-y-2">
                <Label for="website" class="text-sm text-muted-foreground"
                  >Website URL</Label
                >
                <Input
                  id="website"
                  v-model="formData.websiteUrl"
                  placeholder="https://yourwebsite.com" />
              </div>
            </div>
          </div>

          <div class="flex justify-center pt-4">
            <Button @click="goToStep2" size="lg" class="px-8">
              Continue
            </Button>
          </div>
        </div>

        <div v-if="currentStep === 2" class="space-y-8">
          <div class="text-center space-y-2">
            <h1 class="text-3xl font-bold">Choose Your Account Type</h1>
            <p class="text-muted-foreground">
              Select the option that best describes how you'll use BountyHog
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
                    Post bounties and get access to employer branding features.
                    Only companies can post bounties.
                  </p>
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
                    Can create bounties, apply to work for bounties, and submit
                    candidates. Full platform access.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div class="flex justify-center gap-4 pt-4">
            <Button @click="currentStep = 1" variant="outline" size="lg">
              Back
            </Button>
            <Button
              @click="goToStep3"
              :disabled="!selectedType"
              size="lg"
              class="px-8">
              Continue
            </Button>
          </div>
        </div>

        <div v-if="currentStep === 3" class="space-y-8">
          <div class="text-center space-y-2">
            <h1 class="text-3xl font-bold">How It Works</h1>
            <p class="text-muted-foreground">
              Understanding the bounty workflow
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div class="space-y-6">
              <div class="flex items-start gap-3">
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Creating Bounties</h3>
                  <ul class="space-y-2 text-sm text-muted-foreground">
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Click "Post a Bounty" from your dashboard</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span
                        >Fill in the role details, budget, and job
                        description</span
                      >
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span
                        >Set required info for candidates (CV + custom
                        questions)</span
                      >
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Add contact details and set a due date</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Wait for recruiters to apply to your bounty</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Approve the recruiters you want to work with</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Review candidate submissions and make hires</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div class="flex items-start gap-3">
                <div
                  class="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    class="w-5 h-5 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-lg mb-2">Claiming Bounties</h3>
                  <ul class="space-y-2 text-sm text-muted-foreground">
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Browse available bounties on the platform</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Apply to a bounty by expressing your interest</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Wait for company approval to start working</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Once approved, submit candidates via the form</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span
                        >Candidate names stay hidden until legally-binding
                        document is signed</span
                      >
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="text-primary mt-1">•</span>
                      <span>Receive payment if all requirements are met</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-center gap-4 pt-4">
            <Button @click="currentStep = 2" variant="outline" size="lg">
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
const uploadProgress = ref(0);
const fileInput = ref<HTMLInputElement | null>(null);

const session = authClient.useSession();

const formData = ref({
  name: "",
  email: "",
  phone: "",
  bio: "",
  companyName: "",
  image: "",
  linkedinUrl: "",
  facebookUrl: "",
  websiteUrl: "",
});

onMounted(() => {
  if (!session.value?.data?.user) {
    navigateTo("/sign-in");
    return;
  }

  const user = session.value?.data?.user;
  if (user) {
    formData.value.name = user.name || "";
    formData.value.email = user.email || "";
    formData.value.image = user.image || "";
  }
});

const getInitials = (name: string) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2 && parts[0]?.[0] && parts[1]?.[0]) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const goToStep2 = () => {
  currentStep.value = 2;
};

const goToStep3 = () => {
  if (selectedType.value) {
    currentStep.value = 3;
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
        name: formData.value.name,
        email: formData.value.email,
        phone: formData.value.phone,
        bio: formData.value.bio,
        companyName: formData.value.companyName,
        image: formData.value.image,
        linkedinUrl: formData.value.linkedinUrl,
        facebookUrl: formData.value.facebookUrl,
        websiteUrl: formData.value.websiteUrl,
      },
    });

    await authClient.getSession();

    window.location.href = "/";
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
