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
      select: {
        id: true,
        companyName: true,
        description: true,
        website: true,
        createdAt: true
      }
    })

    return company
  } catch (error) {
    console.error('Error fetching user company:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch company'
    })
  }
})