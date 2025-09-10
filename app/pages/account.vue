<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Auth Check -->
    <div v-if="!session.data" class="text-center py-16">
      <h1 class="text-2xl font-bold mb-4">Authentication Required</h1>
      <p class="text-muted-foreground mb-6">
        You need to sign in to view your account.
      </p>
      <NuxtLink to="/sign-in">
        <Button>Sign In</Button>
      </NuxtLink>
    </div>

    <!-- Account Dashboard -->
    <div v-else class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight">Account Dashboard</h1>
        <p class="text-muted-foreground mt-2">
          Manage your profile, view activity, and track payouts
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Profile Information -->
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your basic account information
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex items-center gap-4">
                <div
                  class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <span class="text-xl font-semibold text-primary">
                    {{ session.data?.user.name?.charAt(0)?.toUpperCase() }}
                  </span>
                </div>
                <div>
                  <h3 class="text-lg font-semibold">
                    {{ session.data?.user.name }}
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    {{ session.data?.user.email }}
                  </p>
                  <Badge
                    :variant="
                      session.data?.user.userType === 'COMPANY'
                        ? 'default'
                        : 'secondary'
                    "
                    class="mt-1">
                    {{
                      session.data?.user.userType === "COMPANY"
                        ? "Company"
                        : "Recruiter"
                    }}
                  </Badge>
                </div>
              </div>

              <div class="pt-4 border-t">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="font-medium text-muted-foreground">
                      Member Since
                    </p>
                    <p>{{ formatDate(session.data?.user.createdAt) }}</p>
                  </div>
                  <div>
                    <p class="font-medium text-muted-foreground">
                      Email Verified
                    </p>
                    <p class="flex items-center gap-1">
                      <svg
                        v-if="session.data?.user.emailVerified"
                        class="w-4 h-4 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <svg
                        v-else
                        class="w-4 h-4 text-amber-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {{
                        session.data?.user.emailVerified
                          ? "Verified"
                          : "Pending"
                      }}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Company/Recruiter Specific Info -->
          <Card v-if="session.data?.user.userType === 'COMPANY' && company">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Your company profile and bounty statistics
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <h4 class="font-semibold">{{ company.companyName }}</h4>
                <p
                  v-if="company.description"
                  class="text-sm text-muted-foreground mt-1">
                  {{ company.description }}
                </p>
                <a
                  v-if="company.website"
                  :href="company.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-primary hover:underline flex items-center gap-1 mt-2">
                  <svg
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  Visit Website
                </a>
              </div>

              <div class="pt-4 border-t">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="font-medium text-muted-foreground">
                      Total Bounties
                    </p>
                    <p class="text-lg font-semibold">
                      {{ companyStats?.totalBounties || 0 }}
                    </p>
                  </div>
                  <div>
                    <p class="font-medium text-muted-foreground">
                      Active Bounties
                    </p>
                    <p class="text-lg font-semibold">
                      {{ companyStats?.activeBounties || 0 }}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            v-else-if="
              session.data?.user.userType === 'RECRUITER' && recruiter
            ">
            <CardHeader>
              <CardTitle>Recruiter Profile</CardTitle>
              <CardDescription>
                Your recruiter profile and collaboration statistics
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <div>
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <div v-if="!isEditingBio">
                      <p v-if="recruiter.bio" class="text-sm">
                        {{ recruiter.bio }}
                      </p>
                      <p v-else class="text-sm text-muted-foreground italic">
                        No bio added yet
                      </p>
                    </div>
                    <div v-else class="space-y-3">
                      <Textarea
                        v-model="bioForm.bio"
                        placeholder="Tell others about your recruiting experience, specialties, and background..."
                        rows="4"
                        class="resize-none" />
                      <div class="flex items-center gap-2">
                        <Button
                          @click="saveBio"
                          :disabled="isSavingBio"
                          size="sm">
                          {{ isSavingBio ? "Saving..." : "Save" }}
                        </Button>
                        <Button
                          @click="cancelBioEdit"
                          variant="outline"
                          size="sm">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button
                    v-if="!isEditingBio"
                    @click="startBioEdit"
                    variant="ghost"
                    size="sm"
                    class="ml-2">
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </Button>
                </div>
                <div
                  v-if="recruiter.experience || recruiter.specialties"
                  class="mt-3 space-y-2">
                  <div v-if="recruiter.experience">
                    <span class="text-xs font-medium text-muted-foreground"
                      >Experience:
                    </span>
                    <span class="text-sm">{{ recruiter.experience }}</span>
                  </div>
                  <div v-if="recruiter.specialties">
                    <span class="text-xs font-medium text-muted-foreground"
                      >Specialties:
                    </span>
                    <span class="text-sm">{{ recruiter.specialties }}</span>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p class="font-medium text-muted-foreground">
                      Active Collaborations
                    </p>
                    <p class="text-lg font-semibold">
                      {{ recruiterStats?.totalCollaborations || 0 }}
                    </p>
                  </div>
                  <div>
                    <p class="font-medium text-muted-foreground">
                      Total Submissions
                    </p>
                    <p class="text-lg font-semibold">
                      {{ recruiterStats?.totalSubmissions || 0 }}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Activity History -->
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div v-if="activities?.length" class="space-y-4">
                <div
                  v-for="activity in activities"
                  :key="activity.id"
                  class="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div
                    class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      class="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm">{{ activity.description }}</p>
                    <p class="text-xs text-muted-foreground mt-1">
                      {{ formatDate(activity.createdAt) }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8 text-muted-foreground">
                <p>No recent activity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Quick Actions -->
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent class="space-y-3">
              <NuxtLink to="/create" class="block">
                <Button class="w-full justify-start">
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
                  Create Bounty
                </Button>
              </NuxtLink>

              <NuxtLink to="/bounties" class="block">
                <Button variant="outline" class="w-full justify-start">
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
                  Browse Bounties
                </Button>
              </NuxtLink>

              <NuxtLink
                v-if="session.data?.user.userType === 'RECRUITER'"
                to="/my-bounties"
                class="block">
                <Button variant="outline" class="w-full justify-start">
                  <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  My Bounties
                </Button>
              </NuxtLink>
            </CardContent>
          </Card>

          <!-- Payouts (Placeholder) -->
          <Card>
            <CardHeader>
              <CardTitle>Payouts</CardTitle>
              <CardDescription>
                Track your earnings and payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="text-center py-8 text-muted-foreground">
                <svg
                  class="w-12 h-12 mx-auto mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                <p class="text-sm">No payouts yet</p>
                <p class="text-xs mt-1">
                  Complete successful hires to earn payouts
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { authClient } from "@/lib/auth-client";

// Auth check - use the reactive session
const session = authClient.useSession();

// Fetch additional data based on user type
const { data: company } = await useFetch("/api/user/company", {
  default: () => null,
});

const { data: recruiter } = await useFetch("/api/user/recruiter", {
  default: () => null,
});

const { data: companyStats } = await useFetch("/api/user/company-stats", {
  default: () => null,
});

const { data: recruiterStats } = await useFetch("/api/user/recruiter-stats", {
  default: () => null,
});

const { data: activities } = await useFetch("/api/user/activities", {
  default: () => [],
});

// Bio editing state
const isEditingBio = ref(false);
const isSavingBio = ref(false);
const bioForm = ref({
  bio: "",
});

// Bio editing methods
const startBioEdit = () => {
  bioForm.value.bio = recruiter.value?.bio || "";
  isEditingBio.value = true;
};

const cancelBioEdit = () => {
  isEditingBio.value = false;
  bioForm.value.bio = "";
};

const saveBio = async () => {
  if (isSavingBio.value) return;

  isSavingBio.value = true;

  try {
    await $fetch("/api/user/update-bio", {
      method: "POST",
      body: {
        bio: bioForm.value.bio,
      },
    });

    // Update the local data
    if (recruiter.value) {
      recruiter.value.bio = bioForm.value.bio;
    }

    isEditingBio.value = false;
  } catch (error) {
    console.error("Failed to update bio:", error);
    // TODO: Show error message to user
  } finally {
    isSavingBio.value = false;
  }
};

// Format date helper
const formatDate = (date: string | Date) => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>
