<template>
  <div class="container mx-auto max-w-7xl space-y-6 p-4 md:p-6 lg:px-8">
    <div class="relative h-full">
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between pb-2 gap-2">
        <div class="flex flex-col space-y-1.5">
          <h2 class="text-2xl font-semibold leading-none tracking-tight">
            Bounties
          </h2>
          <p class="text-sm text-muted-foreground">Open bounties for you</p>
        </div>

        <div class="md:ml-auto flex items-center gap-2">
          <Select v-model="sortBy">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="payout-high">Highest Payout</SelectItem>
              <SelectItem value="payout-low">Lowest Payout</SelectItem>
              <SelectItem value="deadline">Deadline Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div
        class="mb-4 flex sm:flex-wrap gap-2 whitespace-nowrap overflow-x-auto scrollbar-thin">
        <div
          v-for="tech in techFilters"
          :key="tech.name"
          @click="toggleTechFilter(tech.name)"
          class="cursor-pointer">
          <div
            class="relative inline-flex px-2 py-1 rounded-md border-accent-foreground/20 bg-accent/10 text-accent-foreground transition-colors items-center font-medium text-xs hover:bg-accent/80 border"
            :class="{
              'bg-accent/80': selectedTechFilters.includes(tech.name),
            }">
            {{ tech.name }} ({{ tech.count }})
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <div v-for="n in 6" :key="n" class="animate-pulse">
          <div class="bg-muted rounded-lg p-6">
            <div class="h-4 bg-muted-foreground/20 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-muted-foreground/20 rounded w-1/2 mb-2"></div>
            <div class="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Bounties List -->
      <div
        v-else-if="filteredBounties?.length"
        class="relative -mx-2 -mt-2 overflow-auto scrollbar-thin">
        <ul class="divide-y divide-border">
          <Bounty
            v-for="bounty in filteredBounties"
            :key="bounty.id"
            :bounty="bounty" />
        </ul>

        <!-- Load More Button -->
        <div v-if="hasNextPage" class="flex justify-center mt-6">
          <Button @click="fetchNextPage" variant="outline"> Load More </Button>
        </div>
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">No bounties found</h3>
        <p class="text-muted-foreground mb-6">
          Be the first to post a bounty or check back later for new
          opportunities.
        </p>
        <NuxtLink to="/create">
          <Button>Post a Bounty</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useInfiniteBountiesQuery } from "@/composables/useInfiniteBountiesQuery";

const sortBy = ref("newest");
const selectedTechFilters = ref<string[]>([]);

const { 
  data: bountiesData, 
  isPending: pending, 
  fetchNextPage, 
  hasNextPage, 
  prefetchBounties 
} = useInfiniteBountiesQuery();

onMounted(() => {
  prefetchBounties();
});

const allBounties = computed(() => {
  return bountiesData.value?.pages.flatMap(page => page.bounties) || [];
});

// Extract technologies from requirements
const techFilters = computed(() => {
  if (!allBounties.value) return [];

  const techCount = new Map<string, number>();

  allBounties.value.forEach((bounty: any) => {
    try {
      const requirements = JSON.parse(bounty.requirements) || [];
      requirements.forEach((tech: string) => {
        techCount.set(tech, (techCount.get(tech) || 0) + 1);
      });
    } catch {
      // Ignore JSON parse errors
    }
  });

  return Array.from(techCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // Show top 20 technologies
});

// Toggle tech filter
const toggleTechFilter = (tech: string) => {
  const index = selectedTechFilters.value.indexOf(tech);
  if (index > -1) {
    selectedTechFilters.value.splice(index, 1);
  } else {
    selectedTechFilters.value.push(tech);
  }
};

// Computed filtered and sorted bounties (all results)
const filteredBounties = computed(() => {
  if (!allBounties.value) return [];

  let filtered = [...allBounties.value];

  // Apply tech filters
  if (selectedTechFilters.value.length > 0) {
    filtered = filtered.filter((bounty: any) => {
      try {
        const requirements = JSON.parse(bounty.requirements) || [];
        return selectedTechFilters.value.some((tech) =>
          requirements.includes(tech)
        );
      } catch {
        return false;
      }
    });
  }

  // Apply sorting
  switch (sortBy.value) {
    case "newest":
      return filtered.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    case "oldest":
      return filtered.sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    case "payout-high":
      return filtered.sort((a: any, b: any) => {
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
    case "payout-low":
      return filtered.sort((a: any, b: any) => {
        const aValue =
          a.payoutType === "CASH"
            ? a.payoutAmount || 0
            : (a.payoutPercentage || 0) * 100;
        const bValue =
          b.payoutType === "CASH"
            ? b.payoutAmount || 0
            : (b.payoutPercentage || 0) * 100;
        return aValue - bValue;
      });
    case "deadline":
      return filtered.sort((a: any, b: any) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    default:
      return filtered;
  }
});

</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
