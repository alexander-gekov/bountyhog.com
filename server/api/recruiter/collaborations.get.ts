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

  // Check if user is a recruiter
  if (session.user.userType !== 'RECRUITER') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only recruiters can access this endpoint'
    })
  }

  try {
    // Get or create recruiter profile
    let recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.user.id }
    })

    if (!recruiter) {
      recruiter = await prisma.recruiter.create({
        data: {
          userId: session.user.id,
          bio: '',
          experience: '',
          specialties: ''
        }
      })
    }

    // Fetch collaborations
    const collaborations = await prisma.recruiterCollaboration.findMany({
      where: {
        recruiterId: recruiter.id
      },
      include: {
        bounty: {
          include: {
            company: {
              select: {
                id: true,
                companyName: true
              }
            }
          }
        },
        submissions: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return collaborations
  } catch (error) {
    console.error('Error fetching collaborations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch collaborations'
    })
  }
})