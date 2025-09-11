<template>
  <Card class="w-full">
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <svg
          class="w-5 h-5 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"></path>
        </svg>
        Submit Candidate
      </CardTitle>
      <CardDescription>
        Submit a qualified candidate for this bounty
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <!-- Candidate Information -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-foreground">
            Candidate Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label for="candidateName" class="text-sm font-medium">
                Full Name <span class="text-destructive">*</span>
              </Label>
              <Input
                id="candidateName"
                v-model="form.candidateName"
                placeholder="John Doe"
                required
                class="h-10" />
            </div>
            <div class="space-y-2">
              <Label for="candidateEmail" class="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="candidateEmail"
                v-model="form.candidateEmail"
                type="email"
                placeholder="john@example.com"
                class="h-10" />
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-foreground">
            Additional Information
          </h3>
          <div class="space-y-2">
            <Label for="notes" class="text-sm font-medium">
              Notes & Comments
            </Label>
            <Textarea
              id="notes"
              v-model="form.notes"
              placeholder="Why is this candidate a great fit? Include relevant experience, skills, or achievements..."
              rows="4"
              class="resize-none" />
          </div>
        </div>

        <!-- CV Upload -->
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-foreground">Resume/CV</h3>
          <div class="space-y-2">
            <Label for="cv" class="text-sm font-medium">
              Upload Resume <span class="text-destructive">*</span>
            </Label>
            <div class="relative">
              <Input
                id="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                @change="handleFileUpload"
                required
                class="h-10 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80" />
            </div>
            <p class="text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX (max 10MB)
            </p>
          </div>
        </div>

        <!-- Bounty Requirements Summary (if available) -->
        <div
          v-if="bounty?.requirements && parsedRequirements.length"
          class="space-y-4">
          <h3 class="text-sm font-medium text-foreground">
            Bounty Requirements
          </h3>
          <div class="bg-muted/30 rounded-lg p-4 space-y-2">
            <ul class="space-y-1">
              <li
                v-for="req in parsedRequirements.slice(0, 3)"
                :key="req"
                class="flex items-start gap-2 text-sm">
                <svg
                  class="w-3 h-3 text-green-600 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-muted-foreground">{{ req }}</span>
              </li>
            </ul>
            <p
              v-if="parsedRequirements.length > 3"
              class="text-xs text-muted-foreground italic">
              +{{ parsedRequirements.length - 3 }} more requirements
            </p>
          </div>
        </div>

        <!-- Guidelines Warning -->
        <div
          v-if="bounty?.guidelines"
          class="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div class="space-y-2">
              <h4 class="text-sm font-medium text-amber-800 dark:text-amber-200">
                Submission Guidelines
              </h4>
              <p class="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                {{ bounty.guidelines }}
              </p>
            </div>
          </div>
        </div>

        <!-- Compliance Checkbox -->
        <div class="space-y-4">
          <div class="flex items-start space-x-3 p-4 bg-muted/30 rounded-lg">
            <Checkbox
              id="compliance"
              v-model:checked="form.acknowledgeCompliance"
              class="mt-1" />
            <div class="space-y-1">
              <Label
                for="compliance"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I understand the submission requirements
              </Label>
              <p class="text-xs text-muted-foreground leading-relaxed">
                I understand that if I send candidates that strictly don't match
                the guidelines set by the author I risk losing approval to submit
                more candidates.
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-between pt-4 border-t">
          <Button
            v-if="showCancel"
            type="button"
            variant="outline"
            @click="onCancel"
            :disabled="isSubmitting">
            Cancel
          </Button>
          <div v-else></div>
          <Button
            type="submit"
            :disabled="!isFormValid || isSubmitting"
            class="min-w-[120px]">
            <template v-if="isSubmitting">
              <svg
                class="w-4 h-4 mr-2 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Submitting...
            </template>
            <template v-else>Submit Candidate</template>
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
interface Bounty {
  id: string
  title: string
  requirements?: string | null
  guidelines?: string | null
}

interface SubmissionForm {
  candidateName: string
  candidateEmail: string
  notes: string
  file: File | null
  acknowledgeCompliance: boolean
}

interface Props {
  bounty?: Bounty
  collaborationId?: string
  isSubmitting?: boolean
  showCancel?: boolean
}

interface Emits {
  (e: 'submit', payload: { form: SubmissionForm; collaborationId?: string }): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
  showCancel: true
})

const emit = defineEmits<Emits>()

// Form state
const form = ref<SubmissionForm>({
  candidateName: '',
  candidateEmail: '',
  notes: '',
  file: null,
  acknowledgeCompliance: false
})

// Parse requirements
const parsedRequirements = computed(() => {
  if (!props.bounty?.requirements) return []
  try {
    return JSON.parse(props.bounty.requirements)
  } catch {
    return []
  }
})

// Form validation
const isFormValid = computed(() => {
  return (
    form.value.candidateName.trim() &&
    form.value.file &&
    form.value.acknowledgeCompliance
  )
})

// File upload handler
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      // Reset the input
      target.value = ''
      // You might want to show a toast notification here
      console.error('File size must be less than 10MB')
      return
    }
    form.value.file = file
  }
}

// Submit handler
const onSubmit = () => {
  if (!isFormValid.value) return
  
  emit('submit', {
    form: form.value,
    collaborationId: props.collaborationId
  })
}

// Cancel handler
const onCancel = () => {
  resetForm()
  emit('cancel')
}

// Reset form
const resetForm = () => {
  form.value = {
    candidateName: '',
    candidateEmail: '',
    notes: '',
    file: null,
    acknowledgeCompliance: false
  }
  
  // Reset file input
  const fileInput = document.getElementById('cv') as HTMLInputElement
  if (fileInput) {
    fileInput.value = ''
  }
}

// Expose resetForm for parent components
defineExpose({
  resetForm
})
</script>
