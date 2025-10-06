import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bounty ID is required",
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

  // Check if user is a recruiter
  if (session.user.userType !== "RECRUITER") {
    throw createError({
      statusCode: 403,
      statusMessage: "Only recruiters can express interest in bounties",
    });
  }

  try {
    // Check if bounty exists and is open
    const bounty = await prisma.bounty.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!bounty) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bounty not found",
      });
    }

    if (bounty.status !== "OPEN") {
      throw createError({
        statusCode: 400,
        statusMessage: "Bounty is not open for collaboration",
      });
    }

    // Get or create recruiter profile
    let recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.user.id },
    });

    if (!recruiter) {
      recruiter = await prisma.recruiter.create({
        data: {
          userId: session.user.id,
          bio: "",
          experience: "",
          specialties: "",
        },
      });
    }

    // Get bounty details for notification
    const bountyDetails = await prisma.bounty.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    // Create collaboration
    const collaboration = await prisma.recruiterCollaboration.create({
      data: {
        bountyId: id,
        recruiterId: recruiter.id,
        message: body.message || "Interested in working on this bounty",
        introduction: body.introduction || null,
        isUnlocked: false,
        status: "PENDING",
      },
    });

    // Create notification for the company/user
    if (bountyDetails?.user) {
      await prisma.notification.create({
        data: {
          userId: bountyDetails.userId,
          type: "PARTNERSHIP_REQUEST",
          title: "New Partnership Request",
          message: `${session.user.name} wants to work on your bounty "${bountyDetails.title}".`,
          data: {
            bountyId: id,
            bountyTitle: bountyDetails.title,
            recruiterName: session.user.name,
            recruiterId: recruiter.id,
            collaborationId: collaboration.id,
          },
        },
      });
    }

    return { success: true, collaboration };
  } catch (error: any) {
    if (error.code === "P2002") {
      throw createError({
        statusCode: 400,
        statusMessage: "You have already expressed interest in this bounty",
      });
    }

    console.error("Error creating collaboration:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to express interest",
    });
  }
});
