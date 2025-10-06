-- Step 1: Add userId column to bounty table (nullable first)
ALTER TABLE "bounty" ADD COLUMN "userId" TEXT;

-- Step 2: Migrate data from company to user relationship
UPDATE "bounty" 
SET "userId" = "company"."userId"
FROM "company"
WHERE "bounty"."companyId" = "company"."id";

-- Step 3: Make userId NOT NULL
ALTER TABLE "bounty" ALTER COLUMN "userId" SET NOT NULL;

-- Step 4: Add foreign key constraint
ALTER TABLE "bounty" ADD CONSTRAINT "bounty_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 5: Drop old company relationship
ALTER TABLE "bounty" DROP CONSTRAINT "bounty_companyId_fkey";
ALTER TABLE "bounty" DROP COLUMN "companyId";

-- Step 6: Drop company table
DROP TABLE "company";

