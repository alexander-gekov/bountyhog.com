<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Active Bounties</h1>
        <p class="text-muted-foreground mt-2">
          Browse and apply to open recruitment bounties
        </p>
      </div>
      
      <!-- Filters and Sort -->
      <div class="flex items-center gap-4">
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
        
        <Button @click="refreshBounties" variant="outline" size="sm">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh
        </Button>
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
    
    <!-- Bounties Grid -->
    <div v-else-if="bounties?.length" class="grid gap-6">
      <div 
        v-for="bounty in sortedBounties" 
        :key="bounty.id"
        class="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateTo(`/company/bounty/${bounty.id}`)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                {{ bounty.title }}
              </h3>
              <Badge 
                :variant="bounty.status === 'OPEN' ? 'default' : 'secondary'"
                class="text-xs"
              >
                {{ bounty.status }}
              </Badge>
            </div>
            
            <p class="text-sm text-muted-foreground mb-3 line-clamp-2">
              {{ bounty.description }}
            </p>
            
            <div class="flex items-center gap-4 text-xs text-muted-foreground">
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                {{ bounty.company.companyName }}
              </div>
              
              <div v-if="bounty.deadline" class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ formatDate(bounty.deadline) }}
              </div>
              
              <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {{ bounty._count?.collaborations || 0 }} recruiters working
              </div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="text-lg font-bold text-foreground">
              <template v-if="bounty.payoutType === 'CASH'">
                ${{ bounty.payoutAmount?.toLocaleString() }}
              </template>
              <template v-else>
                {{ bounty.payoutPercentage }}%
              </template>
            </div>
            <div class="text-xs text-muted-foreground">
              {{ bounty.payoutType === 'CASH' ? 'Cash' : 'Percentage' }}
            </div>
            <div class="text-xs text-muted-foreground mt-1">
              {{ bounty.guaranteeTimeframe === 'ONE_MONTH' ? '1 month' : '2 months' }} guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold mb-2">No bounties found</h3>
      <p class="text-muted-foreground mb-6">
        Be the first to post a bounty or check back later for new opportunities.
      </p>
      <NuxtLink to="/create">
        <Button>Post a Bounty</Button>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
const sortBy = ref('newest')

// Fetch bounties data
const { data: bounties, pending, refresh: refreshBounties } = await useFetch('/api/bounties', {
  server: false,
  default: () => []
})

// Computed sorted bounties
const sortedBounties = computed(() => {
  if (!bounties.value) return []
  
  const sorted = [...bounties.value]
  
  switch (sortBy.value) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'payout-high':
      return sorted.sort((a, b) => {
        const aValue = a.payoutType === 'CASH' ? (a.payoutAmount || 0) : (a.payoutPercentage || 0) * 100
        const bValue = b.payoutType === 'CASH' ? (b.payoutAmount || 0) : (b.payoutPercentage || 0) * 100
        return bValue - aValue
      })
    case 'payout-low':
      return sorted.sort((a, b) => {
        const aValue = a.payoutType === 'CASH' ? (a.payoutAmount || 0) : (a.payoutPercentage || 0) * 100
        const bValue = b.payoutType === 'CASH' ? (b.payoutAmount || 0) : (b.payoutPercentage || 0) * 100
        return aValue - bValue
      })
    case 'deadline':
      return sorted.sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      })
    default:
      return sorted
  }
})

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return 'Expired'
  } else if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Tomorrow'
  } else if (diffDays < 7) {
    return `${diffDays} days`
  } else {
    return date.toLocaleDateString()
  }
}

// Watch sort changes
watch(sortBy, () => {
  // Sorting is reactive via computed
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>