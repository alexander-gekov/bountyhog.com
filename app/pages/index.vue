<template>
  <div class="min-h-screen relative">
    <!-- Hero Section -->
    <div class="container mx-auto px-4 py-16">
      <div
        class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <!-- Left Column - Content -->
        <div class="text-center lg:text-left">
          <div
            class="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div class="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            Live bounties • Active deals happening now
          </div>

          <h1
            class="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
            Turn Your Network Into
            <span class="text-transparent bg-clip-text bg-primary">
              Income
            </span>
          </h1>

          <p class="text-xl text-muted-foreground mb-8 leading-relaxed">
            Connect top talent with dream jobs. Earn substantial rewards for
            successful placements. Join the marketplace where recruitment meets
            opportunity.
          </p>

          <div
            class="flex items-center justify-center lg:justify-start gap-4 mb-12">
            <NuxtLink to="/bounties">
              <Button size="lg" class="px-8 py-4 text-lg">
                Browse Active Bounties
              </Button>
            </NuxtLink>
            <NuxtLink to="/create">
              <Button variant="outline" size="lg" class="px-8 py-4 text-lg">
                Post a Bounty
              </Button>
            </NuxtLink>
          </div>
        </div>

        <!-- Right Column - Image -->
        <div class="flex justify-center lg:justify-end">
          <NuxtImg
            src="/recruityhub.png"
            alt="BountyHog"
            class="max-w-full h-auto" />
        </div>
      </div>

      <!-- Live Stats Section -->
      <!-- <div class="max-w-4xl mx-auto mt-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div class="text-center">
            <div class="text-2xl font-bold text-foreground">
              {{ totalBounties }}
            </div>
            <div class="text-sm text-muted-foreground">Active Bounties</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold">
              ${{ totalPayout?.toLocaleString() }}
            </div>
            <div class="text-sm text-muted-foreground">
              Total Rewards Available
            </div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">
              {{ totalRecruiters }}
            </div>
            <div class="text-sm text-muted-foreground">Active Recruiters</div>
          </div>
        </div>
      </div> -->
    </div>

    <!-- Live Bounties Section -->
    <div class="container mx-auto px-4 pb-16 mt-24">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-foreground mb-4">
          Latest Opportunities
        </h2>
        <p class="text-muted-foreground max-w-2xl mx-auto">
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
              :href="`/author/${bounty.user.id}/bounty/${bounty.id}`"
              class="block whitespace-nowrap hover:bg-muted/50">
              <li class="flex items-center py-3 px-3">
                <div class="flex-shrink-0 mr-3">
                  <div
                    class="relative rounded-full shrink-0 overflow-hidden w-10 h-10">
                    <span
                      class="flex rounded-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center w-full h-full text-sm font-semibold text-white">
                      {{ bounty.user.name.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                </div>

                <div class="flex-grow min-w-0 mr-4">
                  <div class="flex items-center text-sm">
                    <span class="font-semibold mr-1">
                      {{ bounty.user.companyName }}
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
                      class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
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
      <div v-else class="text-center py-16 max-w-sm mx-auto">
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
</template>

<script lang="ts" setup>
import { useBountiesQuery } from "@/composables/useBountiesQuery";
import { authClient } from "@/lib/auth-client";

const { data: bounties, isPending: pending } = useBountiesQuery();

const session = authClient.useSession();

watch(
  session,
  () => {
    if (session.value?.data?.user && !session.value.data.user.userType) {
      navigateTo("/onboarding");
    }
  },
  { immediate: true }
);

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
