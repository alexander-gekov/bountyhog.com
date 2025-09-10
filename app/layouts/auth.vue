<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation for authenticated users -->
    <header class="border-b">
      <div class="container mx-auto px-4 py-4">
        <nav class="flex items-center justify-between">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-bold text-foreground">
              RecruityHub
            </NuxtLink>
            <div class="flex items-center space-x-6">
              <NuxtLink
                to="/bounties"
                class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Bounties
              </NuxtLink>
              <NuxtLink
                v-if="session.data?.user.userType === 'RECRUITER'"
                to="/my-bounties"
                class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                My Bounties
              </NuxtLink>
              <NuxtLink
                to="/create"
                class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Create
              </NuxtLink>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/account"
              class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Account
            </NuxtLink>
            <Button @click="signOut" variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";

// Get session data using Better Auth
const session = authClient.useSession();

// Redirect to sign-in if not authenticated
watch(
  session,
  (sessionData) => {
    if (process.client && !sessionData.data) {
      navigateTo("/sign-in");
    }
  },
  { immediate: true }
);

const signOut = async () => {
  await authClient.signOut();
  await navigateTo("/sign-in");
};
</script>
