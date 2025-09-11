<template>
  <div v-if="pending" class="container mx-auto px-4 py-8">
    <div class="animate-pulse space-y-6">
      <div class="h-8 bg-muted rounded w-3/4"></div>
      <div class="h-4 bg-muted rounded w-1/2"></div>
      <div class="h-32 bg-muted rounded"></div>
    </div>
  </div>

  <div v-else-if="error" class="container mx-auto px-4 py-8">
    <div class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Bounty Not Found</h1>
      <p class="text-muted-foreground mb-6">The bounty you're looking for doesn't exist or has been removed.</p>
      <NuxtLink to="/bounties">
        <Button>Back to Bounties</Button>
      </NuxtLink>
    </div>
  </div>

  <div v-else-if="bounty" class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <h1 class="text-3xl font-bold tracking-tight">{{ bounty.title }}</h1>
          <Badge :variant="bounty.status === 'OPEN' ? 'default' : 'secondary'">
            {{ bounty.status }}
          </Badge>
        </div>
        
        <div class="flex items-center gap-4 text-sm text-muted-foreground">
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <NuxtLink :to="`/company/${bounty.company.id}`" class="hover:text-foreground">
              {{ bounty.company.companyName }}
            </NuxtLink>
          </div>
          
          <div v-if="bounty.deadline" class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Deadline: {{ formatDate(bounty.deadline) }}
          </div>
          
          <div class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            {{ bounty._count?.collaborations || 0 }} recruiters working
          </div>
        </div>
      </div>
      
      <!-- Payout Info -->
      <div class="text-right">
        <div class="text-3xl font-bold text-foreground">
          <template v-if="bounty.payoutType === 'CASH'">
            ${{ bounty.payoutAmount?.toLocaleString() }}
          </template>
          <template v-else>
            {{ bounty.payoutPercentage }}%
          </template>
        </div>
        <div class="text-sm text-muted-foreground">
          {{ bounty.payoutType === 'CASH' ? 'Cash Bounty' : 'Percentage of Salary' }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{ bounty.guaranteeTimeframe === 'ONE_MONTH' ? '1 month' : '2 months' }} guarantee
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Description -->
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground leading-relaxed whitespace-pre-line">{{ bounty.description }}</p>
          </CardContent>
        </Card>
        
        <!-- Requirements -->
        <Card v-if="requirements.length">
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2">
              <li v-for="req in requirements" :key="req" class="flex items-start gap-2">
                <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-sm">{{ req }}</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <!-- Interview Process -->
        <Card v-if="bounty.interviewProcess">
          <CardHeader>
            <CardTitle>Interview Process</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">{{ bounty.interviewProcess }}</p>
          </CardContent>
        </Card>
        
        <!-- Guidelines -->
        <Card v-if="bounty.guidelines">
          <CardHeader>
            <CardTitle>Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-muted-foreground">{{ bounty.guidelines }}</p>
          </CardContent>
        </Card>
        
        <!-- Notes Section -->
        <Card>
          <CardHeader>
            <CardTitle>Notes & Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="bounty.notes?.length" class="space-y-4 mb-6">
              <div v-for="note in bounty.notes" :key="note.id" class="border-l-2 border-muted pl-4">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-medium text-sm">{{ note.user.name }}</span>
                  <span class="text-xs text-muted-foreground">
                    {{ formatDate(note.createdAt) }}
                  </span>
                </div>
                <p class="text-sm text-muted-foreground">{{ note.content }}</p>
              </div>
            </div>
            
            <!-- Add Note Form -->
            <form @submit.prevent="submitNote" class="space-y-4">
              <Textarea 
                v-model="newNote" 
                placeholder="Leave a note or ask a question..."
                :disabled="!user"
              />
              <Button type="submit" :disabled="!newNote.trim() || !user" size="sm">
                <template v-if="!user">Sign in to leave a note</template>
                <template v-else>Post Note</template>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Action Card -->
        <Card>
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <template v-if="!user">
              <p class="text-sm text-muted-foreground">
                Sign in to express interest and collaborate on this bounty.
              </p>
              <NuxtLink to="/sign-in">
                <Button class="w-full">Sign In</Button>
              </NuxtLink>
            </template>
            
            <template v-else-if="user.userType === 'RECRUITER'">
              <template v-if="!isCollaborating">
                <p class="text-sm text-muted-foreground">
                  Express your interest to start working on this bounty.
                </p>
                <div v-if="!showInterestForm">
                  <Button @click="showInterestForm = true" class="w-full">
                    Let's Work Together
                  </Button>
                </div>
                <div v-else class="space-y-4">
                  <div>
                    <Label for="introduction">Introduce Yourself</Label>
                    <Textarea 
                      id="introduction"
                      v-model="introductionText"
                      placeholder="Tell the company why you're interested in this bounty and what makes you a good fit..."
                      rows="4"
                      class="mt-1"
                    />
                  </div>
                  <div class="flex gap-2">
                    <Button 
                      @click="expressInterest" 
                      :disabled="isExpressingInterest || !introductionText.trim()" 
                      class="flex-1"
                    >
                      <template v-if="isExpressingInterest">Submitting...</template>
                      <template v-else>Submit Application</template>
                    </Button>
                    <Button 
                      @click="cancelInterest" 
                      variant="outline" 
                      :disabled="isExpressingInterest"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </template>
              
              <template v-else-if="collaboration?.status === 'PENDING'">
                <div class="text-center py-4">
                  <svg class="w-12 h-12 text-amber-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-sm font-medium">Application Submitted</p>
                  <p class="text-xs text-muted-foreground mt-1">
                    Waiting for company approval to start working together
                  </p>
                </div>
              </template>
              
              <template v-else-if="collaboration?.status === 'REJECTED'">
                <div class="text-center py-4">
                  <svg class="w-12 h-12 text-red-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <p class="text-sm font-medium">Application Declined</p>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{ collaboration?.rejectionReason || 'The company has declined your partnership request' }}
                  </p>
                </div>
              </template>
              
              <template v-else>
                <div class="text-center py-4">
                  <svg class="w-12 h-12 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-sm font-medium">Unlocked for Submissions</p>
                  <p class="text-xs text-muted-foreground mt-1">
                    You can now submit candidates
                  </p>
                </div>
                <Button class="w-full" @click="navigateTo('/my-bounties')">
                  Go to My Bounties
                </Button>
              </template>
            </template>
            
            <template v-else>
              <p class="text-sm text-muted-foreground">
                This is your company's bounty. You can manage collaborations and submissions.
              </p>
              <Button class="w-full" variant="outline">
                Manage Bounty
              </Button>
            </template>
          </CardContent>
        </Card>
        
        <!-- Company Info -->
        <Card>
          <CardHeader>
            <CardTitle>About {{ bounty.company.companyName }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p v-if="bounty.company.description" class="text-sm text-muted-foreground mb-4">
              {{ bounty.company.description }}
            </p>
            <NuxtLink :to="`/company/${bounty.company.id}`">
              <Button variant="outline" size="sm" class="w-full">
                View All Bounties
              </Button>
            </NuxtLink>
          </CardContent>
        </Card>
        
        <!-- Active Recruiters -->
        <Card v-if="bounty.collaborations?.length">
          <CardHeader>
            <CardTitle>Active Recruiters</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div 
                v-for="collab in bounty.collaborations" 
                :key="collab.id"
                class="flex items-center gap-3"
              >
                <div class="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  {{ collab.recruiter.user.name.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{{ collab.recruiter.user.name }}</p>
                  <p class="text-xs text-muted-foreground">
                    <template v-if="collab.status === 'APPROVED'">Approved</template>
                    <template v-else-if="collab.status === 'REJECTED'">Rejected</template>
                    <template v-else>Pending approval</template>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { authClient } from '@/lib/auth-client'

const route = useRoute()
const bountyId = route.params.id as string

// Get current user
const { data: user } = await authClient.useSession()

// Fetch bounty data
const { data: bounty, pending, error, refresh } = await useFetch(`/api/bounties/${bountyId}`, {
  server: false
})

// Parse requirements
const requirements = computed(() => {
  if (!bounty.value?.requirements) return []
  try {
    return JSON.parse(bounty.value.requirements)
  } catch {
    return []
  }
})

// Check if user is collaborating
const collaboration = computed(() => {
  if (!user.value || !bounty.value?.collaborations) return null
  return bounty.value.collaborations.find(c => c.recruiter.userId === user.value.id)
})

const isCollaborating = computed(() => !!collaboration.value)

// Form state
const newNote = ref('')
const isExpressingInterest = ref(false)
const showInterestForm = ref(false)
const introductionText = ref('')

// Express interest
const expressInterest = async () => {
  if (!user.value || !introductionText.value.trim()) return
  
  isExpressingInterest.value = true
  try {
    await $fetch(`/api/bounties/${bountyId}/collaborate`, {
      method: 'POST',
      body: {
        message: 'I\'m interested in working on this bounty.',
        introduction: introductionText.value.trim()
      }
    })
    showInterestForm.value = false
    introductionText.value = ''
    await refresh()
  } catch (error) {
    console.error('Failed to express interest:', error)
  } finally {
    isExpressingInterest.value = false
  }
}

// Cancel interest form
const cancelInterest = () => {
  showInterestForm.value = false
  introductionText.value = ''
}

// Submit note
const submitNote = async () => {
  if (!newNote.value.trim() || !user.value) return
  
  try {
    await $fetch(`/api/bounties/${bountyId}/notes`, {
      method: 'POST',
      body: {
        content: newNote.value.trim()
      }
    })
    newNote.value = ''
    await refresh()
  } catch (error) {
    console.error('Failed to submit note:', error)
  }
}

// Format date helper
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
</script>