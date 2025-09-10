import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const bounties = await prisma.bounty.findMany({
      where: {
        status: 'OPEN'
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true,
            description: true
          }
        },
        _count: {
          select: {
            collaborations: true,
            submissions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return bounties
  } catch (error) {
    console.error('Error fetching bounties:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch bounties'
    })
  }
})