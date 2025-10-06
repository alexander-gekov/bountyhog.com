import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.node.req.headers as any,
  });

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const bountyId = getRouterParam(event, "id");

  if (!bountyId) {
    throw createError({
      statusCode: 400,
      message: "Bounty ID is required",
    });
  }

  const bounty = await prisma.bounty.findUnique({
    where: { id: bountyId },
    select: {
      id: true,
      userId: true,
      tallyFormId: true,
      title: true,
      payoutType: true,
      payoutAmount: true,
      payoutPercentage: true,
      salaryMin: true,
      salaryMax: true,
    },
  });

  if (!bounty) {
    throw createError({
      statusCode: 404,
      message: "Bounty not found",
    });
  }

  if (bounty.userId !== session.user.id) {
    throw createError({
      statusCode: 403,
      message: "You are not authorized to view submissions for this bounty",
    });
  }

  if (!bounty.tallyFormId) {
    throw createError({
      statusCode: 400,
      message: "This bounty does not have a Tally form",
    });
  }

  const apiKey = process.env.TALLY_API_KEY;
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: "Tally API key is not configured",
    });
  }

  const query = getQuery(event);
  const page = query.page ? parseInt(query.page as string) : 1;
  const filter = query.filter || "all";

  try {
    const url = new URL(
      `https://api.tally.so/forms/${bounty.tallyFormId}/submissions`
    );
    url.searchParams.append("page", page.toString());
    url.searchParams.append("filter", filter as string);

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tally API Error:", errorText);
      throw createError({
        statusCode: response.status,
        message: `Failed to fetch submissions from Tally: ${response.statusText}`,
      });
    }

    const data = await response.json();

    return {
      bountyTitle: bounty.title,
      payoutType: bounty.payoutType,
      payoutAmount: bounty.payoutAmount,
      payoutPercentage: bounty.payoutPercentage,
      salaryMin: bounty.salaryMin,
      salaryMax: bounty.salaryMax,
      ...data,
    };
  } catch (error: any) {
    console.error("Error fetching Tally submissions:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch submissions",
    });
  }
});
