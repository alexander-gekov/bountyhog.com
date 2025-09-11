<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Auth Check -->
    <div v-if="!session.data" class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Authentication Required</h1>
      <p class="text-muted-foreground mb-6">
        You need to sign in to access your dashboard.
      </p>
      <NuxtLink to="/sign-in">
        <Button>Sign In</Button>
      </NuxtLink>
    </div>

    <!-- Company Dashboard -->
    <div v-else-if="session.data?.user.userType === 'COMPANY'" class="space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Company Dashboard</h1>
          <p class="text-muted-foreground mt-2">
            Manage your bounties and review partnership requests
          </p>
        </div>
        <NuxtLink to="/create">
          <Button>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Bounty
          </Button>
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="space-y-4">
        <div v-for="n in 3" :key="n" class="animate-pulse">
          <div class="bg-muted rounded-lg p-6">
            <div class="h-4 bg-muted-foreground/20 rounded w-3/4 mb-3"></div>
            <div class="h-3 bg-muted-foreground/20 rounded w-1/2 mb-2"></div>
            <div class="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Total Bounties</p>
                  <p class="text-2xl font-bold">{{ bounties?.length || 0 }}</p>
                </div>
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M15 13l-3-3-3 3"></path>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Pending Partnerships</p>
                  <p class="text-2xl font-bold">{{ pendingPartnerships }}</p>
                </div>
                <div class="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Active Recruiters</p>
                  <p class="text-2xl font-bold">{{ activeRecruiters }}</p>
                </div>
                <div class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-muted-foreground">Total Submissions</p>
                  <p class="text-2xl font-bold">{{ totalSubmissions }}</p>
                </div>
                <div class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Tabs for different sections -->
        <Tabs default-value="partnership-requests" class="space-y-6">
          <TabsList class="grid w-full grid-cols-3">
            <TabsTrigger value="partnership-requests">Partnership Requests</TabsTrigger>
            <TabsTrigger value="my-bounties">My Bounties</TabsTrigger>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
          </TabsList>

          <!-- Partnership Requests Tab -->
          <TabsContent value="partnership-requests" class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Partnership Requests</h2>
              <Badge variant="secondary">{{ pendingPartnershipRequests.length }} pending</Badge>
            </div>

            <div v-if="pendingPartnershipRequests.length" class="space-y-4">
              <Card v-for="request in pendingPartnershipRequests" :key="request.id">
                <CardContent class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <div class="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          {{ request.recruiter.user.name.charAt(0) }}
                        </div>
                        <div>
                          <h3 class="font-semibold">{{ request.recruiter.user.name }}</h3>
                          <p class="text-sm text-muted-foreground">{{ request.recruiter.user.email }}</p>
                        </div>
                      </div>
                      <div class="mb-3">
                        <p class="text-sm font-medium mb-1">Interested in:</p>
                        <NuxtLink :to="`/company/bounty/${request.bounty.id}`" class="text-primary hover:underline">
                          {{ request.bounty.title }}
                        </NuxtLink>
                      </div>
                      <div v-if="request.introduction" class="mb-4">
                        <p class="text-sm font-medium mb-2">Introduction:</p>
                        <p class="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                          {{ request.introduction }}
                        </p>
                      </div>
                      <div class="text-xs text-muted-foreground">
                        Applied {{ formatDate(request.createdAt) }}
                      </div>
                    </div>
                    <div class="flex gap-2 ml-4">
                      <Button 
                        @click="approvePartnership(request.id)" 
                        :disabled="isProcessingPartnership" 
                        size="sm"
                      >
                        Approve
                      </Button>
                      <Button 
                        @click="showRejectDialog(request)" 
                        variant="outline" 
                        :disabled="isProcessingPartnership" 
                        size="sm"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div v-else class="text-center py-12">
              <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">No pending partnership requests</h3>
              <p class="text-muted-foreground">When recruiters express interest in your bounties, they'll appear here.</p>
            </div>
          </TabsContent>

          <!-- My Bounties Tab -->
          <TabsContent value="my-bounties" class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">My Bounties</h2>
              <NuxtLink to="/create">
                <Button size="sm">Create New Bounty</Button>
              </NuxtLink>
            </div>

            <div v-if="bounties?.length" class="space-y-4">
              <Card v-for="bounty in bounties" :key="bounty.id">
                <CardContent class="p-6">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="font-semibold">{{ bounty.title }}</h3>
                        <Badge :variant="getBountyStatusVariant(bounty.status)">{{ bounty.status }}</Badge>
                      </div>
                      <p class="text-sm text-muted-foreground mb-3 line-clamp-2">{{ bounty.description }}</p>
                      <div class="flex items-center gap-4 text-sm text-muted-foreground">
                        <div class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                          {{ bounty._count?.collaborations || 0 }} recruiters
                        </div>
                        <div class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                          </svg>
                          {{ bounty._count?.submissions || 0 }} submissions
                        </div>
                        <div v-if="bounty.deadline" class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {{ formatDate(bounty.deadline) }}
                        </div>
                      </div>
                    </div>
                    <div class="text-right ml-4">
                      <div class="text-lg font-bold">
                        <template v-if="bounty.payoutType === 'CASH'">
                          ${{ bounty.payoutAmount?.toLocaleString() }}
                        </template>
                        <template v-else>
                          {{ bounty.payoutPercentage }}%
                        </template>
                      </div>
                      <div class="text-sm text-muted-foreground mb-2">
                        {{ bounty.payoutType === 'CASH' ? 'Cash' : 'Percentage' }}
                      </div>
                      <NuxtLink :to="`/company/bounty/${bounty.id}`">
                        <Button size="sm" variant="outline">View Details</Button>
                      </NuxtLink>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div v-else class="text-center py-12">
              <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M15 13l-3-3-3 3"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">No bounties created yet</h3>
              <p class="text-muted-foreground mb-6">Create your first bounty to start finding talented recruiters.</p>
              <NuxtLink to="/create">
                <Button>Create Your First Bounty</Button>
              </NuxtLink>
            </div>
          </TabsContent>

          <!-- Submissions Tab -->
          <TabsContent value="submissions" class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Recent Submissions</h2>
              <Badge variant="secondary">{{ allSubmissions.length }} total</Badge>
            </div>

            <div v-if="allSubmissions.length" class="space-y-4">
              <Card v-for="submission in allSubmissions.slice(0, 10)" :key="submission.id">
                <CardContent class="p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="font-semibold">{{ submission.candidateName }}</h3>
                        <Badge :variant="getSubmissionStatusVariant(submission.status)">{{ submission.status }}</Badge>
                      </div>
                      <p class="text-sm text-muted-foreground mb-2">
                        For: <NuxtLink :to="`/company/bounty/${submission.bounty.id}`" class="text-primary hover:underline">
                          {{ submission.bounty.title }}
                        </NuxtLink>
                      </p>
                      <p class="text-sm text-muted-foreground mb-2">
                        Submitted by: {{ submission.recruiter.user.name }}
                      </p>
                      <div class="text-xs text-muted-foreground">
                        {{ formatDate(submission.createdAt) }}
                      </div>
                    </div>
                    <div class="ml-4">
                      <NuxtLink :to="`/company/bounty/${submission.bounty.id}`">
                        <Button size="sm" variant="outline">Review</Button>
                      </NuxtLink>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div v-else class="text-center py-12">
              <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">No submissions yet</h3>
              <p class="text-muted-foreground">Once recruiters start submitting candidates, they'll appear here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>

    <!-- Recruiter redirect -->
    <div v-else-if="session.data?.user.userType === 'RECRUITER'" class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Recruiter Dashboard</h1>
      <p class="text-muted-foreground mb-6">
        Recruiters should use the My Bounties page to manage their collaborations.
      </p>
      <NuxtLink to="/my-bounties">
        <Button>Go to My Bounties</Button>
      </NuxtLink>
    </div>

    <!-- Reject Partnership Dialog -->
    <Dialog v-model:open="showRejectDialogState">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reject Partnership Request</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this partnership request. This will be shared with the recruiter.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label for="rejection-reason">Reason for rejection</Label>
            <Textarea 
              id="rejection-reason"
              v-model="rejectionReason"
              placeholder="Please explain why you're declining this partnership request..."
              rows="3"
              class="mt-1"
            />
          </div>
        </div>
        <DialogFooter class="flex gap-2">
          <Button variant="outline" @click="showRejectDialogState = false">Cancel</Button>
          <Button 
            @click="rejectPartnership" 
            :disabled="isProcessingPartnership || !rejectionReason.trim()"
            variant="destructive"
          >
            Reject Partnership
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { authClient } from '@/lib/auth-client'

// Auth check
const session = authClient.useSession()

// Fetch company data
const { data: bounties, pending, refresh } = await useFetch('/api/company/bounties', {
  server: false,
  default: () => []
})

// Partnership requests data
const { data: partnershipRequests, refresh: refreshPartnershipRequests } = await useFetch('/api/company/partnership-requests', {
  server: false,
  default: () => []
})

// State
const isProcessingPartnership = ref(false)
const showRejectDialogState = ref(false)
const rejectionReason = ref('')
const selectedRequest = ref(null)

// Computed properties
const pendingPartnershipRequests = computed(() => 
  partnershipRequests.value?.filter(req => req.status === 'PENDING') || []
)

const pendingPartnerships = computed(() => pendingPartnershipRequests.value.length)

const activeRecruiters = computed(() => {
  if (!bounties.value) return 0
  const uniqueRecruiters = new Set()
  bounties.value.forEach(bounty => {
    bounty.collaborations?.forEach(collab => {
      if (collab.status === 'APPROVED') {
        uniqueRecruiters.add(collab.recruiterId)
      }
    })
  })
  return uniqueRecruiters.size
})

const totalSubmissions = computed(() => {
  if (!bounties.value) return 0
  return bounties.value.reduce((sum, bounty) => sum + (bounty._count?.submissions || 0), 0)
})

const allSubmissions = computed(() => {
  if (!bounties.value) return []
  const submissions = []
  bounties.value.forEach(bounty => {
    if (bounty.submissions) {
      submissions.push(...bounty.submissions.map(sub => ({ ...sub, bounty })))
    }
  })
  return submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

// Functions
const approvePartnership = async (requestId: string) => {
  isProcessingPartnership.value = true
  try {
    await $fetch(`/api/company/partnership-requests/${requestId}/approve`, {
      method: 'POST'
    })
    await refreshPartnershipRequests()
    await refresh()
  } catch (error) {
    console.error('Failed to approve partnership:', error)
  } finally {
    isProcessingPartnership.value = false
  }
}

const showRejectDialog = (request: any) => {
  selectedRequest.value = request
  showRejectDialogState.value = true
  rejectionReason.value = ''
}

const rejectPartnership = async () => {
  if (!selectedRequest.value || !rejectionReason.value.trim()) return
  
  isProcessingPartnership.value = true
  try {
    await $fetch(`/api/company/partnership-requests/${selectedRequest.value.id}/reject`, {
      method: 'POST',
      body: {
        reason: rejectionReason.value.trim()
      }
    })
    showRejectDialogState.value = false
    await refreshPartnershipRequests()
    await refresh()
  } catch (error) {
    console.error('Failed to reject partnership:', error)
  } finally {
    isProcessingPartnership.value = false
  }
}

// Helper functions
const getBountyStatusVariant = (status: string) => {
  switch (status) {
    case 'OPEN': return 'default'
    case 'IN_PROGRESS': return 'secondary'
    case 'COMPLETED': return 'outline'
    case 'CANCELLED': return 'destructive'
    default: return 'secondary'
  }
}

const getSubmissionStatusVariant = (status: string) => {
  switch (status) {
    case 'PENDING': return 'secondary'
    case 'REVIEWED': return 'default'
    case 'ACCEPTED': return 'default'
    case 'REJECTED': return 'destructive'
    default: return 'secondary'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Redirect if not authenticated
watch(session, (sessionData) => {
  if (process.client && !sessionData.data) {
    navigateTo('/sign-in')
  }
}, { immediate: true })
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