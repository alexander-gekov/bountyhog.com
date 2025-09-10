-- AlterTable
ALTER TABLE "public"."submission" ADD COLUMN     "collaborationId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."submission" ADD CONSTRAINT "submission_collaborationId_fkey" FOREIGN KEY ("collaborationId") REFERENCES "public"."recruiter_collaboration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
