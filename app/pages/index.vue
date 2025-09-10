<template>
  <div class="container mx-auto px-4 py-16">
    <div class="text-center max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold tracking-tight text-foreground mb-6">
        Welcome to RecruityHub
      </h1>
      <p class="text-xl text-muted-foreground mb-8">
        A marketplace that merges job recruitment with a bounty model. 
        Companies post bounties for open roles, recruiters collaborate to earn income.
      </p>
      <div class="flex items-center justify-center gap-4">
        <NuxtLink to="/bounties">
          <Button size="lg">
            Browse Bounties
          </Button>
        </NuxtLink>
        <NuxtLink to="/create">
          <Button variant="outline" size="lg">
            Post a Bounty
          </Button>
        </NuxtLink>
      </div>
    </div>
    
    <!-- Quick Stats or Features -->
    <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="text-center">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Competitive Payouts</h3>
        <p class="text-muted-foreground">Earn cash or percentage-based rewards for successful hires</p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Collaborative Network</h3>
        <p class="text-muted-foreground">Work together with other recruiters to find the best candidates</p>
      </div>
      
      <div class="text-center">
        <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Guaranteed Payments</h3>
        <p class="text-muted-foreground">Clear payout guarantees with transparent processes</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Redirect to bounties if this is meant to be the main landing
// For now, keep it as a landing page
</script>
