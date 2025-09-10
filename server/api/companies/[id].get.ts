import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Company ID is required'
    })
  }

  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        bounties: {
          include: {
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
        }
      }
    })

    if (!company) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Company not found'
      })
    }

    return company
  } catch (error) {
    console.error('Error fetching company:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch company'
    })
  }
})