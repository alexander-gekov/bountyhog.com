import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createTallyForm } from "@/lib/tally";

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

  const body = await readBody(event);

  if (!body.bountyTitle || !body.formFields) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  const tallyApiKey = process.env.TALLY_API_KEY;

  if (!tallyApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Tally API key not configured",
    });
  }

  const workspaceId = process.env.TALLY_WORKSPACE_ID;

  try {
    const result = await createTallyForm(
      body.bountyTitle,
      body.bountyDescription || "",
      body.formFields,
      tallyApiKey,
      workspaceId
    );

    return result;
  } catch (error: any) {
    console.error("Error creating Tally form:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create Tally form",
    });
  }
});
