import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { userId, userType } = body;

    if (!userId || !userType) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields: userId and userType",
      });
    }

    if (!["COMPANY", "RECRUITER"].includes(userType)) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid userType. Must be COMPANY or RECRUITER",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { userType },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
      },
    });

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user type:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to update user type",
    });
  }
});
