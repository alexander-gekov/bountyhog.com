<template>
  <!-- Clean background -->
  <div class="fixed inset-0 -z-10 bg-white dark:bg-gray-900"></div>
  <!-- Navigation -->
  <header class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
    <div class="container mx-auto px-4 py-4">
      <nav class="flex items-center justify-between">
        <div class="flex items-center space-x-8">
          <NuxtLink to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <span class="text-white text-sm font-bold">R</span>
            </div>
            <span class="text-xl font-bold text-gray-900 dark:text-white">RecruityHub</span>
          </NuxtLink>
          <div class="hidden md:flex items-center space-x-6">
            <NuxtLink
              to="/bounties"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Bounties
            </NuxtLink>
            <NuxtLink
              v-if="session.data?.user.userType === 'RECRUITER'"
              to="/my-bounties"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              My Bounties
            </NuxtLink>
            <NuxtLink
              to="/create"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Learn
            </NuxtLink>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button size="sm" variant="ghost" class="w-9 h-9 p-0">
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
          <template v-if="session.data">
            <NuxtLink
              to="/account"
              class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Account
            </NuxtLink>
            <Button @click="signOut" variant="outline" size="sm" class="rounded-xl">
              Sign Out
            </Button>
          </template>
          <template v-else>
            <NuxtLink to="/sign-in">
              <Button variant="ghost" size="sm" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Log in
              </Button>
            </NuxtLink>
            <NuxtLink to="/sign-up">
              <Button size="sm" class="bg-gray-900 hover:bg-gray-800 text-white rounded-xl">
                Get started
              </Button>
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
</template>

<script lang="ts" setup>
import { LucideMoon, LucideSun } from "lucide-vue-next";
import { authClient } from "@/lib/auth-client";

const colorMode = useColorMode();

// Get session data using Better Auth
const session = authClient.useSession();

const signOut = async () => {
  await authClient.signOut();
  await navigateTo("/sign-in");
};
</script>
