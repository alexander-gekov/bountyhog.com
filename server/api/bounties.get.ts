import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PAGE_SIZE = 25;

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = parseInt((query.page as string) || "1", 10);

  try {
    const bounties = await prisma.bounty.findMany({
      where: {
        status: "OPEN",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            companyName: true,
            bio: true,
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
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });

    const totalBounties = await prisma.bounty.count({
      where: {
        status: "OPEN",
      },
    });

    return {
      bounties,
      hasNextPage: page * PAGE_SIZE < totalBounties,
    };
  } catch (error) {
    console.error("Error fetching bounties:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch bounties",
    });
  }
});
