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
    const bounties = await prisma.bounty.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
        collaborations: {
          include: {
            recruiter: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        submissions: {
          include: {
            recruiter: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            collaborations: true,
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return bounties;
  } catch (error) {
    console.error("Error fetching company bounties:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch bounties",
    });
  }
});
