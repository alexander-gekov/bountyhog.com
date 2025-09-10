-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "userType" TEXT NOT NULL DEFAULT 'COMPANY',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "expiresAt" DATETIME NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" DATETIME,
    "refreshTokenExpiresAt" DATETIME,
    "scope" TEXT,
    "password" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recruiter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "experience" TEXT,
    "specialties" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "recruiter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bounty" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "payoutType" TEXT NOT NULL,
    "payoutAmount" REAL,
    "payoutPercentage" REAL,
    "guaranteeTimeframe" TEXT NOT NULL,
    "deadline" DATETIME,
    "requirements" TEXT NOT NULL,
    "interviewProcess" TEXT,
    "guidelines" TEXT,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "formFields" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bounty_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "recruiter_collaboration" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bountyId" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "isUnlocked" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "recruiter_collaboration_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "bounty" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "recruiter_collaboration_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "bounty_note" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bountyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "bounty_note_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "bounty" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "bounty_note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "submission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bountyId" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "candidateEmail" TEXT,
    "formData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "feedback" TEXT,
    "isHired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "submission_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "bounty" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "submission_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "submission_file" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "submissionId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "submission_file_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submission" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "payout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bountyId" TEXT NOT NULL,
    "recruiterId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" DATETIME,
    "dueDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "payout_bountyId_fkey" FOREIGN KEY ("bountyId") REFERENCES "bounty" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "payout_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "recruiter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "company_userId_key" ON "company"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "recruiter_userId_key" ON "recruiter"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "recruiter_collaboration_bountyId_recruiterId_key" ON "recruiter_collaboration"("bountyId", "recruiterId");
