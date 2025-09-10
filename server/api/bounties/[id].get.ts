import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bounty ID is required'
    })
  }

  try {
    const bounty = await prisma.bounty.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            description: true,
            website: true
          }
        },
        collaborations: {
          include: {
            recruiter: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        notes: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            collaborations: true,
            submissions: true
          }
        }
      }
    })

    if (!bounty) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bounty not found'
      })
    }

    return bounty
  } catch (error) {
    console.error('Error fetching bounty:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch bounty'
    })
  }
})