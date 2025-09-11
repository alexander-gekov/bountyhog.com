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
      <div v-else class="flex flex-wrap gap-4 mb-6">
        <div class="flex items-center gap-6 w-full bg-muted/40 rounded-lg p-4">
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Total</p>
            <p class="text-lg font-medium">{{ collaborations?.length || 0 }}</p>
          </div>
          <div class="h-4 w-px bg-border"></div>
          <div class="flex items-center gap-3">
            <p class="text-sm text-muted-foreground">Unlocked</p>
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
            <p class="text-sm text-muted-foreground">Submissions</p>
            <p class="text-lg font-medium">{{ totalSubmissions }}</p>
          </div>
        </div>
      </div>

      <!-- Bounties List -->
      <div v-if="collaborations?.length" class="relative -mx-2 -mt-2">
        <ul class="divide-y divide-border">
          <li
            v-for="collaboration in collaborations"
            :key="collaboration.id"
            class="group">
            <div
              class="flex flex-col cursor-pointer"
              @click="navigateTo(`/company/bounty/${collaboration.bounty.id}`)">
              <div class="hover:bg-muted/50 transition-colors">
                <Bounty :bounty="collaboration.bounty">
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
                  class="mt-4 space-y-4">
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

                  <div class="flex items-center gap-2">
                    <Button
                      @click="submitCandidate(collaboration.id)"
                      size="sm"
                      :disabled="
                        isSubmitting ||
                        !submissionForm.candidateName ||
                        !submissionForm.file
                      ">
                      {{ isSubmitting ? "Submitting..." : "Submit" }}
                    </Button>
                  </div>
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

      <!-- Empty State -->
      <div
        v-else
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
          No bounty collaborations yet
        </p>
        <NuxtLink to="/bounties">
          <Button variant="outline" size="sm">Browse Bounties</Button>
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
  () => collaborations.value?.filter((c) => c.status === "APPROVED") || []
);

const pendingCollaborations = computed(
  () => collaborations.value?.filter((c) => c.status === "PENDING") || []
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
