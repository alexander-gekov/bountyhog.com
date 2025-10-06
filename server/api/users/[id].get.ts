import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "User ID is required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        companyName: true,
        bio: true,
        websiteUrl: true,
        linkedinUrl: true,
        facebookUrl: true,
        userType: true,
        bounties: {
          include: {
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
        },
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch user",
    });
  }
});
