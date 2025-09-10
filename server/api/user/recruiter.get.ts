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
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        bio: true,
        experience: true,
        specialties: true,
        createdAt: true
      }
    })

    return recruiter
  } catch (error) {
    console.error('Error fetching user recruiter:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recruiter profile'
    })
  }
})