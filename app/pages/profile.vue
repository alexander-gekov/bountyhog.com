<template>
  <div class="container mx-auto py-8 px-4 max-w-2xl">
    <h1 class="text-3xl font-bold mb-6">Edit Profile</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="space-y-4">
        <div>
          <Label for="name">Name</Label>
          <Input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Your name"
            required />
        </div>

        <div>
          <Label for="email">Email</Label>
          <Input
            id="email"
            :value="user?.email"
            type="email"
            disabled
            class="bg-muted" />
          <p class="text-sm text-muted-foreground mt-1">
            Email cannot be changed
          </p>
        </div>

        <div v-if="user?.userType === 'COMPANY'">
          <Label for="companyName">Company Name</Label>
          <Input
            id="companyName"
            v-model="formData.companyName"
            type="text"
            placeholder="Your company name" />
        </div>

        <div>
          <Label for="bio">Bio</Label>
          <Textarea
            id="bio"
            v-model="formData.bio"
            placeholder="Tell us about yourself or your company"
            rows="4" />
        </div>

        <div>
          <Label for="phone">Phone</Label>
          <Input
            id="phone"
            v-model="formData.phone"
            type="tel"
            placeholder="+1 234 567 8900" />
        </div>

        <div>
          <Label for="websiteUrl">Website</Label>
          <Input
            id="websiteUrl"
            v-model="formData.websiteUrl"
            type="url"
            placeholder="https://example.com" />
        </div>

        <div>
          <Label for="linkedinUrl">LinkedIn URL</Label>
          <Input
            id="linkedinUrl"
            v-model="formData.linkedinUrl"
            type="url"
            placeholder="https://linkedin.com/in/username" />
        </div>

        <div>
          <Label for="facebookUrl">Facebook URL</Label>
          <Input
            id="facebookUrl"
            v-model="formData.facebookUrl"
            type="url"
            placeholder="https://facebook.com/username" />
        </div>
      </div>

      <div class="flex gap-4">
        <Button type="submit" :disabled="isLoading">
          {{ isLoading ? "Saving..." : "Save Changes" }}
        </Button>
        <Button type="button" variant="outline" @click="navigateTo('/account')">
          Cancel
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { $authClient } = useNuxtApp();
const { data: session } = useAuth();

const user = computed(() => session.value?.user);

const formData = ref({
  name: "",
  companyName: "",
  bio: "",
  phone: "",
  websiteUrl: "",
  linkedinUrl: "",
  facebookUrl: "",
});

const isLoading = ref(false);

watchEffect(() => {
  if (user.value) {
    formData.value = {
      name: user.value.name || "",
      companyName: user.value.companyName || "",
      bio: user.value.bio || "",
      phone: user.value.phone || "",
      websiteUrl: user.value.websiteUrl || "",
      linkedinUrl: user.value.linkedinUrl || "",
      facebookUrl: user.value.facebookUrl || "",
    };
  }
});

const handleSubmit = async () => {
  isLoading.value = true;

  try {
    const response = await $fetch("/api/user/profile", {
      method: "PATCH",
      body: formData.value,
    });

    await $authClient.useSession(navigateTo);

    navigateTo("/account");
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile");
  } finally {
    isLoading.value = false;
  }
};

definePageMeta({
  middleware: "auth",
});
</script>
