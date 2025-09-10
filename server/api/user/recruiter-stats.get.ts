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
      include: {
        collaborations: {
          select: {
            id: true,
            isUnlocked: true
          }
        },
        submissions: {
          select: {
            id: true,
            status: true
          }
        }
      }
    })

    if (!recruiter) {
      return null
    }

    const stats = {
      totalCollaborations: recruiter.collaborations.length,
      unlockedCollaborations: recruiter.collaborations.filter(c => c.isUnlocked).length,
      totalSubmissions: recruiter.submissions.length,
      acceptedSubmissions: recruiter.submissions.filter(s => s.status === 'ACCEPTED').length,
      pendingSubmissions: recruiter.submissions.filter(s => s.status === 'PENDING').length
    }

    return stats
  } catch (error) {
    console.error('Error fetching recruiter stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recruiter stats'
    })
  }
})