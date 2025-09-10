import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bounty ID is required'
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

  // Check if user is a recruiter
  if (session.user.userType !== 'RECRUITER') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Only recruiters can express interest in bounties'
    })
  }

  try {
    // Check if bounty exists and is open
    const bounty = await prisma.bounty.findUnique({
      where: { id },
      select: { id: true, status: true }
    })

    if (!bounty) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bounty not found'
      })
    }

    if (bounty.status !== 'OPEN') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bounty is not open for collaboration'
      })
    }

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

    // Create collaboration
    const collaboration = await prisma.recruiterCollaboration.create({
      data: {
        bountyId: id,
        recruiterId: recruiter.id,
        message: body.message || 'Interested in working on this bounty',
        isUnlocked: false
      }
    })

    return { success: true, collaboration }
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 400,
        statusMessage: 'You have already expressed interest in this bounty'
      })
    }
    
    console.error('Error creating collaboration:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to express interest'
    })
  }
})