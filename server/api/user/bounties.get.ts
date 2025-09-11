import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.node.req.headers,
  });

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  try {
    const userType = session.user.userType;

    if (userType === "RECRUITER") {
      // Get recruiter's applied bounties (collaborations)
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
              company: {
                select: {
                  id: true,
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

      // For recruiters who can also post bounties, get their posted bounties if they have a company
      const company = await prisma.company.findUnique({
        where: { userId: session.user.id },
      });

      let postedBounties = [];
      if (company) {
        postedBounties = await prisma.bounty.findMany({
          where: {
            companyId: company.id,
          },
          include: {
            company: {
              select: {
                id: true,
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
      }

      return {
        userType: "RECRUITER",
        appliedBounties,
        postedBounties,
      };
    } else if (userType === "COMPANY") {
      // Get company's posted bounties
      let company = await prisma.company.findUnique({
        where: { userId: session.user.id },
      });

      if (!company) {
        throw createError({
          statusCode: 404,
          statusMessage: "Company profile not found",
        });
      }

      const postedBounties = await prisma.bounty.findMany({
        where: {
          companyId: company.id,
        },
        include: {
          company: {
            select: {
              id: true,
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
