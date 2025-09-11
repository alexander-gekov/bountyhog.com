import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const notificationId = getRouterParam(event, 'id')
  
  if (!notificationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Notification ID is required'
    })
  }

  // Check authentication
  const session = await auth.api.getSession({ headers: event.node.req.headers })
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  try {
    // Verify notification belongs to current user and mark as read
    const notification = await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: session.user.id
      },
      data: {
        isRead: true
      }
    })

    if (notification.count === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Notification not found'
      })
    }

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) throw error
    
    console.error('Error marking notification as read:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark notification as read'
    })
  }
})
