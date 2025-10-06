import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
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
      statusMessage: "Only companies can access this endpoint",
    });
  }

  try {
    const partnershipRequests = await prisma.recruiterCollaboration.findMany({
      where: {
        bounty: {
          userId: session.user.id,
        },
      },
      include: {
        recruiter: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        bounty: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return partnershipRequests;
  } catch (error) {
    console.error("Error fetching partnership requests:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch partnership requests",
    });
  }
});
