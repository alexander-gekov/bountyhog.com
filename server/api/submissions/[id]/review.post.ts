import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const submissionId = getRouterParam(event, "id");
  const body = await readBody(event);

  if (!submissionId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Submission ID is required",
    });
  }

  if (
    !body.status ||
    !["ACCEPTED", "REJECTED", "REVIEWED"].includes(body.status)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid status is required (ACCEPTED, REJECTED, REVIEWED)",
    });
  }

  // Check authentication
  const session = await auth.api.getSession({
    headers: event.node.req.headers,
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
      statusMessage: "Only companies can review submissions",
    });
  }

  try {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        bounty: true,
        recruiter: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!submission) {
      throw createError({
        statusCode: 404,
        statusMessage: "Submission not found",
      });
    }

    if (submission.bounty.userId !== session.user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: "You can only review submissions for your own bounties",
      });
    }

    // Update the submission status
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: body.status,
        feedback: body.feedback || null,
        updatedAt: new Date(),
      },
    });

    // Create notification for the recruiter
    await prisma.notification.create({
      data: {
        userId: submission.recruiter.userId,
        type: "SUBMISSION_REVIEWED",
        title: `Candidate Submission ${body.status}`,
        message: `Your candidate submission "${
          submission.candidateName
        }" for "${
          submission.bounty.title
        }" has been ${body.status.toLowerCase()}.${
          body.feedback ? ` Feedback: ${body.feedback}` : ""
        }`,
        data: {
          submissionId: submission.id,
          bountyId: submission.bountyId,
          bountyTitle: submission.bounty.title,
          candidateName: submission.candidateName,
          status: body.status,
          feedback: body.feedback,
        },
      },
    });

    return { success: true, submission: updatedSubmission };
  } catch (error) {
    console.error("Error reviewing submission:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to review submission",
    });
  }
});
