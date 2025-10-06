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
    headers: event.node.req.headers,
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
    !body.payoutType
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing required fields",
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
        requirements: JSON.stringify(body.requirements || []),
        interviewProcess: body.interviewProcess || null,
        guidelines: body.guidelines || null,
        picture: pictureUrl,
        status: "OPEN",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            companyName: true,
          },
        },
      },
    });

    return bounty;
  } catch (error) {
    console.error("Error creating bounty:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to create bounty",
    });
  }
});
