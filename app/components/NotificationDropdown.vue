<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button size="sm" variant="ghost" class="relative">
        <LucideBell class="w-4 h-4" />
        <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {{ unreadCount > 99 ? '99+' : unreadCount }}
        </span>
        <span class="sr-only">Notifications</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-80">
      <div class="p-4 border-b">
        <div class="flex items-center justify-between">
          <h3 class="font-semibold">Notifications</h3>
          <Button 
            v-if="unreadCount > 0"
            @click="markAllAsRead" 
            variant="ghost" 
            size="sm"
            class="text-xs"
          >
            Mark all read
          </Button>
        </div>
      </div>
      
      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-4 text-center text-muted-foreground">
          <LucideBell class="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p class="text-sm">No notifications yet</p>
        </div>
        
        <div v-else class="divide-y">
          <div 
            v-for="notification in notifications.slice(0, 10)" 
            :key="notification.id"
            class="p-4 hover:bg-muted/50 cursor-pointer transition-colors"
            :class="{ 'bg-blue-50 dark:bg-blue-950/20': !notification.isRead }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start gap-3">
              <div class="flex-shrink-0 mt-1">
                <div 
                  class="w-2 h-2 rounded-full"
                  :class="notification.isRead ? 'bg-gray-300' : 'bg-blue-500'"
                ></div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-foreground">{{ notification.title }}</p>
                <p class="text-sm text-muted-foreground mt-1">{{ notification.message }}</p>
                <p class="text-xs text-muted-foreground mt-2">{{ formatDate(notification.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="notifications.length > 10" class="p-4 border-t">
        <Button variant="ghost" size="sm" class="w-full text-sm">
          View all notifications
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script lang="ts" setup>
import { LucideBell } from 'lucide-vue-next'

// Fetch notifications
const { data: notifications, refresh } = await useFetch('/api/notifications', {
  server: false,
  default: () => []
})

// Computed properties
const unreadCount = computed(() => 
  notifications.value?.filter(n => !n.isRead).length || 0
)

// Functions
const markAllAsRead = async () => {
  try {
    await $fetch('/api/notifications/mark-all-read', { method: 'POST' })
    await refresh()
  } catch (error) {
    console.error('Failed to mark notifications as read:', error)
  }
}

const handleNotificationClick = async (notification: any) => {
  // Mark as read if not already read
  if (!notification.isRead) {
    try {
      await $fetch(`/api/notifications/${notification.id}/read`, { method: 'POST' })
      await refresh()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Navigate based on notification type and data
  if (notification.data) {
    const data = notification.data
    
    switch (notification.type) {
      case 'PARTNERSHIP_REQUEST':
        if (data.bountyId) {
          await navigateTo('/dashboard')
        }
        break
      case 'PARTNERSHIP_APPROVED':
      case 'PARTNERSHIP_REJECTED':
        if (data.bountyId) {
          await navigateTo(`/company/bounty/${data.bountyId}`)
        }
        break
      case 'SUBMISSION_RECEIVED':
        if (data.bountyId) {
          await navigateTo(`/company/bounty/${data.bountyId}`)
        }
        break
      default:
        // Default navigation or no navigation
        break
    }
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffMinutes = Math.ceil(diffTime / (1000 * 60))
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Auto-refresh notifications every 30 seconds
const refreshInterval = setInterval(() => {
  refresh()
}, 30000)

// Cleanup on unmount
onUnmounted(() => {
  clearInterval(refreshInterval)
})
</script>