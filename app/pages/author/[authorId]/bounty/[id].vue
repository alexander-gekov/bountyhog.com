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
      <p class="text-muted-foreground mb-6">
        The bounty you're looking for doesn't exist or has been removed.
      </p>
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
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <NuxtLink
              :to="`/author/${bounty.user.id}`"
              class="hover:text-foreground">
              {{ bounty.user.companyName }}
            </NuxtLink>
          </div>

          <div v-if="bounty.deadline" class="flex items-center gap-1">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Deadline: {{ formatDate(bounty.deadline) }}
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
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
          <template v-else> {{ bounty.payoutPercentage }}% </template>
        </div>
        <div class="text-sm text-muted-foreground">
          {{
            bounty.payoutType === "CASH"
              ? "Cash Bounty"
              : "Percentage of Salary"
          }}
        </div>
        <div class="text-sm text-muted-foreground">
          {{
            bounty.guaranteeTimeframe === "ONE_MONTH" ? "1 month" : "2 months"
          }}
          guarantee
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
            <p
              class="text-muted-foreground leading-relaxed whitespace-pre-line">
              {{ bounty.description }}
            </p>
          </CardContent>
        </Card>

        <!-- Requirements -->
        <Card v-if="requirements.length">
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-2">
              <li
                v-for="req in requirements"
                :key="req"
                class="flex items-start gap-2">
                <svg
                  class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"></path>
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
              <div
                v-for="note in bounty.notes"
                :key="note.id"
                class="border-l-2 border-muted pl-4">
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
                :disabled="!user" />
              <Button
                type="submit"
                :disabled="!newNote.trim() || !user"
                size="sm">
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

            <template v-else-if="user.userType === 'RECRUITER' && !isAuthor">
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
                      class="mt-1" />
                  </div>
                  <div class="flex gap-2">
                    <Button
                      @click="expressInterest"
                      :disabled="
                        isExpressingInterest || !introductionText.trim()
                      "
                      class="flex-1">
                      <template v-if="isExpressingInterest"
                        >Submitting...</template
                      >
                      <template v-else>Submit Application</template>
                    </Button>
                    <Button
                      @click="cancelInterest"
                      variant="outline"
                      :disabled="isExpressingInterest">
                      Cancel
                    </Button>
                  </div>
                </div>
              </template>

              <template v-else-if="collaboration?.status === 'PENDING'">
                <div class="text-center py-4">
                  <svg
                    class="w-12 h-12 text-amber-500 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-sm font-medium">Application Submitted</p>
                  <p class="text-xs text-muted-foreground mt-1">
                    Waiting for company approval to start working together
                  </p>
                </div>
              </template>

              <template v-else-if="collaboration?.status === 'REJECTED'">
                <div class="text-center py-4">
                  <svg
                    class="w-12 h-12 text-red-500 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <p class="text-sm font-medium">Application Declined</p>
                  <p class="text-xs text-muted-foreground mt-1">
                    {{
                      collaboration?.rejectionReason ||
                      "The company has declined your partnership request"
                    }}
                  </p>
                </div>
              </template>

              <template v-else>
                <div class="text-center py-4">
                  <svg
                    class="w-12 h-12 text-green-500 mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-sm font-medium">Unlocked for Submissions</p>
                  <p class="text-xs text-muted-foreground mt-1">
                    You can now submit candidates
                  </p>
                </div>
                <div class="space-y-3">
                  <div v-if="bounty.tallyFormUrl" class="space-y-3">
                    <div class="space-y-2">
                      <div
                        class="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <div
                          class="flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary font-semibold text-[10px]">
                          1
                        </div>
                        <span class="font-medium">Copy Password</span>
                      </div>
                      <div
                        v-if="bounty.tallyFormPassword"
                        class="relative flex items-center gap-1 bg-muted/50 rounded-md px-3 py-2 border group">
                        <span
                          class="flex-1 font-mono text-xs tracking-wide select-all truncate"
                          :class="
                            showPassword
                              ? 'text-foreground'
                              : 'text-muted-foreground'
                          ">
                          {{
                            showPassword
                              ? bounty.tallyFormPassword
                              : "•".repeat(bounty.tallyFormPassword.length)
                          }}
                        </span>
                        <button
                          @click="togglePasswordVisibility"
                          type="button"
                          class="p-1 hover:bg-muted rounded transition-colors">
                          <svg
                            v-if="showPassword"
                            class="w-3.5 h-3.5 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                          <svg
                            v-else
                            class="w-3.5 h-3.5 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          @click="copyPassword"
                          type="button"
                          class="p-1 hover:bg-muted rounded transition-colors">
                          <svg
                            v-if="passwordCopied"
                            class="w-3.5 h-3.5 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M5 13l4 4L19 7" />
                          </svg>
                          <svg
                            v-else
                            class="w-3.5 h-3.5 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <div
                        class="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <div
                          class="flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary font-semibold text-[10px]">
                          2
                        </div>
                        <span class="font-medium">Fill in Form</span>
                      </div>
                      <a
                        :href="bounty.tallyFormUrl"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Button class="w-full">
                          <svg
                            class="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Open Application Form
                        </Button>
                      </a>
                    </div>
                  </div>

                  <Button
                    v-else
                    class="w-full"
                    @click="showSubmissionForm = !showSubmissionForm">
                    {{ showSubmissionForm ? "Hide Form" : "Submit Candidate" }}
                  </Button>

                  <Button
                    class="w-full"
                    variant="outline"
                    @click="navigateTo('/my-bounties')">
                    Go to My Bounties
                  </Button>
                </div>
              </template>
            </template>

            <template v-else-if="isAuthor">
              <p class="text-sm text-muted-foreground">
                This is your company's bounty. You can manage collaborations and
                submissions.
              </p>
              <div class="flex flex-col gap-3">
                <a
                  v-if="bounty.tallyFormUrl"
                  :href="bounty.tallyFormUrl"
                  target="_blank"
                  rel="noopener noreferrer">
                  <Button class="w-full" variant="outline">
                    Preview Application Form
                  </Button>
                </a>
                <Button class="w-full" @click="navigateTo('/my-bounties')">
                  View Submissions
                </Button>
              </div>
            </template>

            <template v-else>
              <p class="text-sm text-muted-foreground">
                View this bounty's details and requirements.
              </p>
              <Button
                class="w-full"
                variant="outline"
                @click="navigateTo('/bounties')">
                Browse All Bounties
              </Button>
            </template>
          </CardContent>
        </Card>

        <!-- Submission Form (for approved recruiters) -->
        <div
          v-if="
            showSubmissionForm &&
            user?.userType === 'RECRUITER' &&
            collaboration?.status === 'APPROVED' &&
            bounty?.status === 'OPEN'
          ">
          <CandidateSubmissionForm
            :bounty="
              bounty
                ? {
                    id: bounty.id,
                    title: bounty.title,
                    requirements: bounty.requirements,
                    guidelines: bounty.guidelines,
                  }
                : undefined
            "
            :collaboration-id="collaboration?.id"
            :is-submitting="isSubmittingCandidate"
            :show-cancel="true"
            @submit="handleCandidateSubmission"
            @cancel="showSubmissionForm = false" />
        </div>

        <!-- Company Info -->
        <Card>
          <CardHeader>
            <CardTitle>About {{ bounty.user.companyName }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              v-if="bounty.user.description"
              class="text-sm text-muted-foreground mb-4">
              {{ bounty.user.bio }}
            </p>
            <NuxtLink :to="`/author/${bounty.user.id}`">
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
                class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  {{ collab.recruiter.user.name.charAt(0) }}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">
                    {{ collab.recruiter.user.name }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    <template v-if="collab.status === 'APPROVED'"
                      >Approved</template
                    >
                    <template v-else-if="collab.status === 'REJECTED'"
                      >Rejected</template
                    >
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
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/vue-query";
import { useBountyQuery } from "@/composables/useBountyQuery";

const route = useRoute();
const bountyId = route.params.id as string;
const queryClient = useQueryClient();

const session = authClient.useSession();
const user = computed(() => session.value?.data?.user);

const { data: bounty, isPending: pending, error } = useBountyQuery(bountyId);

const requirements = computed(() => {
  if (!bounty.value?.requirements) return [];
  try {
    return JSON.parse(bounty.value.requirements);
  } catch {
    return [];
  }
});

const collaboration = computed(() => {
  if (!user.value || !bounty.value?.collaborations) return null;
  return bounty.value.collaborations.find(
    (c: any) => c.recruiter.userId === user.value?.id
  );
});

const isCollaborating = computed(() => !!collaboration.value);

const isAuthor = computed(() => {
  return user.value && bounty.value && user.value.id === bounty.value.user.id;
});

const newNote = ref("");
const isExpressingInterest = ref(false);
const showInterestForm = ref(false);
const introductionText = ref("");
const showSubmissionForm = ref(false);
const isSubmittingCandidate = ref(false);
const showPassword = ref(false);
const passwordCopied = ref(false);

const expressInterest = async () => {
  if (!user.value || !introductionText.value.trim()) return;

  isExpressingInterest.value = true;
  try {
    await $fetch(`/api/bounties/${bountyId}/collaborate`, {
      method: "POST",
      body: {
        message: "I'm interested in working on this bounty.",
        introduction: introductionText.value.trim(),
      },
    });
    showInterestForm.value = false;
    introductionText.value = "";
    await queryClient.invalidateQueries({ queryKey: ["bounty", bountyId] });
  } catch (error) {
    console.error("Failed to express interest:", error);
  } finally {
    isExpressingInterest.value = false;
  }
};

const cancelInterest = () => {
  showInterestForm.value = false;
  introductionText.value = "";
};

const submitNote = async () => {
  if (!newNote.value.trim() || !user.value) return;

  try {
    await $fetch(`/api/bounties/${bountyId}/notes`, {
      method: "POST",
      body: {
        content: newNote.value.trim(),
      },
    });
    newNote.value = "";
    await queryClient.invalidateQueries({ queryKey: ["bounty", bountyId] });
  } catch (error) {
    console.error("Failed to submit note:", error);
  }
};

const handleCandidateSubmission = async (payload: {
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

  isSubmittingCandidate.value = true;

  try {
    const formData = new FormData();
    formData.append("candidateName", form.candidateName);
    formData.append("candidateEmail", form.candidateEmail || "");
    formData.append("notes", form.notes || "");
    formData.append("file", form.file);

    await $fetch(`/api/collaborations/${collaborationId}/submit`, {
      method: "POST",
      body: formData,
    });

    showSubmissionForm.value = false;
    await queryClient.invalidateQueries({ queryKey: ["bounty", bountyId] });
  } catch (error) {
    console.error("Failed to submit candidate:", error);
  } finally {
    isSubmittingCandidate.value = false;
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const copyPassword = async () => {
  if (!bounty.value?.tallyFormPassword) return;

  try {
    await navigator.clipboard.writeText(bounty.value.tallyFormPassword);
    passwordCopied.value = true;
    setTimeout(() => {
      passwordCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error("Failed to copy password:", error);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};
</script>
