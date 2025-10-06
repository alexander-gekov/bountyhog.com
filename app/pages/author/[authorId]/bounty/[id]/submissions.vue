<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="pending" class="animate-pulse space-y-6">
      <div class="h-8 bg-muted rounded w-3/4"></div>
      <div class="h-32 bg-muted rounded"></div>
    </div>

    <div v-else-if="error" class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Error Loading Submissions</h1>
      <p class="text-muted-foreground mb-6">
        {{ error.message || "Failed to load submissions" }}
      </p>
      <NuxtLink :to="`/author/${route.params.authorId}/bounty/${bountyId}`">
        <Button>Back to Bounty</Button>
      </NuxtLink>
    </div>

    <div v-else-if="data">
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-4">
          <NuxtLink
            :to="`/author/${route.params.authorId}/bounty/${bountyId}`"
            class="text-muted-foreground hover:text-foreground">
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7" />
            </svg>
          </NuxtLink>
          <h1 class="text-3xl font-bold tracking-tight">
            Submissions for {{ data.bountyTitle }}
          </h1>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex gap-2">
            <Button
              :variant="filter === 'all' ? 'default' : 'outline'"
              size="sm"
              @click="setFilter('all')">
              All ({{ data.totalNumberOfSubmissionsPerFilter?.all || 0 }})
            </Button>
            <Button
              :variant="filter === 'completed' ? 'default' : 'outline'"
              size="sm"
              @click="setFilter('completed')">
              Completed ({{
                data.totalNumberOfSubmissionsPerFilter?.completed || 0
              }})
            </Button>
            <Button
              :variant="filter === 'partial' ? 'default' : 'outline'"
              size="sm"
              @click="setFilter('partial')">
              Partial ({{
                data.totalNumberOfSubmissionsPerFilter?.partial || 0
              }})
            </Button>
          </div>
        </div>
      </div>

      <div
        v-if="data.submissions && data.submissions.length > 0"
        class="space-y-3">
        <Card
          v-for="submission in data.submissions"
          :key="submission.id"
          class="cursor-pointer hover:shadow-md transition-shadow"
          @click="openSubmissionDialog(submission)">
          <CardContent class="p-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Badge
                  :variant="submission.isCompleted ? 'default' : 'secondary'">
                  {{ submission.isCompleted ? "Completed" : "Partial" }}
                </Badge>
                <span class="text-sm text-muted-foreground">
                  Submitted {{ formatDate(submission.submittedAt) }}
                </span>
              </div>
              <svg
                class="w-5 h-5 text-muted-foreground"
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
          </CardContent>
        </Card>

        <div v-if="data.hasMore" class="flex justify-center pt-4">
          <Button @click="loadMore" :disabled="loadingMore">
            {{ loadingMore ? "Loading..." : "Load More" }}
          </Button>
        </div>
      </div>

      <Dialog v-model:open="isDialogOpen">
        <DialogContent class="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              <div class="flex items-center gap-3 mt-2">
                <Badge
                  :variant="
                    selectedSubmission?.isCompleted ? 'default' : 'secondary'
                  ">
                  {{
                    selectedSubmission?.isCompleted ? "Completed" : "Partial"
                  }}
                </Badge>
                <span class="text-sm">
                  Submitted
                  {{
                    selectedSubmission
                      ? formatDate(selectedSubmission.submittedAt)
                      : ""
                  }}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <div v-if="selectedSubmission" class="space-y-6 mt-4">
            <div
              v-if="
                data.payoutType === 'PERCENTAGE' &&
                data.payoutPercentage &&
                (data.salaryMin || data.salaryMax)
              "
              class="p-4 bg-muted/50 rounded-lg border">
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium"
                    >Yearly Gross Salary Range</span
                  >
                  <span class="text-sm font-semibold">
                    <template v-if="data.salaryMin && data.salaryMax">
                      ${{ formatNumber(data.salaryMin) }} - ${{
                        formatNumber(data.salaryMax)
                      }}
                    </template>
                    <template v-else-if="data.salaryMin">
                      From ${{ formatNumber(data.salaryMin) }}
                    </template>
                    <template v-else>
                      Up to ${{ formatNumber(data.salaryMax) }}
                    </template>
                  </span>
                </div>
                <div class="flex items-center justify-between text-primary">
                  <span class="text-sm font-medium"
                    >Potential Payout ({{ data.payoutPercentage }}%)</span
                  >
                  <span class="text-sm font-semibold">
                    <template v-if="data.salaryMin && data.salaryMax">
                      ${{
                        formatNumber(
                          (data.salaryMin * 12 * data.payoutPercentage) / 100
                        )
                      }}
                      - ${{
                        formatNumber(
                          (data.salaryMax * 12 * data.payoutPercentage) / 100
                        )
                      }}
                    </template>
                    <template v-else-if="data.salaryMin">
                      From ${{
                        formatNumber(
                          (data.salaryMin * 12 * data.payoutPercentage) / 100
                        )
                      }}
                    </template>
                    <template v-else>
                      Up to ${{
                        formatNumber(
                          (data.salaryMax! * 12 * data.payoutPercentage) / 100
                        )
                      }}
                    </template>
                  </span>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div
                v-for="response in selectedSubmission.responses"
                :key="response.questionId"
                class="border-l-2 border-muted pl-4">
                <div class="font-medium text-sm mb-2">
                  {{ getQuestionTitle(response.questionId) }}
                </div>
                <div class="text-sm text-muted-foreground">
                  <template v-if="Array.isArray(response.value)">
                    <div v-for="(val, idx) in response.value" :key="idx">
                      {{ val }}
                    </div>
                  </template>
                  <template v-else-if="isFileResponse(response.value)">
                    <a
                      :href="response.value"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-primary hover:underline flex items-center gap-1">
                      <svg
                        class="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View File
                    </a>
                  </template>
                  <template v-else>
                    {{ response.value || "No answer provided" }}
                  </template>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div v-else class="text-center py-16">
        <svg
          class="w-16 h-16 text-muted-foreground mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-xl font-semibold mb-2">No Submissions Yet</h2>
        <p class="text-muted-foreground">
          Submissions will appear here once recruiters start submitting
          candidates.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";

const route = useRoute();
const bountyId = route.params.id as string;

const session = authClient.useSession();
const user = computed(() => session.value?.data?.user);

const page = ref(1);
const filter = ref<"all" | "completed" | "partial">("all");
const loadingMore = ref(false);
const isDialogOpen = ref(false);
const selectedSubmission = ref<any>(null);

const { data, pending, error, refresh } = await useFetch(
  `/api/bounties/${bountyId}/submissions`,
  {
    query: {
      page,
      filter,
    },
    watch: [filter],
  }
);

const setFilter = (newFilter: "all" | "completed" | "partial") => {
  filter.value = newFilter;
  page.value = 1;
};

const openSubmissionDialog = (submission: any) => {
  selectedSubmission.value = submission;
  isDialogOpen.value = true;
};

const getQuestionTitle = (questionId: string) => {
  const question = data.value?.questions?.find((q: any) => q.id === questionId);
  return question?.title || "Question";
};

const isFileResponse = (value: any) => {
  return typeof value === "string" && value.startsWith("http");
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

const loadMore = async () => {
  loadingMore.value = true;
  page.value += 1;
  await refresh();
  loadingMore.value = false;
};

const formatNumber = (amount: number) => {
  return amount.toLocaleString();
};

if (!user.value) {
  navigateTo("/sign-in");
}
</script>
