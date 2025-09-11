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

      <form @submit.prevent="submitBounty" class="space-y-8">
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

            <div>
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

        <!-- Requirements -->
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>
              List the key requirements and qualifications for this role
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div
              v-for="(requirement, index) in form.requirements"
              :key="index"
              class="flex items-center gap-2">
              <Input
                v-model:model-value="form.requirements[index]"
                placeholder="e.g., 5+ years of React experience"
                class="flex-1" />
              <Button
                @click="removeRequirement(index)"
                type="button"
                variant="outline"
                size="sm"
                :disabled="form.requirements.length <= 1">
                Remove
              </Button>
            </div>

            <Button
              @click="addRequirement"
              type="button"
              variant="outline"
              size="sm">
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
              Add Requirement
            </Button>
          </CardContent>
        </Card>

        <!-- Process & Guidelines -->
        <Card>
          <CardHeader>
            <CardTitle>Process & Guidelines</CardTitle>
            <CardDescription>
              Provide additional context about the hiring process and
              expectations
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div>
              <Label for="interviewProcess">Interview Process</Label>
              <Textarea
                id="interviewProcess"
                v-model:model-value="form.interviewProcess"
                placeholder="Describe your interview process (e.g., 3 rounds: Technical screening, System design, Cultural fit)"
                rows="3" />
            </div>

            <div>
              <Label for="guidelines">Guidelines for Recruiters</Label>
              <Textarea
                id="guidelines"
                v-model:model-value="form.guidelines"
                placeholder="Any specific guidelines, preferences, or instructions for recruiters working on this bounty"
                rows="3" />
            </div>
          </CardContent>
        </Card>

        <!-- Company Information (for new companies) -->
        <Card v-if="!userCompany">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>
              Since this is your first bounty, please provide your company
              details
            </CardDescription>
          </CardHeader>
          <CardContent class="space-y-6">
            <div>
              <Label for="companyName">Company Name *</Label>
              <Input
                id="companyName"
                v-model:model-value="form.companyName"
                placeholder="Your Company Name"
                required />
            </div>

            <div>
              <Label for="companyDescription">Company Description</Label>
              <Textarea
                id="companyDescription"
                v-model:model-value="form.companyDescription"
                placeholder="Brief description of your company and what you do"
                rows="3" />
            </div>

            <div>
              <Label for="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                v-model:model-value="form.companyWebsite"
                type="url"
                placeholder="https://yourcompany.com" />
            </div>
          </CardContent>
        </Card>

        <!-- Submit -->
        <div class="flex items-center justify-end gap-4 pt-6">
          <NuxtLink to="/bounties">
            <Button type="button" variant="outline"> Cancel </Button>
          </NuxtLink>
          <Button
            type="submit"
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

// Auth check
const session = authClient.useSession();

// Fetch user's company if they have one
const { data: userCompany } = await useFetch("/api/user/company", {
  server: false,
  default: () => null,
});

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
  requirements: [""],
  interviewProcess: "",
  guidelines: "",
  picture: null as File | null,
  picturePreview: "" as string,
  // Company fields (only for new companies)
  companyName: "",
  companyDescription: "",
  companyWebsite: "",
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
    form.value.payoutType;

  const payoutValid =
    form.value.payoutType === "CASH"
      ? form.value.payoutAmount && form.value.payoutAmount > 0
      : form.value.payoutPercentage && form.value.payoutPercentage > 0;

  const companyValid = userCompany.value || form.value.companyName;

  console.log("Form Validation Debug:", {
    basicValid,
    title: form.value.title,
    description: form.value.description,
    guaranteeTimeframe: form.value.guaranteeTimeframe,
    payoutType: form.value.payoutType,
    payoutValid,
    payoutAmount: form.value.payoutAmount,
    payoutPercentage: form.value.payoutPercentage,
    companyValid,
    userCompany: userCompany.value,
    companyName: form.value.companyName,
  });

  return basicValid && payoutValid && companyValid;
});

// Methods
const addRequirement = () => {
  form.value.requirements.push("");
};

const removeRequirement = (index: number) => {
  if (form.value.requirements.length > 1) {
    form.value.requirements.splice(index, 1);
  }
};

const handlePictureUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    alert("File size must be less than 5MB");
    target.value = "";
    return;
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    alert("Please select an image file");
    target.value = "";
    return;
  }

  form.value.picture = file;

  // Create preview URL
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.picturePreview = e.target?.result as string;
  };
  reader.readAsDataURL(file);
};

const removePicture = () => {
  form.value.picture = null;
  form.value.picturePreview = "";
  // Clear the file input
  const fileInput = document.getElementById("picture") as HTMLInputElement;
  if (fileInput) fileInput.value = "";
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
      requirements: form.value.requirements.filter((req) => req.trim()),
      interviewProcess: form.value.interviewProcess || null,
      guidelines: form.value.guidelines || null,
      // Company data (only if creating new company)
      company: !userCompany.value
        ? {
            companyName: form.value.companyName,
            description: form.value.companyDescription || null,
            website: form.value.companyWebsite || null,
          }
        : null,
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

    // Redirect to the newly created bounty
    await navigateTo(`/company/bounty/${response.id}`);
  } catch (error) {
    console.error("Failed to create bounty:", error);
    // TODO: Show error message to user
  } finally {
    isSubmitting.value = false;
  }
};
</script>
