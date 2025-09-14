import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { promises as fs } from "fs";
import { join } from "path";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const collaborationId = getRouterParam(event, "id");

  if (!collaborationId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Collaboration ID is required",
    });
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

  // Check if user is a recruiter
  if (session.user.userType !== "RECRUITER") {
    throw createError({
      statusCode: 403,
      statusMessage: "Only recruiters can submit candidates",
    });
  }

  try {
    // Get recruiter profile
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: session.user.id },
    });

    if (!recruiter) {
      throw createError({
        statusCode: 404,
        statusMessage: "Recruiter profile not found",
      });
    }

    // Verify the collaboration exists and belongs to this recruiter
    const collaboration = await prisma.recruiterCollaboration.findUnique({
      where: { id: collaborationId },
      include: {
        bounty: {
          include: {
            company: {
              include: {
                user: true,
              },
            },
          },
        },
        recruiter: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!collaboration) {
      throw createError({
        statusCode: 404,
        statusMessage: "Collaboration not found",
      });
    }

    if (collaboration.recruiterId !== recruiter.id) {
      throw createError({
        statusCode: 403,
        statusMessage:
          "You can only submit candidates for your own collaborations",
      });
    }

    // Check if collaboration is approved/unlocked
    if (!collaboration.isUnlocked) {
      throw createError({
        statusCode: 403,
        statusMessage:
          "Collaboration must be approved before submitting candidates",
      });
    }

    // Parse form data
    const formData = await readMultipartFormData(event);
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid form data",
      });
    }

    // Extract form fields
    const candidateNameField = formData.find(
      (field) => field.name === "candidateName"
    );
    const candidateEmailField = formData.find(
      (field) => field.name === "candidateEmail"
    );
    const notesField = formData.find((field) => field.name === "notes");
    const fileField = formData.find((field) => field.name === "file");

    if (!candidateNameField) {
      throw createError({
        statusCode: 400,
        statusMessage: "Candidate name is required",
      });
    }

    if (!fileField || !fileField.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: "CV/Resume file is required",
      });
    }

    const candidateName = candidateNameField.data.toString();
    const candidateEmail = candidateEmailField?.data.toString() || "";
    const notes = notesField?.data.toString() || "";

    // Handle file upload
    let filePath = "";
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = join(
        process.cwd(),
        "public",
        "uploads",
        "submissions"
      );
      await fs.mkdir(uploadsDir, { recursive: true });

      // Generate unique filename
      const timestamp = Date.now();
      const extension = fileField.filename.split(".").pop();
      const filename = `submission-${timestamp}.${extension}`;
      const fullPath = join(uploadsDir, filename);

      // Save the file
      await fs.writeFile(fullPath, fileField.data);

      // Store the public URL
      filePath = `/uploads/submissions/${filename}`;
    } catch (error) {
      console.error("Error saving file:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to save uploaded file",
      });
    }

    // Create submission record
    const submission = await prisma.submission.create({
      data: {
        bountyId: collaboration.bountyId,
        recruiterId: recruiter.id,
        collaborationId: collaborationId,
        candidateName: candidateName,
        candidateEmail: candidateEmail,
        formData: {
          notes: notes,
        },
        files: {
          create: {
            fileName: fileField.filename,
            fileSize: fileField.data.length,
            fileType: fileField.type || "application/octet-stream",
            filePath: filePath,
          },
        },
        status: "PENDING",
      },
      include: {
        files: true,
        bounty: true,
        recruiter: {
          include: {
            user: true,
          },
        },
      },
    });

    // Create notification for the company
    await prisma.notification.create({
      data: {
        userId: collaboration.bounty.company.userId,
        type: "PARTNERSHIP_REQUEST", // Reusing existing enum, could add CANDIDATE_SUBMITTED
        title: "New Candidate Submission",
        message: `${collaboration.recruiter.user.name} submitted a candidate "${candidateName}" for bounty "${collaboration.bounty.title}".`,
        data: {
          submissionId: submission.id,
          bountyId: collaboration.bountyId,
          bountyTitle: collaboration.bounty.title,
          candidateName: candidateName,
          recruiterName: collaboration.recruiter.user.name,
          collaborationId: collaborationId,
        },
      },
    });

    return {
      success: true,
      submission: {
        id: submission.id,
        candidateName: submission.candidateName,
        candidateEmail: submission.candidateEmail,
        status: submission.status,
        createdAt: submission.createdAt,
      },
    };
  } catch (error) {
    console.error("Error submitting candidate:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit candidate",
    });
  }
});
