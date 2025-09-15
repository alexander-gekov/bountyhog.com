<template>
  <div class="min-h-screen relative bg-gradient-to-b from-purple-50 via-pink-50 to-gray-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-gray-950">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 pt-20 pb-16">
      <div class="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
        <!-- Left Content -->
        <div class="text-left lg:pr-8">
          <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            The recruitment app that 
            <span class="block">works for you</span>
          </h1>

          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
            Finding talent is hard, but you don't have to do it alone. RecruityHub empowers you to earn more, 
            connect better, see everything, and take back control of your recruiting life.
          </p>

          <div class="mb-12">
            <NuxtLink to="/bounties">
              <Button size="lg" class="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg rounded-2xl font-medium">
                Browse bounties
              </Button>
            </NuxtLink>
          </div>

          <!-- Live Stats -->
          <div class="grid grid-cols-3 gap-6 max-w-md">
            <div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ totalBounties }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Active Bounties</div>
            </div>
            <div>
              <div class="text-2xl font-bold text-green-600">
                ${{ formatNumber(totalPayout) }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Total Rewards
              </div>
            </div>
            <div>
              <div class="text-2xl font-bold text-purple-600">
                {{ totalRecruiters }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Recruiters</div>
            </div>
          </div>
        </div>

        <!-- Right Content - Phone Mockup -->
        <div class="flex justify-center lg:justify-end">
          <div class="relative">
            <!-- Phone Frame -->
            <div class="relative w-80 h-[600px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-[3rem] p-2 shadow-2xl">
              <div class="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
                <!-- Status Bar -->
                <div class="flex justify-between items-center px-6 pt-4 pb-2">
                  <div class="text-sm font-semibold">12:22</div>
                  <div class="flex items-center gap-1">
                    <div class="flex gap-1">
                      <div class="w-1 h-1 bg-black rounded-full"></div>
                      <div class="w-1 h-1 bg-black rounded-full"></div>
                      <div class="w-1 h-1 bg-black rounded-full"></div>
                      <div class="w-1 h-1 bg-black rounded-full"></div>
                    </div>
                    <svg class="w-6 h-4 ml-1" viewBox="0 0 24 16" fill="currentColor">
                      <rect x="0" y="6" width="24" height="4" rx="2" class="fill-black"/>
                      <rect x="20" y="4" width="4" height="8" rx="1" class="fill-black"/>
                    </svg>
                  </div>
                </div>

                <!-- App Header -->
                <div class="px-6 pb-4">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                        <span class="text-white text-sm font-bold">R</span>
                      </div>
                      <span class="font-semibold text-gray-900">RecruityHub</span>
                    </div>
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5-5-5h5v-12"></path>
                    </svg>
                  </div>
                </div>

                <!-- Current Earnings Card -->
                <div class="mx-6 mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white">
                  <div class="text-sm opacity-90 mb-1">Current earnings this month</div>
                  <div class="text-3xl font-bold mb-2">${{ (totalPayout / 10).toLocaleString() }}</div>
                  <div class="flex items-center gap-2 text-sm">
                    <div class="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                      <svg class="w-2 h-2 text-green-800" fill="currentColor" viewBox="0 0 8 8">
                        <path d="M4 0l1.5 3h2.5l-2 2 .5 3-2-1.5-2 1.5.5-3-2-2h2.5z"/>
                      </svg>
                    </div>
                    <span class="opacity-90">${{ Math.floor(totalPayout / 50).toLocaleString() }} above avg. earnings</span>
                  </div>
                </div>

                <!-- Bounties List -->
                <div class="px-6">
                  <div class="flex items-center justify-between mb-4">
                    <span class="font-semibold text-gray-900">BOUNTIES</span>
                    <span class="text-sm text-gray-500">as of about 19 hours ago</span>
                  </div>
                  
                  <div class="space-y-3">
                    <div v-for="(bounty, index) in featuredBounties?.slice(0, 2)" :key="bounty.id" class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span class="text-white text-xs font-semibold">
                            {{ bounty.company.companyName.charAt(0) }}
                          </span>
                        </div>
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ bounty.company.companyName }}</div>
                          <div class="text-xs text-gray-500">{{ bounty.title.substring(0, 25) }}...</div>
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="text-sm font-semibold text-gray-900">
                          <template v-if="bounty.payoutType === 'CASH'">
                            ${{ (bounty.payoutAmount / 1000).toFixed(0) }}k
                          </template>
                          <template v-else>
                            {{ bounty.payoutPercentage }}%
                          </template>
                        </div>
                        <div class="text-xs text-gray-500">reward</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- QR Code Section -->
                <div class="absolute bottom-6 right-6">
                  <div class="bg-gray-100 rounded-lg p-2">
                    <div class="w-16 h-16 bg-gray-800 rounded grid grid-cols-4 gap-px p-1">
                      <div v-for="n in 16" :key="n" :class="[
                        'bg-white rounded-sm',
                        Math.random() > 0.5 ? 'bg-gray-800' : 'bg-white'
                      ]"></div>
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 text-center mt-1">Scan to join</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Bounties Section -->
    <div class="bg-white dark:bg-gray-900 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Latest Opportunities
          </h2>
          <p class="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            See what companies are posting right now. These are real bounties with
            guaranteed payouts.
          </p>
        </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4 max-w-4xl mx-auto">
        <div v-for="n in 3" :key="n" class="animate-pulse">
          <Card>
            <CardContent class="p-6">
              <div class="flex items-start gap-4">
                <div class="w-14 h-14 bg-muted rounded-lg"></div>
                <div class="flex-1">
                  <div class="h-6 bg-muted rounded w-2/3 mb-2"></div>
                  <div class="h-4 bg-muted rounded w-1/2 mb-4"></div>
                  <div class="h-4 bg-muted rounded w-full"></div>
                </div>
                <div class="w-24 h-16 bg-muted rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Featured Bounties -->
      <div v-else-if="featuredBounties?.length" class="max-w-4xl mx-auto">
        <div class="relative -mx-2 -mt-2 overflow-auto scrollbar-thin">
          <ul class="divide-y divide-border">
            <a
              v-for="bounty in featuredBounties"
              :key="bounty.id"
              :href="`/company/bounty/${bounty.id}`"
              class="block whitespace-nowrap hover:bg-muted/50">
              <li class="flex items-center py-3 px-3">
                <div class="flex-shrink-0 mr-3">
                  <div
                    class="relative rounded-full shrink-0 overflow-hidden w-10 h-10">
                    <span
                      class="flex rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center w-full h-full text-sm font-semibold text-white">
                      {{ bounty.company.companyName.charAt(0).toUpperCase()
                      }}{{
                        bounty.company.companyName.charAt(1)?.toUpperCase() ||
                        ""
                      }}
                    </span>
                  </div>
                </div>

                <div class="flex-grow min-w-0 mr-4">
                  <div class="flex items-center text-sm">
                    <span class="font-semibold mr-1">
                      {{ bounty.company.companyName }}
                    </span>
                    <span class="text-muted-foreground mr-2">
                      #{{ bounty.id.slice(-4) }}
                    </span>
                    <span
                      class="font-display whitespace-nowrap text-sm font-semibold tabular-nums text-success mr-2">
                      <template v-if="bounty.payoutType === 'CASH'">
                        ${{ bounty.payoutAmount?.toLocaleString() }}
                      </template>
                      <template v-else>
                        {{ bounty.payoutPercentage }}%
                      </template>
                    </span>
                    <span class="text-foreground mr-2">{{ bounty.title }}</span>
                    <span
                      class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      NEW
                    </span>
                  </div>
                  <div
                    class="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{{ timeAgo(bounty.createdAt) }}</span>
                    <span
                      >{{ bounty._count?.collaborations || 0 }} recruiters
                      interested</span
                    >
                  </div>
                </div>
              </li>
            </a>
          </ul>
        </div>

        <div class="text-center pt-8">
          <NuxtLink to="/bounties">
            <Button variant="outline" size="lg">
              View All {{ totalBounties }} Bounties
            </Button>
          </NuxtLink>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 max-w-2xl mx-auto">
        <div
          class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            class="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">Be the First to Get Started</h3>
        <p class="text-muted-foreground mb-6">
          No bounties yet, but that means you have the opportunity to be among
          the first!
        </p>
        <NuxtLink to="/create">
          <Button size="lg">Post the First Bounty</Button>
        </NuxtLink>
      </div>
    </div>

      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-gray-50 dark:bg-gray-800/50 py-16">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Why RecruityHub Works
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div class="text-center">
            <div
              class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg
                class="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Guaranteed Payouts</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Transparent reward system with guaranteed payments. No hidden
              fees, no surprises.
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg
                class="w-8 h-8 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Collaborative Network</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Work with other top recruiters. Share opportunities and maximize
              your earning potential.
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg
                class="w-8 h-8 text-purple-600 dark:text-purple-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quality First</h3>
            <p class="text-gray-600 dark:text-gray-300">
              Only verified companies. All bounties come with clear requirements
              and fair compensation.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useBountiesQuery } from "@/composables/useBountiesQuery";

const { data: bounties, isPending: pending } = useBountiesQuery();

// Computed values for stats and featured bounties
const featuredBounties = computed(() => {
  if (!bounties.value?.bounties) return [];
  return bounties.value.bounties
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);
});

const totalBounties = computed(() => bounties.value?.bounties?.length || 0);

const totalPayout = computed(() => {
  if (!bounties.value?.bounties) return 0;
  return bounties.value.bounties.reduce((total: number, bounty: any) => {
    if (bounty.payoutType === "CASH" && bounty.payoutAmount) {
      return total + bounty.payoutAmount;
    }
    // For percentage bounties, estimate based on average salary
    if (bounty.payoutType === "PERCENTAGE" && bounty.payoutPercentage) {
      const estimatedSalary = 120000; // Conservative estimate
      return total + estimatedSalary * (bounty.payoutPercentage / 100);
    }
    return total;
  }, 0);
});

const totalRecruiters = computed(() => {
  if (!bounties.value?.bounties) return 0;
  const uniqueRecruiters = new Set();
  bounties.value.bounties.forEach((bounty: any) => {
    if (bounty._count?.collaborations) {
      // This is a rough estimate - in reality you'd count unique recruiters
      for (let i = 0; i < bounty._count.collaborations; i++) {
        uniqueRecruiters.add(`${bounty.id}-${i}`);
      }
    }
  });
  return uniqueRecruiters.size;
});

// Helper function for time ago
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return "Just posted";
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Helper function to format numbers
const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'k';
  }
  return num.toLocaleString();
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
