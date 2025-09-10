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

  if (!body.content?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Note content is required'
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
    // Check if bounty exists
    const bounty = await prisma.bounty.findUnique({
      where: { id },
      select: { id: true }
    })

    if (!bounty) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bounty not found'
      })
    }

    // Create note
    const note = await prisma.bountyNote.create({
      data: {
        bountyId: id,
        userId: session.user.id,
        content: body.content.trim(),
        isPublic: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return { success: true, note }
  } catch (error) {
    console.error('Error creating note:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create note'
    })
  }
})