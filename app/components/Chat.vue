<template>
  <div class="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg flex flex-col">
    <div class="p-4 border-b">
      <h3 class="text-lg font-semibold">Chat</h3>
    </div>
    <div class="flex-1 p-4 overflow-y-auto">
      <div v-for="message in messages" :key="message.id" class="flex mb-2" :class="{ 'justify-end': message.senderId === currentUser.id }">
        <div class="rounded-lg px-3 py-2" :class="{ 'bg-blue-500 text-white': message.senderId === currentUser.id, 'bg-gray-200': message.senderId !== currentUser.id }">
          <p class="text-sm">{{ message.message }}</p>
          <p class="text-xs text-gray-400">{{ new Date(message.createdAt).toLocaleTimeString() }}</p>
        </div>
      </div>
    </div>
    <div class="p-4 border-t">
      <form @submit.prevent="sendMessage">
        <div class="flex items-center">
          <input v-model="newMessage" type="text" placeholder="Type a message..." class="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <button type="submit" class="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'

const props = defineProps<{ collaborationId: string, currentUser: any }>()

const queryClient = useQueryClient()

const { data: messages } = useQuery({
  queryKey: ['chat', props.collaborationId, 'messages'],
  queryFn: () => $fetch(`/api/chat/${props.collaborationId}/messages`),
})

const { mutate: sendMessage } = useMutation({
  mutationFn: (newMessage: string) => $fetch(`/api/chat/${props.collaborationId}/messages`, {
    method: 'POST',
    body: { message: newMessage },
  }),
  onSuccess: () => {
    queryClient.invalidateQueries(['chat', props.collaborationId, 'messages'])
    newMessage.value = ''
  },
})

const newMessage = ref('')

</script>
