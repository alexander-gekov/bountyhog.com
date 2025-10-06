import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bounty ID is required",
    });
  }

  const session = await auth.api.getSession({
    headers: event.node.req.headers as any,
  });

  const userId = session?.user?.id;

  try {
    const bounty = await prisma.bounty.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            companyName: true,
            bio: true,
            websiteUrl: true,
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
        notes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
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
    });

    if (!bounty) {
      throw createError({
        statusCode: 404,
        statusMessage: "Bounty not found",
      });
    }

    const isAuthor = userId === bounty.userId;

    const userCollaboration = userId
      ? bounty.collaborations.find((c: any) => c.recruiter.userId === userId)
      : null;

    const isApprovedCollaborator = userCollaboration?.status === "APPROVED";

    bounty.collaborations = bounty.collaborations.map((collaboration) => ({
      ...collaboration,
      recruiter: {
        ...collaboration.recruiter,
        user: {
          ...collaboration.recruiter.user,
          name: collaboration.recruiter.user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
        },
      },
    }));

    if (!userId) {
      return {
        ...bounty,
        tallyFormUrl: null,
        tallyFormPassword: null,
        formFields: null,
      };
    }

    if (isAuthor) {
      return bounty;
    }

    if (isApprovedCollaborator) {
      return bounty;
    }

    return {
      ...bounty,
      tallyFormUrl: null,
      tallyFormPassword: null,
      formFields: null,
    };
  } catch (error) {
    console.error("Error fetching bounty:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch bounty",
    });
  }
});
