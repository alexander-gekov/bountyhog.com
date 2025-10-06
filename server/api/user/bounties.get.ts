import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.node.req.headers as any,
  });

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  try {
    const userType = session.user.userType;

    if (!userType) {
      return {
        userType: null,
        appliedBounties: [],
        postedBounties: [],
      };
    }

    if (userType === "RECRUITER") {
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

      const appliedBounties = await prisma.recruiterCollaboration.findMany({
        where: {
          recruiterId: recruiter.id,
        },
        include: {
          bounty: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  companyName: true,
                },
              },
            },
          },
          submissions: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const postedBounties = await prisma.bounty.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              companyName: true,
            },
          },
          collaborations: {
            include: {
              bounty: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                      companyName: true,
                    },
                  },
                },
              },
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
                      image: true,
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

      return {
        userType: "RECRUITER",
        appliedBounties,
        postedBounties,
      };
    } else if (userType === "COMPANY") {
      const postedBounties = await prisma.bounty.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
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
                      image: true,
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
                      image: true,
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

      return {
        userType: "COMPANY",
        appliedBounties: [],
        postedBounties,
      };
    } else {
      throw createError({
        statusCode: 403,
        statusMessage: "Invalid user type",
      });
    }
  } catch (error) {
    console.error("Error fetching user bounties:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch bounties",
    });
  }
});
