-- AlterTable
ALTER TABLE "public"."recruiter_collaboration" ADD COLUMN     "introduction" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING';
