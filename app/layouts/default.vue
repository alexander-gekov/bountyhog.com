<template>
  <div class="min-h-screen bg-background">
    <!-- Navigation -->
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
            <template v-if="session.data">
              <NuxtLink
                to="/account"
                class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Account
              </NuxtLink>
              <Button @click="signOut" variant="outline" size="sm">
                Sign Out
              </Button>
            </template>
            <template v-else>
              <NuxtLink to="/sign-in">
                <Button variant="outline" size="sm"> Sign In </Button>
              </NuxtLink>
              <NuxtLink to="/sign-up">
                <Button size="sm"> Sign Up </Button>
              </NuxtLink>
            </template>
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

const signOut = async () => {
  await authClient.signOut();
  await navigateTo("/sign-in");
};
</script>
