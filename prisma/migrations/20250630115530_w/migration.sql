-- AlterTable
ALTER TABLE "JobApplication" ALTER COLUMN "experienceRequired" DROP NOT NULL,
ALTER COLUMN "remoteOrOnsite" DROP NOT NULL,
ALTER COLUMN "applicationSource" DROP NOT NULL,
ALTER COLUMN "jobDescription" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL;
