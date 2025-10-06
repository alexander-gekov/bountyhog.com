<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Auth Check -->
    <div v-if="!session.data" class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Authentication Required</h1>
      <p class="text-muted-foreground mb-6">
        You need to sign in to view your bounties.
      </p>
      <NuxtLink to="/sign-in">
        <Button>Sign In</Button>
      </NuxtLink>
    </div>

    <!-- Check for valid user types -->
    <div
      v-else-if="
        !['RECRUITER', 'COMPANY'].includes(session.data?.user.userType || '')
      "
      class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Access Restricted</h1>
      <p class="text-muted-foreground mb-6">
        This page is only accessible to recruiters and companies.
      </p>
      <NuxtLink to="/bounties">
        <Button>Browse Bounties</Button>
      </NuxtLink>
    </div>

    <!-- Main Dashboard -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">My Bounties</h1>
          <p class="text-muted-foreground mt-2">
            {{
              session.data?.user.userType === "RECRUITER"
                ? "Manage your bounty applications and posted bounties"
                : "Manage your posted bounties and review applications"
            }}
          </p>
        </div>

        <div class="flex gap-2">
          <NuxtLink
            v-if="session.data?.user.userType === 'COMPANY'"
            to="/create">
            <Button>
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"></path>
              </svg>
              Post New Bounty
            </Button>
          </NuxtLink>
          <NuxtLink to="/bounties">
            <Button variant="outline">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Find More Bounties
            </Button>
          </NuxtLink>
        </div>
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

      <!-- Tabs Navigation -->
      <div v-else class="mb-6">
        <div class="border-b border-border">
          <nav class="-mb-px flex space-x-8">
            <!-- Applied Bounties Tab (Recruiters only) -->
            <button
              v-if="
                session.data?.user.userType === 'RECRUITER' &&
                appliedBounties.length > 0
              "
              @click="activeTab = 'applied'"
              :class="[
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'applied'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground',
              ]">
              Applied Bounties ({{ appliedBounties.length }})
            </button>

            <!-- Posted Bounties Tab -->
            <button
              v-if="postedBounties.length > 0"
              @click="activeTab = 'posted'"
              :class="[
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === 'posted'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground',
              ]">
              Posted Bounties ({{ postedBounties.length }})
            </button>
          </nav>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="!pending" class="mb-6">
        <!-- Applied Bounties Stats -->
        <div
          v-if="activeTab === 'applied' && appliedBounties.length > 0"
          class="flex items-center gap-6 w-full bg-muted/40 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Total Applied</p>
            <p class="text-lg font-medium">{{ appliedBounties.length }}</p>
          </div>
          <div class="h-4 w-px bg-border"></div>
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Approved</p>
            <p class="text-lg font-medium">
              {{ unlockedCollaborations.length }}
            </p>
          </div>
          <div class="h-4 w-px bg-border"></div>
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Pending</p>
            <p class="text-lg font-medium">
              {{ pendingCollaborations.length }}
            </p>
          </div>
          <div class="h-4 w-px bg-border"></div>
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">My Submissions</p>
            <p class="text-lg font-medium">{{ totalSubmissions }}</p>
          </div>
        </div>

        <!-- Posted Bounties Stats -->
        <div
          v-if="activeTab === 'posted' && postedBounties.length > 0"
          class="flex items-center gap-6 w-full bg-muted/40 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Total Posted</p>
            <p class="text-lg font-medium">{{ postedBounties.length }}</p>
          </div>
          <div class="h-4 w-px bg-border"></div>
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Partnership Requests</p>
            <p class="text-lg font-medium">{{ totalPartnershipRequests }}</p>
          </div>
          <div class="h-4 w-px bg-border"></div>
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Pending Reviews</p>
            <p class="text-lg font-medium">{{ pendingPartnershipRequests }}</p>
          </div>
          <div class="h-4 w-px bg-border"></div>
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Candidate Submissions</p>
            <p class="text-lg font-medium">{{ totalCandidateSubmissions }}</p>
          </div>
        </div>
      </div>

      <!-- Applied Bounties List (Recruiter view) -->
      <div
        v-if="activeTab === 'applied' && appliedBounties.length"
        class="relative -mx-2 -mt-2">
        <ul class="divide-y divide-border">
          <li v-for="collaboration in appliedBounties" :key="collaboration.id">
            <div class="flex flex-col cursor-pointer">
              <div class="hover:bg-muted/50 transition-colors">
                <Bounty
                  :bounty="collaboration.bounty"
                  @click="
                    navigateTo(
                      `/author/${collaboration.bounty.user.id}/bounty/${collaboration.bounty.id}`
                    )
                  ">
                  <div class="text-xs text-muted-foreground">
                    <div class="flex items-center gap-2">
                      <span>{{
                        getPartnershipStatusLabel(collaboration.status)
                      }}</span>
                      <span v-if="collaboration.bounty.deadline">•</span>
                      <span v-if="collaboration.bounty.deadline">{{
                        formatDate(collaboration.bounty.deadline)
                      }}</span>
                      <span>•</span>
                      <span
                        >{{
                          collaboration.submissions?.length || 0
                        }}
                        submissions</span
                      >
                    </div>
                  </div>
                </Bounty>
              </div>

              <!-- Rejection Reason (if rejected) -->
              <div
                v-if="collaboration.status === 'REJECTED'"
                class="px-3 py-2 bg-destructive/5 border-l-2 border-destructive text-sm">
                <p class="text-destructive-foreground">
                  {{
                    collaboration.rejectionReason ||
                    "The company declined your partnership request."
                  }}
                </p>
              </div>

              <!-- Submission Section (only if approved) -->
              <div
                v-if="
                  collaboration.status === 'APPROVED' &&
                  collaboration.bounty.status === 'OPEN'
                "
                class="px-3 py-2 border-t border-border">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-muted-foreground"
                      >{{
                        collaboration.submissions?.length || 0
                      }}
                      submissions</span
                    >
                    <Button
                      @click="toggleSubmissionForm(collaboration.id)"
                      variant="ghost"
                      size="sm">
                      {{
                        showSubmissionForm === collaboration.id
                          ? "Cancel"
                          : "New Submission"
                      }}
                    </Button>
                  </div>
                </div>

                <!-- Submission Form -->
                <div
                  v-if="showSubmissionForm === collaboration.id"
                  class="mt-4">
                  <CandidateSubmissionForm
                    :bounty="{
                      id: collaboration.bounty.id,
                      title: collaboration.bounty.title,
                      requirements: collaboration.bounty.requirements,
                      guidelines: collaboration.bounty.guidelines,
                    }"
                    :collaboration-id="collaboration.id"
                    :is-submitting="isSubmitting"
                    :show-cancel="true"
                    @submit="handleSubmissionFormSubmit"
                    @cancel="showSubmissionForm = null" />
                </div>

                <!-- Previous Submissions -->
                <div
                  v-if="collaboration.submissions?.length"
                  class="mt-2 space-y-1">
                  <div
                    v-for="submission in collaboration.submissions"
                    :key="submission.id"
                    class="flex items-center justify-between py-1 text-sm">
                    <div class="flex items-center gap-2">
                      <span class="font-medium">{{
                        submission.candidateName
                      }}</span>
                      <span class="text-muted-foreground">·</span>
                      <span class="text-xs text-muted-foreground">
                        {{ formatDate(submission.createdAt) }}
                      </span>
                    </div>
                    <Badge
                      :variant="getSubmissionStatusVariant(submission.status)"
                      class="text-xs">
                      {{ submission.status }}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Posted Bounties List (Company/Recruiter view) -->
      <div
        v-if="activeTab === 'posted' && postedBounties.length"
        class="relative -mx-2 -mt-2">
        <ul class="divide-y divide-border">
          <li v-for="bounty in postedBounties" :key="bounty.id">
            <div class="flex flex-col">
              <div class="bg-muted/30 px-3 py-4">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <h3 class="text-base font-semibold">
                        {{ bounty.title }}
                      </h3>
                      <Badge
                        :variant="getBountyStatusVariant(bounty.status)"
                        size="sm">
                        {{ bounty.status }}
                      </Badge>
                    </div>
                    <p class="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {{ bounty.description }}
                    </p>
                    <div
                      class="flex items-center gap-3 text-xs text-muted-foreground">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span
                          >{{ bounty.collaborations?.length || 0 }} partnership
                          requests</span
                        >
                      </div>
                      <span>•</span>
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span
                          >{{ bounty.submissions?.length || 0 }} candidate
                          submissions</span
                        >
                      </div>
                      <span v-if="bounty.deadline">•</span>
                      <span v-if="bounty.deadline">
                        Deadline: {{ formatDate(bounty.deadline) }}
                      </span>
                    </div>
                  </div>
                  <Button
                    @click="
                      navigateTo(
                        `/author/${bounty.user.id}/bounty/${bounty.id}`
                      )
                    "
                    variant="ghost"
                    size="sm">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Button>
                </div>
              </div>

              <!-- Partnership Requests Section -->
              <div v-if="bounty.collaborations?.length" class="bg-background">
                <div class="px-4 py-2 bg-muted/20 border-t border-b">
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span class="text-sm font-medium text-muted-foreground"
                      >Partnership Requests ({{
                        bounty.collaborations.length
                      }})</span
                    >
                  </div>
                </div>
                <div class="px-4 py-2 space-y-2">
                  <div
                    v-for="collaboration in bounty.collaborations"
                    :key="collaboration.id"
                    @click="openPartnershipDialog({ ...collaboration, bounty })"
                    class="flex items-center justify-between py-3 px-3 text-sm border rounded-lg hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all group">
                    <div class="flex items-center gap-3 flex-1 min-w-0">
                      <Avatar class="h-10 w-10 ring-2 ring-background">
                        <AvatarImage
                          :src="collaboration.recruiter.user.image || ''"
                          :alt="collaboration.recruiter.user.name" />
                        <AvatarFallback>
                          {{ getInitials(collaboration.recruiter.user.name) }}
                        </AvatarFallback>
                      </Avatar>
                      <div class="flex flex-col flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="font-medium text-foreground">{{
                            collaboration.recruiter.user.name
                          }}</span>
                          <Badge
                            :variant="
                              getPartnershipStatusVariant(collaboration.status)
                            "
                            size="sm">
                            {{
                              getPartnershipStatusLabel(collaboration.status)
                            }}
                          </Badge>
                        </div>
                        <div
                          class="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                          <span>{{ collaboration.recruiter.user.email }}</span>
                          <span>•</span>
                          <span>{{ formatDate(collaboration.createdAt) }}</span>
                        </div>
                        <p
                          v-if="
                            collaboration.introduction || collaboration.message
                          "
                          class="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {{
                            collaboration.introduction || collaboration.message
                          }}
                        </p>
                      </div>
                    </div>
                    <svg
                      class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Candidate Submissions Section -->
              <div v-if="bounty.submissions?.length" class="bg-background">
                <div class="px-4 py-2 bg-muted/20 border-t border-b">
                  <div class="flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm font-medium text-muted-foreground"
                      >Candidate Submissions ({{
                        bounty.submissions.length
                      }})</span
                    >
                  </div>
                </div>
                <div class="px-4 py-2 space-y-2">
                  <div
                    v-for="submission in bounty.submissions"
                    :key="submission.id"
                    class="flex items-center justify-between py-3 px-3 text-sm border rounded-lg">
                    <div class="flex flex-col gap-1 flex-1">
                      <div class="flex items-center gap-2">
                        <span class="font-medium">{{
                          submission.candidateName
                        }}</span>
                        <Badge
                          :variant="
                            getSubmissionStatusVariant(submission.status)
                          "
                          size="sm">
                          {{ submission.status }}
                        </Badge>
                      </div>
                      <div
                        class="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{{ submission.candidateEmail }}</span>
                        <span>•</span>
                        <span>by {{ submission.recruiter.user.name }}</span>
                        <span>•</span>
                        <span>{{ formatDate(submission.createdAt) }}</span>
                      </div>
                    </div>
                    <div
                      v-if="submission.status === 'PENDING'"
                      class="flex gap-1"
                      @click.stop>
                      <Button
                        @click="reviewSubmission(submission.id, 'ACCEPTED')"
                        size="sm"
                        variant="outline">
                        Accept
                      </Button>
                      <Button
                        @click="reviewSubmission(submission.id, 'REJECTED')"
                        size="sm"
                        variant="destructive">
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Empty State -->
      <div
        v-if="
          (activeTab === 'applied' && !appliedBounties.length) ||
          (activeTab === 'posted' && !postedBounties.length) ||
          (!appliedBounties.length && !postedBounties.length)
        "
        class="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg">
        <svg
          class="w-8 h-8 text-muted-foreground mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M15 13l-3-3-3 3"></path>
        </svg>
        <p class="text-sm text-muted-foreground mb-4">
          {{
            activeTab === "applied"
              ? "No bounty applications yet"
              : activeTab === "posted"
              ? "No bounties posted yet"
              : "No bounties yet"
          }}
        </p>
        <div class="flex gap-2">
          <NuxtLink
            v-if="session.data?.user.userType === 'COMPANY'"
            to="/create">
            <Button size="sm">Post Your First Bounty</Button>
          </NuxtLink>
          <NuxtLink to="/bounties">
            <Button variant="outline" size="sm">Browse Bounties</Button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <PartnershipRequestDialog
      v-model:open="showPartnershipDialog"
      :collaboration="selectedCollaboration"
      @approve="handleApprovePartnership"
      @reject="handleRejectPartnership" />
  </div>
</template>

<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/vue-query";
import { useUserBountiesQuery } from "@/composables/useUserBountiesQuery";
import { toast } from "vue-sonner";

// Auth check
const session = authClient.useSession();
const queryClient = useQueryClient();

const enabled = computed(() => !!session.value?.data);

const { data: bountyData, isPending: pending } = useUserBountiesQuery(enabled);

// Extract data
const appliedBounties = computed(() => bountyData.value?.appliedBounties || []);
const postedBounties = computed(() => bountyData.value?.postedBounties || []);

// Tab state
const activeTab = ref("applied");

// Computed stats for applied bounties (recruiter perspective)
const unlockedCollaborations = computed(
  () => appliedBounties.value?.filter((c: any) => c.status === "APPROVED") || []
);

const pendingCollaborations = computed(
  () => appliedBounties.value?.filter((c: any) => c.status === "PENDING") || []
);

const totalSubmissions = computed(
  () =>
    appliedBounties.value?.reduce(
      (sum: number, c: any) => sum + (c.submissions?.length || 0),
      0
    ) || 0
);

// Computed stats for posted bounties
const totalPartnershipRequests = computed(
  () =>
    postedBounties.value?.reduce(
      (sum: number, b: any) => sum + (b.collaborations?.length || 0),
      0
    ) || 0
);

const pendingPartnershipRequests = computed(
  () =>
    postedBounties.value?.reduce(
      (sum: number, b: any) =>
        sum +
        (b.collaborations?.filter((c: any) => c.status === "PENDING").length ||
          0),
      0
    ) || 0
);

const totalCandidateSubmissions = computed(
  () =>
    postedBounties.value?.reduce(
      (sum: number, b: any) => sum + (b.submissions?.length || 0),
      0
    ) || 0
);

// Form state
const showSubmissionForm = ref<string | null>(null);
const isSubmitting = ref(false);

// Dialog state
const showPartnershipDialog = ref(false);
const selectedCollaboration = ref<any>(null);

// Helper functions
const getBountyStatusVariant = (status: string) => {
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

const getSubmissionStatusVariant = (status: string) => {
  switch (status) {
    case "PENDING":
      return "secondary";
    case "REVIEWED":
      return "default";
    case "ACCEPTED":
      return "default";
    case "REJECTED":
      return "destructive";
    default:
      return "secondary";
  }
};

const getPartnershipStatusVariant = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "default";
    case "REJECTED":
      return "destructive";
    case "PENDING":
    default:
      return "secondary";
  }
};

const getPartnershipStatusLabel = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    case "PENDING":
    default:
      return "Pending";
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

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Form functions
const toggleSubmissionForm = (collaborationId: string) => {
  showSubmissionForm.value =
    showSubmissionForm.value === collaborationId ? null : collaborationId;
};

const handleSubmissionFormSubmit = async (payload: {
  form: {
    candidateName: string;
    candidateEmail: string;
    notes: string;
    file: File | null;
    acknowledgeCompliance: boolean;
  };
  collaborationId?: string;
}) => {
  const { form, collaborationId } = payload;

  if (!form.candidateName || !form.file || !collaborationId) return;

  isSubmitting.value = true;

  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("candidateName", form.candidateName);
    formData.append("candidateEmail", form.candidateEmail || "");
    formData.append("notes", form.notes || "");
    formData.append("file", form.file);

    await $fetch(`/api/collaborations/${collaborationId}/submit`, {
      method: "POST",
      body: formData,
    });

    showSubmissionForm.value = null;
    await queryClient.invalidateQueries({ queryKey: ["user-bounties"] });
  } catch (error) {
    console.error("Failed to submit candidate:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Dialog functions
const openPartnershipDialog = (collaboration: any) => {
  selectedCollaboration.value = collaboration;
  showPartnershipDialog.value = true;
};

// Partnership management functions
const handleApprovePartnership = async (collaborationId: string) => {
  try {
    await $fetch(
      `/api/company/partnership-requests/${collaborationId}/approve`,
      {
        method: "POST",
      }
    );
    await queryClient.invalidateQueries({ queryKey: ["user-bounties"] });
    showPartnershipDialog.value = false;
    toast.success("Partnership approved", {
      description: "The recruiter can now submit candidates for your bounty.",
    });
  } catch (error) {
    console.error("Failed to approve partnership:", error);
    toast.error("Failed to approve partnership", {
      description: "Please try again later.",
    });
  }
};

const handleRejectPartnership = async (data: {
  collaborationId: string;
  reason?: string;
}) => {
  try {
    await $fetch(
      `/api/company/partnership-requests/${data.collaborationId}/reject`,
      {
        method: "POST",
        body: { reason: data.reason },
      }
    );
    await queryClient.invalidateQueries({ queryKey: ["user-bounties"] });
    showPartnershipDialog.value = false;
    toast.success("Partnership request rejected", {
      description: "The recruiter has been notified.",
    });
  } catch (error) {
    console.error("Failed to reject partnership:", error);
    toast.error("Failed to reject partnership", {
      description: "Please try again later.",
    });
  }
};

// Submission review functions
const reviewSubmission = async (submissionId: string, status: string) => {
  try {
    await $fetch(`/api/submissions/${submissionId}/review`, {
      method: "POST",
      body: { status },
    });
    await queryClient.invalidateQueries({ queryKey: ["user-bounties"] });
  } catch (error) {
    console.error("Failed to review submission:", error);
  }
};

// Set default tab based on user type and available data
watch(
  [bountyData, session],
  ([data, sessionData]) => {
    if (!data || !sessionData?.data) return;

    const userType = sessionData.data.user.userType;

    if (userType === "COMPANY") {
      activeTab.value = "posted";
    } else if (userType === "RECRUITER") {
      // Default to applied if available, otherwise posted
      if (data.appliedBounties?.length > 0) {
        activeTab.value = "applied";
      } else if (data.postedBounties?.length > 0) {
        activeTab.value = "posted";
      }
    }
  },
  { immediate: true }
);

// Redirect if not authenticated or invalid user type
watch(
  session,
  (sessionData) => {
    if (process.client && sessionData.data) {
      if (!sessionData.data.user.userType) {
        navigateTo("/onboarding");
      } else {
        const userType = sessionData.data.user.userType;
        if (!["RECRUITER", "COMPANY"].includes(userType)) {
          navigateTo("/bounties");
        }
      }
    } else if (process.client && !sessionData.data) {
      navigateTo("/sign-in");
    }
  },
  {
    deep: true,
  }
);
</script>
