<template>
  <PatternBackground
    class="min-h-screen"
    :variant="PATTERN_BACKGROUND_VARIANT.Dot"
    :animate="true"
    :direction="PATTERN_BACKGROUND_DIRECTION.Bottom"
    size="sm"
    :mask="PATTERN_BACKGROUND_MASK.Ellipse">
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
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button size="sm" variant="ghost">
                  <LucideSun
                    class="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <LucideMoon
                    class="w-4 h-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span class="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem @click="colorMode = 'light'">
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem @click="colorMode = 'dark'">
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem @click="colorMode = 'auto'">
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
  </PatternBackground>
</template>

<script lang="ts" setup>
import {
  PATTERN_BACKGROUND_DIRECTION,
  PATTERN_BACKGROUND_MASK,
  PATTERN_BACKGROUND_VARIANT,
} from "@/app/components/ui/pattern-background";
import { LucideMoon, LucideSun } from "lucide-vue-next";
import { authClient } from "@/lib/auth-client";

const colorMode = useColorMode();

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
  await navigateTo("/");
};
</script>
