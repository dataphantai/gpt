-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleSignIn" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "password" DROP NOT NULL;
