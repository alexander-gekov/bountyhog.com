import { prisma } from "@/lib/prisma";
import resend from "@/lib/resend";

interface TallyWebhookData {
  eventId: string;
  eventType: "FORM_RESPONSE";
  createdAt: string;
  data: {
    responseId: string;
    submissionId: string;
    respondentId: string;
    formId: string;
    formName: string;
    createdAt: string;
    fields: Array<{
      key: string;
      label: string;
      type: string;
      value: any;
      options?: Array<{
        id: string;
        text: string;
      }>;
    }>;
  };
}

export default defineEventHandler(async (event) => {
  const formId = getRouterParam(event, "id");

  if (!formId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Form ID is required",
    });
  }

  try {
    const payload: TallyWebhookData = await readBody(event);

    console.log("Received Tally webhook for form:", formId);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    if (payload.eventType !== "FORM_RESPONSE") {
      console.log("Ignoring non-FORM_RESPONSE event");
      return { success: true, message: "Event type not handled" };
    }

    const bounty = await prisma.bounty.findFirst({
      where: {
        tallyFormId: formId,
      },
    });

    if (!bounty) {
      console.log("Bounty not found");
      return { success: true, message: "Bounty not found" };
    }

    const user = await prisma.user.findUnique({
      where: {
        id: bounty?.userId,
      },
    });
    if (!user) {
      console.log("User not found");
      return { success: true, message: "User not found" };
    }

    try {
      const data = await resend.emails.send({
        from: "BountyHog",
        to: [user?.email || ""],
        subject: "New submission for " + payload.data.formName,
        html: `
         You have a new submission for ${payload.data.formName}. View it here: https://bountyhog.com/
        `,
      });
      console.log("Email sent to user", user?.email);

      return data;
    } catch (error) {
      return { error };
    }
  } catch (error: any) {
    console.error("Error processing Tally webhook:", error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to process webhook",
    });
  }
});
