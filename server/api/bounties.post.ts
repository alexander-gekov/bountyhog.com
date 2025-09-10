import { PrismaClient } from '@prisma/client'
import { auth } from '@/lib/auth'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Check authentication
  const session = await auth.api.getSession({ headers: event.node.req.headers })
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Authentication required'
    })
  }

  // Validate required fields
  if (!body.title || !body.description || !body.guaranteeTimeframe || !body.payoutType) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }

  // Validate payout
  if (body.payoutType === 'CASH' && (!body.payoutAmount || body.payoutAmount <= 0)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid cash amount is required'
    })
  }

  if (body.payoutType === 'PERCENTAGE' && (!body.payoutPercentage || body.payoutPercentage <= 0)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid percentage is required'
    })
  }

  try {
    // Get or create company
    let company = await prisma.company.findUnique({
      where: { userId: session.user.id }
    })

    if (!company) {
      if (!body.company?.companyName) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Company information is required for first bounty'
        })
      }

      company = await prisma.company.create({
        data: {
          userId: session.user.id,
          companyName: body.company.companyName,
          description: body.company.description || null,
          website: body.company.website || null
        }
      })
    }

    // Create bounty
    const bounty = await prisma.bounty.create({
      data: {
        title: body.title,
        description: body.description,
        companyId: company.id,
        payoutType: body.payoutType,
        payoutAmount: body.payoutAmount || null,
        payoutPercentage: body.payoutPercentage || null,
        guaranteeTimeframe: body.guaranteeTimeframe,
        deadline: body.deadline ? new Date(body.deadline) : null,
        requirements: JSON.stringify(body.requirements || []),
        interviewProcess: body.interviewProcess || null,
        guidelines: body.guidelines || null,
        status: 'OPEN'
      },
      include: {
        company: {
          select: {
            id: true,
            companyName: true
          }
        }
      }
    })

    return bounty
  } catch (error) {
    console.error('Error creating bounty:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create bounty'
    })
  }
})