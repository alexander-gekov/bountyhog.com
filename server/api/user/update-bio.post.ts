import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

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

  if (!body.bio && body.bio !== "") {
    throw createError({
      statusCode: 400,
      statusMessage: "Bio field is required",
    });
  }

  try {
    // Check if user is a recruiter and update their bio
    if (session.user.userType === "RECRUITER") {
      // Check if recruiter profile exists
      let recruiter = await prisma.recruiter.findUnique({
        where: { userId: session.user.id },
      });

      if (!recruiter) {
        // Create recruiter profile if it doesn't exist
        recruiter = await prisma.recruiter.create({
          data: {
            userId: session.user.id,
            bio: body.bio.trim() || null,
            experience: null,
            specialties: null,
          },
        });
      } else {
        // Update existing recruiter profile
        recruiter = await prisma.recruiter.update({
          where: { userId: session.user.id },
          data: {
            bio: body.bio.trim() || null,
          },
        });
      }

      return { success: true, bio: recruiter.bio };
    } else {
      throw createError({
        statusCode: 400,
        statusMessage: "Bio can only be updated for recruiter accounts",
      });
    }
  } catch (error) {
    console.error("Error updating bio:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update bio",
    });
  }
});
