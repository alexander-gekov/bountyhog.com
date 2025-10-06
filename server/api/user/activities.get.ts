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

  try {
    const activities: Array<{
      id: string;
      description: string;
      createdAt: Date;
      type: string;
    }> = [];

    // Get recent bounty notes
    const recentNotes = await prisma.bountyNote.findMany({
      where: { userId: session.user.id },
      include: {
        bounty: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    recentNotes.forEach((note) => {
      activities.push({
        id: `note-${note.id}`,
        description: `Added a note to "${note.bounty.title}"`,
        createdAt: note.createdAt,
        type: "note",
      });
    });

    // Get recent collaborations (for recruiters)
    if (session.user.userType === "RECRUITER") {
      const recruiter = await prisma.recruiter.findUnique({
        where: { userId: session.user.id },
      });

      if (recruiter) {
        const recentCollaborations =
          await prisma.recruiterCollaboration.findMany({
            where: { recruiterId: recruiter.id },
            include: {
              bounty: {
                select: {
                  title: true,
                },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          });

        recentCollaborations.forEach((collab) => {
          activities.push({
            id: `collab-${collab.id}`,
            description: `Expressed interest in "${collab.bounty.title}"`,
            createdAt: collab.createdAt,
            type: "collaboration",
          });
        });
      }
    }

    // Get recent bounties created (for companies)
    if (session.user.userType === "COMPANY") {
      const recentBounties = await prisma.bounty.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
      });

      recentBounties.forEach((bounty) => {
        activities.push({
          id: `bounty-${bounty.id}`,
          description: `Created bounty "${bounty.title}"`,
          createdAt: bounty.createdAt,
          type: "bounty",
        });
      });
    }

    // Sort all activities by date and return top 10
    activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return activities.slice(0, 10);
  } catch (error) {
    console.error("Error fetching user activities:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch activities",
    });
  }
});
