<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Partnership Request</DialogTitle>
        <DialogDescription>
          Review the recruiter's request to work on your bounty
        </DialogDescription>
      </DialogHeader>

      <div v-if="collaboration" class="space-y-6">
        <div class="bg-muted/50 rounded-lg p-4 border">
          <div class="flex items-start gap-3">
            <div
              class="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <svg
                class="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 6V9a2 2 0 00-2-2H10a2 2 0 00-2 2v3.1M15 13l-3-3-3 3" />
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-base mb-1">
                {{ collaboration.bounty?.title || "Untitled Bounty" }}
              </h3>
              <p class="text-sm text-muted-foreground line-clamp-2">
                {{
                  collaboration.bounty?.description ||
                  "No description available"
                }}
              </p>
            </div>
          </div>
        </div>

        <Separator />
        <div class="space-y-4">
          <div class="flex items-start gap-4">
            <Avatar class="h-12 w-12">
              <AvatarImage
                :src="collaboration.recruiter.user.image || ''"
                :alt="collaboration.recruiter.user.name" />
              <AvatarFallback>
                {{ getInitials(collaboration.recruiter.user.name) }}
              </AvatarFallback>
            </Avatar>
            <div class="flex-1">
              <h3 class="font-semibold text-lg">
                {{ collaboration.recruiter.user.name }}
              </h3>
              <p class="text-sm text-muted-foreground">
                {{ collaboration.recruiter.user.email }}
              </p>
              <div v-if="collaboration.recruiter.user.linkedinUrl" class="mt-2">
                <a
                  :href="collaboration.recruiter.user.linkedinUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-primary hover:underline inline-flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn Profile
                </a>
              </div>
            </div>
            <Badge
              :variant="getStatusVariant(collaboration.status)"
              class="ml-auto">
              {{ collaboration.status }}
            </Badge>
          </div>

          <Separator />

          <div v-if="collaboration.recruiter.bio" class="space-y-2">
            <h4 class="text-sm font-medium">About</h4>
            <p class="text-sm text-muted-foreground">
              {{ collaboration.recruiter.bio }}
            </p>
          </div>

          <div v-if="collaboration.recruiter.experience" class="space-y-2">
            <h4 class="text-sm font-medium">Experience</h4>
            <p class="text-sm text-muted-foreground">
              {{ collaboration.recruiter.experience }}
            </p>
          </div>

          <div v-if="collaboration.recruiter.specialties" class="space-y-2">
            <h4 class="text-sm font-medium">Specialties</h4>
            <p class="text-sm text-muted-foreground">
              {{ collaboration.recruiter.specialties }}
            </p>
          </div>

          <Separator />

          <div class="space-y-2">
            <h4 class="text-sm font-medium">Introduction Message</h4>
            <div class="bg-muted/50 rounded-lg p-4">
              <p class="text-sm whitespace-pre-wrap">
                {{
                  collaboration.introduction ||
                  collaboration.message ||
                  "No message provided"
                }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Requested {{ formatDate(collaboration.createdAt) }}</span>
          </div>
        </div>

        <div v-if="collaboration.status === 'PENDING'" class="space-y-4">
          <Separator />

          <div v-if="showRejectForm" class="space-y-3">
            <Label for="rejection-reason">Rejection Reason (Optional)</Label>
            <Textarea
              id="rejection-reason"
              v-model="rejectionReason"
              placeholder="Provide a reason for rejecting this partnership request..."
              rows="3" />
          </div>

          <div class="flex gap-2 justify-end">
            <Button
              v-if="showRejectForm"
              @click="showRejectForm = false"
              variant="ghost"
              :disabled="isProcessing">
              Cancel
            </Button>
            <Button
              v-else
              @click="showRejectForm = true"
              variant="destructive"
              :disabled="isProcessing">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reject
            </Button>
            <Button
              v-if="showRejectForm"
              @click="handleReject"
              variant="destructive"
              :disabled="isProcessing">
              {{ isProcessing ? "Rejecting..." : "Confirm Rejection" }}
            </Button>
            <Button v-else @click="handleApprove" :disabled="isProcessing">
              <svg
                class="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7" />
              </svg>
              {{ isProcessing ? "Approving..." : "Approve Partnership" }}
            </Button>
          </div>
        </div>

        <div v-else-if="collaboration.status === 'REJECTED'" class="space-y-3">
          <Separator />
          <div
            class="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <h4 class="text-sm font-medium text-destructive mb-2">
              Rejection Reason
            </h4>
            <p class="text-sm text-destructive-foreground">
              {{ collaboration.rejectionReason || "No reason provided" }}
            </p>
          </div>
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Reviewed {{ formatDate(collaboration.reviewedAt!) }}</span>
          </div>
        </div>

        <div v-else-if="collaboration.status === 'APPROVED'" class="space-y-3">
          <Separator />
          <div class="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <h4 class="text-sm font-medium text-primary mb-2">
              Partnership Approved
            </h4>
            <p class="text-sm text-primary-foreground">
              This recruiter can now submit candidates for your bounty.
            </p>
          </div>
          <div class="flex items-center gap-2 text-xs text-muted-foreground">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Approved {{ formatDate(collaboration.reviewedAt!) }}</span>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
interface Collaboration {
  id: string;
  status: string;
  message?: string;
  introduction?: string;
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
  bounty?: {
    id: string;
    title: string;
    description: string;
  };
  recruiter: {
    id: string;
    bio?: string;
    experience?: string;
    specialties?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      linkedinUrl?: string;
    };
  };
}

interface Props {
  open: boolean;
  collaboration: Collaboration | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  approve: [collaborationId: string];
  reject: [data: { collaborationId: string; reason?: string }];
}>();

const showRejectForm = ref(false);
const rejectionReason = ref("");
const isProcessing = ref(false);

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getStatusVariant = (status: string) => {
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffTime / (1000 * 60));

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

const handleApprove = async () => {
  if (!props.collaboration) return;

  isProcessing.value = true;
  emit("approve", props.collaboration.id);

  setTimeout(() => {
    isProcessing.value = false;
  }, 2000);
};

const handleReject = async () => {
  if (!props.collaboration) return;

  isProcessing.value = true;
  emit("reject", {
    collaborationId: props.collaboration.id,
    reason: rejectionReason.value,
  });

  setTimeout(() => {
    isProcessing.value = false;
    showRejectForm.value = false;
    rejectionReason.value = "";
  }, 2000);
};

watch(
  () => props.open,
  (newVal) => {
    if (!newVal) {
      showRejectForm.value = false;
      rejectionReason.value = "";
      isProcessing.value = false;
    }
  }
);
</script>
