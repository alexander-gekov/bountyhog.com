<template>
  <div class="min-h-screen w-full lg:grid lg:grid-cols-2">
    <!-- Left side: Form -->
    <div
      class="flex flex-col justify-between p-6 sm:p-10 bg-background text-foreground">
      <NuxtLink to="/" class="text-2xl font-bold"> RecruityHub </NuxtLink>

      <div class="mx-auto my-auto w-full max-w-sm space-y-6">
        <div class="space-y-2 text-left">
          <h1 class="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p class="text-muted-foreground">Sign in to your account</p>
        </div>

        <form @submit.prevent="handleSignIn" class="space-y-4">
          <div>
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              required
              placeholder="you@example.com" />
          </div>

          <div>
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="formData.password"
              type="password"
              required
              placeholder="••••••••" />
          </div>

          <div v-if="error" class="pt-2">
            <div
              class="bg-red-50 border border-red-200 text-sm text-red-700 px-4 py-3 rounded">
              {{ error }}
            </div>
          </div>

          <Button
            type="submit"
            :disabled="isLoading"
            :variant="lastMethod === 'email' ? 'default' : 'outline'"
            class="w-full !mt-6 relative"
            size="lg">
            <span
              v-if="!isLoading"
              class="flex items-center justify-center gap-2">
              Sign In
              <Badge
                v-if="lastMethod === 'email'"
                variant="secondary"
                class="text-xs absolute right-0 -top-4">
                Last used
              </Badge>
            </span>
            <span v-else class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5"
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
              Signing in...
            </span>
          </Button>

          <div class="relative">
            <div class="text-center text-sm">
              <p class="text-muted-foreground">Or sign in with</p>
            </div>

            <!-- OAuth Providers (Google) -->
            <Button
              type="button"
              @click="handleSignInWithGoogle"
              :variant="lastMethod === 'google' ? 'default' : 'outline'"
              class="w-full !mt-6 relative"
              size="lg">
              <span class="flex items-center justify-center gap-2">
                Sign in with Google
                <Badge
                  v-if="lastMethod === 'google'"
                  variant="secondary"
                  class="text-xs absolute right-0 -top-4">
                  Last used
                </Badge>
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                class="ml-2">
                <path
                  fill="currentColor"
                  d="M11.99 13.9v-3.72h9.36c.14.63.25 1.22.25 2.05c0 5.71-3.83 9.77-9.6 9.77c-5.52 0-10-4.48-10-10S6.48 2 12 2c2.7 0 4.96.99 6.69 2.61l-2.84 2.76c-.72-.68-1.98-1.48-3.85-1.48c-3.31 0-6.01 2.75-6.01 6.12s2.7 6.12 6.01 6.12c3.83 0 5.24-2.65 5.5-4.22h-5.51z" />
              </svg>
            </Button>
          </div>

          <div class="text-center text-sm">
            <p class="text-muted-foreground">
              Don't have an account?
              <NuxtLink
                to="/sign-up"
                class="font-semibold text-primary underline-offset-4 hover:underline">
                Sign up now
              </NuxtLink>
            </p>
          </div>
        </form>
      </div>

      <p class="text-xs text-muted-foreground text-center">
        By continuing, you agree to our
        <a href="#" class="underline underline-offset-4">terms</a>
        and
        <a href="#" class="underline underline-offset-4">privacy policy</a>.
      </p>
    </div>

    <!-- Right side: Testimonial -->
    <div class="hidden lg:flex items-center justify-center bg-muted p-10">
      <div class="w-full max-w-md text-left space-y-6">
        <Quote class="w-16 h-16 text-foreground/20" :stroke-width="1.5" />
        <p class="text-2xl font-medium text-foreground/80 leading-relaxed">
          A GitHub issue is this atomic unit of a problem, and allowing you to
          put a cash bounty on it, to solve this specific problem, without any
          overhead, and make it available to any person, I find it very
          interesting.
        </p>
        <div class="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src="https://picsum.photos/id/237/200"
              alt="Jonny Burger" />
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>
          <div>
            <p class="font-semibold">Jonny Burger</p>
            <p class="text-sm text-muted-foreground">Founder, Remotion</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";
import { Quote } from "lucide-vue-next";

// Removed colorMode and theme toggle logic as it's not in the new design
// const colorMode = useColorMode();
// import { LucideMoon, LucideSun } from "lucide-vue-next";

interface SignInFormData {
  email: string;
  password: string;
}

const formData = ref<SignInFormData>({
  email: "",
  password: "",
});

const isLoading = ref(false);
const error = ref("");

const lastMethod = authClient.getLastUsedLoginMethod();

const handleSignInWithGoogle = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};

const handleSignIn = async () => {
  if (isLoading.value) return;

  error.value = "";
  isLoading.value = true;

  try {
    const { data, error: authError } = await authClient.signIn.email({
      email: formData.value.email,
      password: formData.value.password,
      callbackURL: window.location.origin,
    });

    if (authError) {
      error.value = authError.message || "Failed to sign in";
      return;
    }

    if (data?.user) {
      await navigateTo("/");
    }
  } catch (err) {
    console.error("Sign in error:", err);
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
