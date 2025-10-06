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

  const body = await readBody(event);

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: body.name,
        companyName: body.companyName,
        bio: body.bio,
        phone: body.phone,
        websiteUrl: body.websiteUrl,
        linkedinUrl: body.linkedinUrl,
        facebookUrl: body.facebookUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        companyName: true,
        bio: true,
        phone: true,
        websiteUrl: true,
        linkedinUrl: true,
        facebookUrl: true,
        userType: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update profile",
    });
  }
});
