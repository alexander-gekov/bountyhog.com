<template>
  <a :href="bountyUrl" class="block whitespace-nowrap hover:bg-muted/50">
    <li class="flex items-center py-2 px-3">
      <div class="flex-shrink-0 mr-3">
        <div class="relative rounded-full shrink-0 overflow-hidden w-8 h-8">
          <img
            :src="bounty.user?.image"
            :alt="bounty.user?.name"
            class="w-full h-full object-cover rounded-full" />
        </div>
      </div>

      <div class="flex-grow min-w-0 mr-4">
        <div class="flex items-center gap-4 text-sm">
          <span class="font-semibold mr-1">
            {{ displayCompanyName }}
          </span>
          <Badge variant="default" size="md" class="mr-2">
            <template v-if="bounty.payoutType === 'CASH'">
              ${{ (bounty.payoutAmount || 0).toLocaleString() }}
            </template>
            <template v-else> {{ bounty.payoutPercentage || 0 }}% </template>
          </Badge>
          <span class="text-foreground">{{ bounty.title }}</span>
          <slot />
        </div>
      </div>
    </li>
  </a>
</template>

<script lang="ts" setup>
interface BountyProps {
  bounty: {
    id: string;
    title: string;
    payoutType: "CASH" | "PERCENTAGE";
    payoutAmount?: number | null;
    payoutPercentage?: number | null;
    user?: {
      id?: string;
      companyName?: string;
      name?: string;
      image?: string;
    };
  };
  companyName?: string;
  authorId?: string;
}

const props = defineProps<BountyProps>();

const displayCompanyName = computed(() => {
  return (
    props.companyName ||
    props.bounty.user?.companyName ||
    props.bounty.user?.name ||
    "Unknown Company"
  );
});

const bountyUrl = computed(() => {
  const userId = props.authorId || props.bounty.user?.id;
  return `/author/${userId}/bounty/${props.bounty.id}`;
});
</script>
