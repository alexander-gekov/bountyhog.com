import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const requestId = getRouterParam(event, "id");

  if (!requestId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Partnership request ID is required",
    });
  }

  // Check authentication
  const session = await auth.api.getSession({
    headers: event.node.req.headers as any,
  });
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  // Check if user is a company
  if (session.user.userType !== "COMPANY") {
    throw createError({
      statusCode: 403,
      statusMessage: "Only companies can approve partnership requests",
    });
  }

  try {
    const partnershipRequest = await prisma.recruiterCollaboration.findUnique({
      where: { id: requestId },
      include: {
        bounty: {
          include: {
            user: true,
          },
        },
        recruiter: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!partnershipRequest) {
      throw createError({
        statusCode: 404,
        statusMessage: "Partnership request not found",
      });
    }

    if (partnershipRequest.bounty.userId !== session.user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "You can only approve requests for your own bounties",
      });
    }

    if (partnershipRequest.status !== "PENDING") {
      throw createError({
        statusCode: 400,
        statusMessage: "Partnership request has already been processed",
      });
    }

    // Approve the partnership request
    const updatedRequest = await prisma.recruiterCollaboration.update({
      where: { id: requestId },
      data: {
        status: "APPROVED",
        isUnlocked: true,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    // Create notification for the recruiter
    await prisma.notification.create({
      data: {
        userId: partnershipRequest.recruiter.userId,
        type: "PARTNERSHIP_APPROVED",
        title: "Partnership Request Approved",
        message: `Your partnership request for "${partnershipRequest.bounty.title}" has been approved! You can now submit candidates.`,
        data: {
          bountyId: partnershipRequest.bountyId,
          bountyTitle: partnershipRequest.bounty.title,
          companyName:
            partnershipRequest.bounty.user.companyName ||
            partnershipRequest.bounty.user.name,
        },
      },
    });

    return { success: true, request: updatedRequest };
  } catch (error: any) {
    console.error("Error approving partnership:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to approve partnership request",
    });
  }
});
