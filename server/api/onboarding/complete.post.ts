import { prisma } from "@/lib/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const {
    userId,
    userType,
    name,
    email,
    phone,
    bio,
    companyName,
    image,
    linkedinUrl,
    facebookUrl,
    websiteUrl,
  } = body;

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
    data: {
      userType,
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      bio: bio || undefined,
      companyName: companyName || undefined,
      image: image || undefined,
      linkedinUrl: linkedinUrl || undefined,
      facebookUrl: facebookUrl || undefined,
      websiteUrl: websiteUrl || undefined,
    },
  });

  if (userType === "RECRUITER") {
    const existingRecruiter = await prisma.recruiter.findUnique({
      where: { userId },
    });

    if (!existingRecruiter) {
      await prisma.recruiter.create({
        data: {
          userId,
          bio: bio || "",
          experience: "",
          specialties: "",
        },
      });
    }
  }

  return { success: true, user };
});
