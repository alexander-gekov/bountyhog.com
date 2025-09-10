-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('COMPANY', 'RECRUITER');

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "userType" "public"."UserType" NOT NULL DEFAULT 'COMPANY';
