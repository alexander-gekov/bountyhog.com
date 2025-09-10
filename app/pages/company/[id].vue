<template>
  <div v-if="pending" class="container mx-auto px-4 py-8">
    <div class="animate-pulse space-y-6">
      <div class="h-8 bg-muted rounded w-1/2"></div>
      <div class="h-4 bg-muted rounded w-3/4"></div>
      <div class="grid gap-4">
        <div v-for="n in 3" :key="n" class="h-32 bg-muted rounded"></div>
      </div>
    </div>
  </div>

  <div v-else-if="error" class="container mx-auto px-4 py-8">
    <div class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Company Not Found</h1>
      <p class="text-muted-foreground mb-6">
        The company you're looking for doesn't exist.
      </p>
      <NuxtLink to="/bounties">
        <Button>Back to Bounties</Button>
      </NuxtLink>
    </div>
  </div>

  <div v-else-if="company" class="container mx-auto px-4 py-8">
    <!-- Company Header -->
    <div class="mb-8">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight mb-2">
            {{ company.companyName }}
          </h1>
          <p v-if="company.description" class="text-lg text-muted-foreground">
            {{ company.description }}
          </p>
        </div>

        <div class="flex items-center gap-4">
          <a
            v-if="company.website"
            :href="company.website"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Visit Website
          </a>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-6 text-sm text-muted-foreground">
        <div class="flex items-center gap-1">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M15 13l-3-3-3 3"></path>
          </svg>
          {{ company.bounties.length }} total bounties
        </div>
        <div class="flex items-center gap-1">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          {{ openBounties.length }} open bounties
        </div>
        <div class="flex items-center gap-1">
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
          ${{ totalBountyValue.toLocaleString() }} total bounty value
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <Select v-model="statusFilter">
          <SelectTrigger class="w-[140px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="sortBy">
          <SelectTrigger class="w-[160px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="payout-high">Highest Payout</SelectItem>
            <SelectItem value="deadline">Deadline Soon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="text-sm text-muted-foreground">
        {{ filteredBounties.length }} bounties
      </div>
    </div>

    <!-- Bounties List -->
    <div
      v-if="filteredBounties.length"
      class="relative -mx-2 -mt-2 overflow-auto scrollbar-thin">
      <ul class="divide-y divide-border">
        <a
          v-for="bounty in filteredBounties"
          :key="bounty.id"
          :href="`/company/bounty/${bounty.id}`"
          class="block whitespace-nowrap hover:bg-muted/50">
          <li class="flex items-center py-2 px-3">
            <div class="flex-shrink-0 mr-3">
              <div
                class="relative rounded-full shrink-0 overflow-hidden w-8 h-8">
                <span
                  class="flex rounded-full bg-muted items-center justify-center w-full h-full text-sm font-semibold">
                  {{ company.companyName.charAt(0).toUpperCase()
                  }}{{ company.companyName.charAt(1)?.toUpperCase() || "" }}
                </span>
              </div>
            </div>

            <div class="flex-grow min-w-0 mr-4">
              <div class="flex items-center text-sm">
                <span class="font-semibold mr-1">
                  {{ company.companyName }}
                </span>
                <span class="text-muted-foreground mr-2">
                  #{{ bounty.id.slice(-4) }}
                </span>
                <Badge
                  :variant="getBadgeVariant(bounty.status)"
                  class="text-xs mr-2">
                  {{ bounty.status }}
                </Badge>
                <span
                  class="font-display whitespace-nowrap text-sm font-semibold tabular-nums text-success mr-2">
                  <template v-if="bounty.payoutType === 'CASH'">
                    ${{ bounty.payoutAmount?.toLocaleString() }}
                  </template>
                  <template v-else> {{ bounty.payoutPercentage }}% </template>
                </span>
                <span class="text-foreground">{{ bounty.title }}</span>
              </div>
              <div
                class="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span v-if="bounty.deadline">{{
                  formatDate(bounty.deadline)
                }}</span>
                <span>{{ bounty._count?.collaborations || 0 }} recruiters</span>
                <span>{{ bounty._count?.submissions || 0 }} submissions</span>
                <span>Created {{ formatDate(bounty.createdAt) }}</span>
              </div>
            </div>
          </li>
        </a>
      </ul>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div
        class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          class="w-8 h-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M15 13l-3-3-3 3"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold mb-2">
        {{
          statusFilter === "all"
            ? "No bounties found"
            : `No ${statusFilter.toLowerCase()} bounties`
        }}
      </h3>
      <p class="text-muted-foreground mb-6">
        {{
          statusFilter === "all"
            ? "This company hasn't posted any bounties yet."
            : `This company has no ${statusFilter.toLowerCase()} bounties at the moment.`
        }}
      </p>
      <div class="flex gap-4 justify-center">
        <Button variant="outline" @click="statusFilter = 'all'">
          Show All Bounties
        </Button>
        <NuxtLink to="/bounties">
          <Button>Browse Other Bounties</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const route = useRoute();
const companyId = route.params.id as string;

// Reactive filters
const statusFilter = ref("all");
const sortBy = ref("newest");

// Fetch company data
const {
  data: company,
  pending,
  error,
} = await useFetch(`/api/companies/${companyId}`, {
  server: false,
});

// Computed properties
const openBounties = computed(
  () => company.value?.bounties.filter((b) => b.status === "OPEN") || []
);

const totalBountyValue = computed(() => {
  if (!company.value?.bounties) return 0;
  return company.value.bounties
    .filter((b) => b.payoutType === "CASH")
    .reduce((sum, b) => sum + (b.payoutAmount || 0), 0);
});

const filteredBounties = computed(() => {
  if (!company.value?.bounties) return [];

  let filtered = [...company.value.bounties];

  // Filter by status
  if (statusFilter.value !== "all") {
    filtered = filtered.filter((b) => b.status === statusFilter.value);
  }

  // Sort
  switch (sortBy.value) {
    case "newest":
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "oldest":
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "payout-high":
      filtered.sort((a, b) => {
        const aValue =
          a.payoutType === "CASH"
            ? a.payoutAmount || 0
            : (a.payoutPercentage || 0) * 100;
        const bValue =
          b.payoutType === "CASH"
            ? b.payoutAmount || 0
            : (b.payoutPercentage || 0) * 100;
        return bValue - aValue;
      });
      break;
    case "deadline":
      filtered.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
      break;
  }

  return filtered;
});

// Helper functions
const getBadgeVariant = (status: string) => {
  switch (status) {
    case "OPEN":
      return "default";
    case "IN_PROGRESS":
      return "secondary";
    case "COMPLETED":
      return "outline";
    case "CANCELLED":
      return "destructive";
    default:
      return "secondary";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Expired";
  } else if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Tomorrow";
  } else if (diffDays < 7) {
    return `${diffDays} days`;
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
