import { prisma } from "@/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, userType } = body;

  if (!userId || !userType) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields",
    });
  }

  if (userType !== "COMPANY" && userType !== "RECRUITER") {
    throw createError({
      statusCode: 400,
      message: "Invalid user type",
    });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { userType },
  });

  if (userType === "COMPANY") {
    const existingCompany = await prisma.company.findUnique({
      where: { userId },
    });

    if (!existingCompany) {
      await prisma.company.create({
        data: {
          userId,
          companyName: user.name,
          description: "",
        },
      });
    }
  } else if (userType === "RECRUITER") {
    const existingRecruiter = await prisma.recruiter.findUnique({
      where: { userId },
    });

    if (!existingRecruiter) {
      await prisma.recruiter.create({
        data: {
          userId,
          bio: "",
          experience: "",
          specialties: "",
        },
      });
    }
  }

  return { success: true, user };
});
