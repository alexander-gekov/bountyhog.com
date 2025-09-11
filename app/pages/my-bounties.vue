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

    <!-- Non-Recruiter Check -->
    <div
      v-else-if="session.data?.user.userType !== 'RECRUITER'"
      class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Recruiter Access Only</h1>
      <p class="text-muted-foreground mb-6">
        This page is only accessible to recruiters.
      </p>
      <NuxtLink to="/bounties">
        <Button>Browse Bounties</Button>
      </NuxtLink>
    </div>

    <!-- Recruiter Dashboard -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">My Bounties</h1>
          <p class="text-muted-foreground mt-2">
            Manage your active bounty collaborations and submissions
          </p>
        </div>

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
                d="M12 4v16m8-8H4"></path>
            </svg>
            Find More Bounties
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

      <!-- Stats Cards -->
      <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-muted-foreground">
                  Total Collaborations
                </p>
                <p class="text-2xl font-bold">
                  {{ collaborations?.length || 0 }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-primary"
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-muted-foreground">
                  Unlocked
                </p>
                <p class="text-2xl font-bold">
                  {{ unlockedCollaborations.length }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-green-500"
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
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-muted-foreground">
                  Pending Approval
                </p>
                <p class="text-2xl font-bold">
                  {{ pendingCollaborations.length }}
                </p>
              </div>
              <div
                class="w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-amber-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-muted-foreground">
                  Total Submissions
                </p>
                <p class="text-2xl font-bold">{{ totalSubmissions }}</p>
              </div>
              <div
                class="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Bounties List -->
      <div v-if="collaborations?.length" class="space-y-6">
        <div
          v-for="collaboration in collaborations"
          :key="collaboration.id"
          class="border rounded-lg p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3
                  class="text-lg font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                  @click="
                    navigateTo(`/company/bounty/${collaboration.bounty.id}`)
                  ">
                  {{ collaboration.bounty.title }}
                </h3>
                <Badge
                  :variant="getPartnershipStatusVariant(collaboration.status)"
                  class="text-xs">
                  {{ getPartnershipStatusLabel(collaboration.status) }}
                </Badge>
                <Badge
                  :variant="getBountyStatusVariant(collaboration.bounty.status)"
                  class="text-xs">
                  {{ collaboration.bounty.status }}
                </Badge>
              </div>

              <p class="text-sm text-muted-foreground mb-3">
                {{ collaboration.bounty.description }}
              </p>

              <div
                class="flex items-center gap-4 text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  {{ collaboration.bounty.company.companyName }}
                </div>

                <div
                  v-if="collaboration.bounty.deadline"
                  class="flex items-center gap-1">
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ formatDate(collaboration.bounty.deadline) }}
                </div>

                <div class="flex items-center gap-1">
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  {{ collaboration.submissions?.length || 0 }} submissions
                </div>
              </div>
            </div>

            <div class="text-right">
              <div class="text-lg font-bold text-foreground">
                <template v-if="collaboration.bounty.payoutType === 'CASH'">
                  ${{ collaboration.bounty.payoutAmount?.toLocaleString() }}
                </template>
                <template v-else>
                  {{ collaboration.bounty.payoutPercentage }}%
                </template>
              </div>
              <div class="text-xs text-muted-foreground">
                {{
                  collaboration.bounty.payoutType === "CASH"
                    ? "Cash"
                    : "Percentage"
                }}
              </div>
            </div>
          </div>

          <!-- Rejection Reason (if rejected) -->
          <div v-if="collaboration.status === 'REJECTED'" class="mt-6 pt-6 border-t">
            <div class="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <div>
                  <h4 class="text-sm font-medium text-red-800 dark:text-red-200 mb-1">Partnership Request Declined</h4>
                  <p class="text-sm text-red-700 dark:text-red-300">
                    {{ collaboration.rejectionReason || 'The company declined your partnership request.' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Submission Section (only if approved) -->
          <div
            v-if="
              collaboration.status === 'APPROVED' && collaboration.bounty.status === 'OPEN'
            "
            class="mt-6 pt-6 border-t">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium">Submit Candidate</h4>
              <Button
                @click="toggleSubmissionForm(collaboration.id)"
                variant="outline"
                size="sm">
                {{
                  showSubmissionForm === collaboration.id
                    ? "Cancel"
                    : "New Submission"
                }}
              </Button>
            </div>

            <!-- Submission Form -->
            <div
              v-if="showSubmissionForm === collaboration.id"
              class="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label for="candidateName">Candidate Name *</Label>
                  <Input
                    id="candidateName"
                    v-model="submissionForm.candidateName"
                    placeholder="John Doe"
                    required />
                </div>
                <div>
                  <Label for="candidateEmail">Candidate Email</Label>
                  <Input
                    id="candidateEmail"
                    v-model="submissionForm.candidateEmail"
                    type="email"
                    placeholder="john@example.com" />
                </div>
              </div>

              <div>
                <Label for="notes">Notes</Label>
                <Textarea
                  id="notes"
                  v-model="submissionForm.notes"
                  placeholder="Additional information about the candidate..."
                  rows="3" />
              </div>

              <div>
                <Label for="cv">CV/Resume *</Label>
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  @change="handleFileUpload"
                  required />
                <p class="text-xs text-muted-foreground mt-1">
                  Upload PDF, DOC, or DOCX files only
                </p>
              </div>

              <div class="flex items-center gap-4">
                <Button
                  @click="submitCandidate(collaboration.id)"
                  :disabled="
                    isSubmitting ||
                    !submissionForm.candidateName ||
                    !submissionForm.file
                  ">
                  {{ isSubmitting ? "Submitting..." : "Submit Candidate" }}
                </Button>
                <Button
                  @click="cancelSubmission"
                  variant="outline"
                  type="button">
                  Cancel
                </Button>
              </div>
            </div>

            <!-- Previous Submissions -->
            <div v-if="collaboration.submissions?.length" class="mt-4">
              <h5 class="text-sm font-medium mb-2">Previous Submissions</h5>
              <div class="space-y-2">
                <div
                  v-for="submission in collaboration.submissions"
                  :key="submission.id"
                  class="flex items-center justify-between p-3 bg-muted/30 rounded">
                  <div>
                    <p class="text-sm font-medium">
                      {{ submission.candidateName }}
                    </p>
                    <p class="text-xs text-muted-foreground">
                      Submitted {{ formatDate(submission.createdAt) }}
                    </p>
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
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M15 13l-3-3-3 3"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">No bounty collaborations</h3>
        <p class="text-muted-foreground mb-6">
          You haven't expressed interest in any bounties yet. Start exploring
          opportunities!
        </p>
        <NuxtLink to="/bounties">
          <Button>Browse Bounties</Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";

// Auth check
const session = authClient.useSession();

// Fetch collaborations
const {
  data: collaborations,
  pending,
  refresh,
} = await useFetch("/api/recruiter/collaborations", {
  server: false,
  default: () => [],
});

// Computed stats
const unlockedCollaborations = computed(
  () => collaborations.value?.filter((c) => c.status === 'APPROVED') || []
);

const pendingCollaborations = computed(
  () => collaborations.value?.filter((c) => c.status === 'PENDING') || []
);

const totalSubmissions = computed(
  () =>
    collaborations.value?.reduce(
      (sum, c) => sum + (c.submissions?.length || 0),
      0
    ) || 0
);

// Form state
const showSubmissionForm = ref<string | null>(null);
const isSubmitting = ref(false);
const submissionForm = ref({
  candidateName: "",
  candidateEmail: "",
  notes: "",
  file: null as File | null,
});

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

// Form functions
const toggleSubmissionForm = (collaborationId: string) => {
  showSubmissionForm.value =
    showSubmissionForm.value === collaborationId ? null : collaborationId;
  if (showSubmissionForm.value === null) {
    resetForm();
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    submissionForm.value.file = target.files[0];
  }
};

const submitCandidate = async (collaborationId: string) => {
  if (!submissionForm.value.candidateName || !submissionForm.value.file) return;

  isSubmitting.value = true;

  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("candidateName", submissionForm.value.candidateName);
    formData.append(
      "candidateEmail",
      submissionForm.value.candidateEmail || ""
    );
    formData.append("notes", submissionForm.value.notes || "");
    formData.append("file", submissionForm.value.file);

    await $fetch(`/api/collaborations/${collaborationId}/submit`, {
      method: "POST",
      body: formData,
    });

    resetForm();
    showSubmissionForm.value = null;
    await refresh();
  } catch (error) {
    console.error("Failed to submit candidate:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const cancelSubmission = () => {
  resetForm();
  showSubmissionForm.value = null;
};

const resetForm = () => {
  submissionForm.value = {
    candidateName: "",
    candidateEmail: "",
    notes: "",
    file: null,
  };
};

// Redirect if not authenticated or not a recruiter
watch(
  session,
  (sessionData) => {
    if (
      process.client &&
      sessionData.data &&
      sessionData.data.user.userType !== "RECRUITER"
    ) {
      navigateTo("/bounties");
    } else if (process.client && !sessionData.data) {
      navigateTo("/sign-in");
    }
  },
  { immediate: true }
);
</script>
