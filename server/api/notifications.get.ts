import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  // Check authentication
  const session = await auth.api.getSession({ headers: event.node.req.headers })
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  try {
    // Fetch notifications for the current user
    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to recent 50 notifications
    })

    return notifications
  } catch (error) {
    console.error('Error fetching notifications:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch notifications'
    })
  }
})