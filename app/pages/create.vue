<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Auth Check -->
    <div v-if="!session.data" class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Authentication Required</h1>
      <p class="text-muted-foreground mb-6">
        You need to sign in to create a bounty.
      </p>
      <NuxtLink to="/sign-in">
        <Button>Sign In</Button>
      </NuxtLink>
    </div>

    <!-- Create Bounty Form -->
    <div v-else class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold">Create Bounty</h1>
        <p class="text-muted-foreground mt-2">
          Post a new recruitment bounty to find the perfect candidate
        </p>
      </div>

      <form class="space-y-8">
        <!-- Basic Information -->
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the essential details about the role you're hiring for
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div>
              <Label for="title">Job Title *</Label>
              <Input
                id="title"
                v-model:model-value="form.title"
                placeholder="Senior Full Stack Developer"
                required />
            </div>

            <div>
              <Label for="description">Job Description *</Label>
              <Textarea
                id="description"
                v-model:model-value="form.description"
                placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                rows="6"
                required />
            </div>

            <!-- <div>
              <Label for="picture">Bounty Picture (Optional)</Label>
              <div class="">
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  @change="handlePictureUpload"
                  class="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80" />
                <p class="text-sm text-muted-foreground">
                  Upload an image to represent your bounty (max 5MB)
                </p>
              </div>
              <div v-if="form.picturePreview" class="mt-4">
                <img
                  :src="form.picturePreview"
                  alt="Bounty picture preview"
                  class="w-32 h-32 object-cover rounded-lg border" />
                <Button
                  @click="removePicture"
                  type="button"
                  variant="outline"
                  size="sm"
                  class="mt-2">
                  Remove Picture
                </Button>
              </div>
            </div> -->

            <div>
              <Label>Salary Range (Monthly Gross) *</Label>
              <div class="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <NumberField
                    id="salaryMin"
                    v-model:model-value="form.salaryMin"
                    :min="0"
                    :step="100"
                    :default-value="3000"
                    :format-options="{
                      style: 'currency',
                      currency: 'BGN',
                      currencyDisplay: 'symbol',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }">
                    <Label for="salaryMin" class="text-sm text-muted-foreground"
                      >Minimum</Label
                    >
                    <NumberFieldContent>
                      <NumberFieldDecrement />
                      <NumberFieldInput />
                      <NumberFieldIncrement />
                    </NumberFieldContent>
                  </NumberField>
                </div>
                <div>
                  <NumberField
                    id="salaryMax"
                    v-model:model-value="form.salaryMax"
                    :min="0"
                    :step="100"
                    :default-value="5000"
                    :format-options="{
                      style: 'currency',
                      currency: 'BGN',
                      currencyDisplay: 'symbol',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }">
                    <Label for="salaryMax" class="text-sm text-muted-foreground"
                      >Maximum</Label
                    >
                    <NumberFieldContent>
                      <NumberFieldDecrement />
                      <NumberFieldInput />
                      <NumberFieldIncrement />
                    </NumberFieldContent>
                  </NumberField>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label for="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  v-model:model-value="form.deadline"
                  type="date"
                  :min="minDate" />
              </div>

              <div>
                <Label for="guaranteeTimeframe">Guarantee Timeframe *</Label>
                <Select v-model:model-value="form.guaranteeTimeframe" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONE_MONTH">1 Month</SelectItem>
                    <SelectItem value="TWO_MONTHS">2 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Payout Information -->
        <Card>
          <CardHeader>
            <CardTitle>Payout Information</CardTitle>
            <CardDescription>
              Define how recruiters will be compensated for successful hires
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div>
              <Label>Payout Type *</Label>
              <RadioGroup v-model:model-value="form.payoutType" class="mt-2">
                <div class="flex items-center space-x-6">
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="cash" value="CASH" />
                    <Label for="cash" class="text-sm font-normal"
                      >Fixed Cash Amount</Label
                    >
                  </div>
                  <div class="flex items-center space-x-2">
                    <RadioGroupItem id="percentage" value="PERCENTAGE" />
                    <Label for="percentage" class="text-sm font-normal"
                      >Percentage of Salary</Label
                    >
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div v-if="form.payoutType === 'CASH'">
              <NumberField
                id="payoutAmount"
                v-model:model-value="form.payoutAmount"
                :min="100"
                :step="100"
                :default-value="5000"
                :format-options="{
                  style: 'currency',
                  currency: 'USD',
                  currencyDisplay: 'symbol',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }">
                <Label for="payoutAmount">Cash Amount (USD) *</Label>
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
            </div>

            <div v-if="form.payoutType === 'PERCENTAGE'">
              <NumberField
                id="payoutPercentage"
                v-model:model-value="form.payoutPercentage"
                :min="5"
                :max="50"
                :step="0.5"
                :default-value="15"
                :format-options="{
                  style: 'unit',
                  unit: 'percent',
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }">
                <Label for="payoutPercentage"
                  >Percentage of Annual Salary *</Label
                >
                <NumberFieldContent>
                  <NumberFieldDecrement />
                  <NumberFieldInput />
                  <NumberFieldIncrement />
                </NumberFieldContent>
              </NumberField>
            </div>
          </CardContent>
        </Card>

        <!-- Application Form Builder -->
        <Card>
          <CardHeader>
            <CardTitle>Application Form Fields</CardTitle>
            <CardDescription>
              Define the fields that candidates need to fill when applying for
              this role
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div
              v-for="(field, index) in form.formFields"
              :key="field.id"
              class="p-4 border rounded-lg space-y-4 bg-muted/20">
              <div class="flex items-start justify-between gap-4">
                <div class="flex-1 space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label :for="`field-label-${index}`">Field Label *</Label>
                      <Input
                        :id="`field-label-${index}`"
                        v-model:model-value="field.label"
                        placeholder="e.g., Years of Experience"
                        class="mt-1" />
                    </div>

                    <div>
                      <Label :for="`field-type-${index}`">Field Type *</Label>
                      <Select v-model:model-value="field.type" class="mt-1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INPUT_TEXT">Short Text</SelectItem>
                          <SelectItem value="TEXTAREA">Long Text</SelectItem>
                          <SelectItem value="FILE_UPLOAD"
                            >File Upload</SelectItem
                          >
                          <SelectItem value="CHECKBOXES">Checkboxes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label :for="`field-placeholder-${index}`"
                      >Placeholder/Help Text</Label
                    >
                    <Input
                      :id="`field-placeholder-${index}`"
                      v-model:model-value="field.placeholder"
                      placeholder="e.g., Enter your total years of professional experience"
                      class="mt-1" />
                  </div>

                  <div v-if="field.type === 'CHECKBOXES'" class="space-y-2">
                    <Label>Options (one per line) *</Label>
                    <Textarea
                      v-model:model-value="field.options"
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      rows="3"
                      class="mt-1 font-mono text-sm" />
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="flex items-center space-x-2">
                      <Checkbox
                        :id="`field-required-${index}`"
                        v-model:model-value="field.required"
                        :default-checked="true" />
                      <Label
                        :for="`field-required-${index}`"
                        class="text-sm font-normal cursor-pointer">
                        Required field
                      </Label>
                    </div>

                    <div
                      v-if="field.type === 'FILE_UPLOAD'"
                      class="flex items-center space-x-2">
                      <Checkbox
                        :id="`field-multiple-${index}`"
                        v-model:checked="field.multiple" />
                      <Label
                        :for="`field-multiple-${index}`"
                        class="text-sm font-normal cursor-pointer">
                        Allow multiple files
                      </Label>
                    </div>
                  </div>
                </div>

                <Button
                  @click="removeFormField(index)"
                  type="button"
                  variant="ghost"
                  size="sm"
                  class="mt-6">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </Button>
              </div>
            </div>

            <Button
              @click="addFormField"
              type="button"
              variant="outline"
              size="sm"
              class="w-full">
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
              Add Form Field
            </Button>

            <div
              v-if="form.formFields.length === 0"
              class="text-center py-8 text-muted-foreground text-sm">
              No custom fields added. Default fields (Name, Email, Resume) will
              be included automatically.
            </div>
          </CardContent>
        </Card>

        <!-- Submit -->
        <div class="flex items-center justify-end gap-4 pt-6">
          <NuxtLink to="/bounties">
            <Button type="button" variant="outline"> Cancel </Button>
          </NuxtLink>
          <Button
            @click="submitBounty"
            :disabled="isSubmitting || !isFormValid"
            class="min-w-[120px]">
            {{ isSubmitting ? "Creating..." : "Create Bounty" }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/vue-query";

// Auth check
const session = authClient.useSession();
const queryClient = useQueryClient();

const enabled = computed(() => !!session.value?.data);

interface FormField {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  required: boolean;
  options: string;
  multiple: boolean;
}

// Form state
const isSubmitting = ref(false);
const form = ref({
  title: "",
  description: "",
  deadline: "",
  guaranteeTimeframe: "",
  payoutType: "CASH",
  payoutAmount: 5000 as number | null,
  payoutPercentage: 8 as number | null,
  salaryMin: 3000 as number | null,
  salaryMax: 5000 as number | null,
  formFields: [] as FormField[],
  picture: null as File | null,
  picturePreview: "" as string,
});

// Computed
const minDate = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
});

const isFormValid = computed(() => {
  const basicValid =
    form.value.title &&
    form.value.description &&
    form.value.guaranteeTimeframe &&
    form.value.payoutType &&
    form.value.salaryMin !== null &&
    form.value.salaryMax !== null &&
    form.value.salaryMin > 0 &&
    form.value.salaryMax > 0 &&
    form.value.salaryMax >= form.value.salaryMin;

  const payoutValid =
    form.value.payoutType === "CASH"
      ? form.value.payoutAmount && form.value.payoutAmount > 0
      : form.value.payoutPercentage && form.value.payoutPercentage > 0;

  return basicValid && payoutValid;
});

// Methods
const addFormField = () => {
  form.value.formFields.push({
    id: `field-${Date.now()}-${Math.random()}`,
    label: "",
    type: "TEXTAREA",
    placeholder: "",
    required: true,
    options: "",
    multiple: false,
  });
};

const removeFormField = (index: number) => {
  form.value.formFields.splice(index, 1);
};

const submitBounty = async () => {
  if (!isFormValid.value || isSubmitting.value) return;

  isSubmitting.value = true;

  try {
    // Create FormData for file upload
    const formData = new FormData();

    // Add all the bounty data
    const bountyData = {
      title: form.value.title,
      description: form.value.description,
      deadline: form.value.deadline || null,
      guaranteeTimeframe: form.value.guaranteeTimeframe,
      payoutType: form.value.payoutType,
      payoutAmount:
        form.value.payoutType === "CASH" ? form.value.payoutAmount : null,
      payoutPercentage:
        form.value.payoutType === "PERCENTAGE"
          ? form.value.payoutPercentage
          : null,
      salaryMin: form.value.salaryMin,
      salaryMax: form.value.salaryMax,
      formFields: form.value.formFields.map((field) => ({
        id: field.id,
        label: field.label,
        type: field.type,
        placeholder: field.placeholder || "",
        required: field.required,
        options: field.options
          ? field.options.split("\n").filter((opt) => opt.trim())
          : [],
        multiple: field.multiple,
      })),
      createTallyForm: form.value.formFields.length > 0,
      // Company data (only if creating new company)
      company: null,
    };

    // Add JSON data to FormData
    formData.append("data", JSON.stringify(bountyData));

    // Add picture file if exists
    if (form.value.picture) {
      formData.append("picture", form.value.picture);
    }

    const response = await $fetch("/api/bounties", {
      method: "POST",
      body: formData,
    });

    // Invalidate queries to refetch data
    await queryClient.invalidateQueries({ queryKey: ["bounties"] });
    await queryClient.invalidateQueries({ queryKey: ["user-bounties"] });

    // Redirect to the newly created bounty
    await navigateTo(
      `/author/${session.value?.data?.user.id}/bounty/${response.id}`
    );
  } catch (error) {
    console.error("Failed to create bounty:", error);
    // TODO: Show error message to user
  } finally {
    isSubmitting.value = false;
  }
};
</script>
