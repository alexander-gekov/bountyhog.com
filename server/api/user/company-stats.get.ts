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
    const company = await prisma.company.findUnique({
      where: { userId: session.user.id },
      include: {
        bounties: {
          select: {
            id: true,
            status: true
          }
        }
      }
    })

    if (!company) {
      return null
    }

    const stats = {
      totalBounties: company.bounties.length,
      activeBounties: company.bounties.filter(b => b.status === 'OPEN').length,
      completedBounties: company.bounties.filter(b => b.status === 'COMPLETED').length,
      inProgressBounties: company.bounties.filter(b => b.status === 'IN_PROGRESS').length
    }

    return stats
  } catch (error) {
    console.error('Error fetching company stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch company stats'
    })
  }
})