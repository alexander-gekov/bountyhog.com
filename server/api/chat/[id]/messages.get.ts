import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.node.req.headers as any,
  });
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const chatId = event.context.params?.id;
  if (!chatId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
    });
  }

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: true,
        },
      },
      collaboration: {
        include: {
          bounty: {
            include: {
              company: true,
            },
          },
          recruiter: true,
        },
      },
    },
  });

  if (!chat) {
    throw createError({
      statusCode: 404,
      statusMessage: "Not Found",
    });
  }

  const isBountyAuthor =
    chat.collaboration.bounty.company.userId === session.user.id;
  const isRecruiter = chat.collaboration.recruiter.userId === session.user.id;

  if (!isBountyAuthor && !isRecruiter) {
    throw createError({
      statusCode: 403,
      statusMessage: "Forbidden",
    });
  }

  return chat.messages;
});
