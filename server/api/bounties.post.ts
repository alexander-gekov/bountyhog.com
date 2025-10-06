import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { promises as fs } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const contentType = getHeader(event, "content-type") || "";

  let body: any;
  let pictureUrl: string | null = null;

  if (contentType.includes("multipart/form-data")) {
    // Handle FormData (with file upload)
    const formData = await readMultipartFormData(event);
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid form data",
      });
    }

    // Parse the JSON data
    const dataField = formData.find((field) => field.name === "data");
    if (!dataField) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing data field",
      });
    }

    body = JSON.parse(dataField.data.toString());

    // Handle picture upload
    const pictureField = formData.find((field) => field.name === "picture");
    if (pictureField && pictureField.filename) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), "public", "uploads", "bounties");
        await fs.mkdir(uploadsDir, { recursive: true });

        // Generate unique filename
        const timestamp = Date.now();
        const extension = pictureField.filename.split(".").pop();
        const filename = `bounty-${timestamp}.${extension}`;
        const filepath = join(uploadsDir, filename);

        // Save the file
        await fs.writeFile(filepath, pictureField.data);

        // Store the public URL
        pictureUrl = `/uploads/bounties/${filename}`;
      } catch (error) {
        console.error("Error saving picture:", error);
        throw createError({
          statusCode: 500,
          statusMessage: "Failed to save picture",
        });
      }
    }
  } else {
    // Handle regular JSON body
    body = await readBody(event);
  }

  // Check authentication
  const session = await auth.api.getSession({
    headers: event.node.req.headers as any,
  });
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  // Validate required fields
  if (
    !body.title ||
    !body.description ||
    !body.guaranteeTimeframe ||
    !body.payoutType ||
    body.salaryMin === null ||
    body.salaryMin === undefined ||
    body.salaryMax === null ||
    body.salaryMax === undefined
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
    });
  }

  // Validate salary range
  if (
    body.salaryMin <= 0 ||
    body.salaryMax <= 0 ||
    body.salaryMax < body.salaryMin
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid salary range",
    });
  }

  // Validate payout
  if (
    body.payoutType === "CASH" &&
    (!body.payoutAmount || body.payoutAmount <= 0)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid cash amount is required",
    });
  }

  if (
    body.payoutType === "PERCENTAGE" &&
    (!body.payoutPercentage || body.payoutPercentage <= 0)
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Valid percentage is required",
    });
  }

  try {
    let tallyFormId: string | null = null;
    let tallyFormUrl: string | null = null;
    let tallyFormPassword: string | null = null;

    if (body.formFields && body.formFields.length > 0 && body.createTallyForm) {
      try {
        const tallyResponse = await $fetch<{
          id: string;
          url: string;
          password: string;
        }>("/api/tally/create-form", {
          method: "POST",
          body: {
            bountyTitle: body.title,
            bountyDescription: body.description,
            formFields: body.formFields,
          },
          headers: event.node.req.headers as any,
        });

        tallyFormId = tallyResponse.id;
        tallyFormUrl = tallyResponse.url;
        tallyFormPassword = tallyResponse.password;
      } catch (tallyError: any) {
        console.error("Failed to create Tally form:", tallyError);
        console.error("Tally error details:", tallyError.message);
        console.error("Tally error stack:", tallyError.stack);
      }
    }

    const bounty = await prisma.bounty.create({
      data: {
        title: body.title,
        description: body.description,
        userId: session.user.id,
        payoutType: body.payoutType,
        payoutAmount: body.payoutAmount || null,
        payoutPercentage: body.payoutPercentage || null,
        guaranteeTimeframe: body.guaranteeTimeframe,
        deadline: body.deadline ? new Date(body.deadline) : null,
        requirements: JSON.stringify([]),
        interviewProcess: body.interviewProcess || null,
        guidelines: body.guidelines || null,
        salaryMin: body.salaryMin,
        salaryMax: body.salaryMax,
        formFields: body.formFields || null,
        tallyFormId: tallyFormId,
        tallyFormUrl: tallyFormUrl,
        tallyFormPassword: tallyFormPassword,
        picture: pictureUrl,
        status: "OPEN",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            companyName: true,
          },
        },
      },
    });

    console.log("Bounty created successfully:", bounty.id);
    return bounty;
  } catch (error: any) {
    console.error("Error creating bounty:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || "Failed to create bounty",
    });
  }
});
