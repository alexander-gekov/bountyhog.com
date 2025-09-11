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
                v-model="form.title"
                placeholder="Senior Full Stack Developer"
                required />
            </div>

            <div>
              <Label for="description">Job Description *</Label>
              <Textarea
                id="description"
                v-model="form.description"
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
                  v-model="form.deadline"
                  type="date"
                  :min="minDate" />
              </div>

              <div>
                <Label for="guaranteeTimeframe">Guarantee Timeframe *</Label>
                <Select v-model="form.guaranteeTimeframe" required>
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
              <div class="flex items-center space-x-6 mt-2">
                <div class="flex items-center space-x-2">
                  <input
                    id="cash"
                    v-model="form.payoutType"
                    type="radio"
                    value="CASH"
                    class="w-4 h-4 text-primary" />
                  <Label for="cash" class="text-sm font-normal"
                    >Fixed Cash Amount</Label
                  >
                </div>
                <div class="flex items-center space-x-2">
                  <input
                    id="percentage"
                    v-model="form.payoutType"
                    type="radio"
                    value="PERCENTAGE"
                    class="w-4 h-4 text-primary" />
                  <Label for="percentage" class="text-sm font-normal"
                    >Percentage of Salary</Label
                  >
                </div>
              </div>
            </div>

            <div v-if="form.payoutType === 'CASH'">
              <Label for="payoutAmount">Cash Amount (USD) *</Label>
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >$</span
                >
                <Input
                  id="payoutAmount"
                  v-model.number="form.payoutAmount"
                  type="number"
                  min="100"
                  step="100"
                  placeholder="5000"
                  class="pl-8"
                  required />
              </div>
            </div>

            <div v-if="form.payoutType === 'PERCENTAGE'">
              <Label for="payoutPercentage"
                >Percentage of Annual Salary *</Label
              >
              <div class="relative">
                <Input
                  id="payoutPercentage"
                  v-model.number="form.payoutPercentage"
                  type="number"
                  min="5"
                  max="50"
                  step="0.5"
                  placeholder="15"
                  class="pr-8"
                  required />
                <span
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  >%</span
                >
              </div>
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
                v-model="form.requirements[index]"
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
                v-model="form.interviewProcess"
                placeholder="Describe your interview process (e.g., 3 rounds: Technical screening, System design, Cultural fit)"
                rows="3" />
            </div>

            <div>
              <Label for="guidelines">Guidelines for Recruiters</Label>
              <Textarea
                id="guidelines"
                v-model="form.guidelines"
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
                v-model="form.companyName"
                placeholder="Your Company Name"
                required />
            </div>

            <div>
              <Label for="companyDescription">Company Description</Label>
              <Textarea
                id="companyDescription"
                v-model="form.companyDescription"
                placeholder="Brief description of your company and what you do"
                rows="3" />
            </div>

            <div>
              <Label for="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                v-model="form.companyWebsite"
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
  payoutType: "CASH" as "CASH" | "PERCENTAGE",
  payoutAmount: 0 as number,
  payoutPercentage: 0 as number,
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
    form.value.title.trim() &&
    form.value.description.trim() &&
    form.value.guaranteeTimeframe &&
    form.value.payoutType;

  const payoutValid =
    form.value.payoutType === "CASH"
      ? form.value.payoutAmount > 0
      : form.value.payoutPercentage > 0;

  const companyValid = userCompany.value || (form.value.companyName && form.value.companyName.trim());

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
        form.value.payoutType === "CASH" && form.value.payoutAmount > 0 ? form.value.payoutAmount : null,
      payoutPercentage:
        form.value.payoutType === "PERCENTAGE" && form.value.payoutPercentage > 0
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
