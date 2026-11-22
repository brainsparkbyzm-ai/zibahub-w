/*
  Warnings:

  - A unique constraint covering the columns `[source,externalId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Job" ADD COLUMN     "externalCompanyName" TEXT,
ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "sourceUrl" TEXT,
ALTER COLUMN "companyId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Job_source_idx" ON "public"."Job"("source");

-- CreateIndex
CREATE UNIQUE INDEX "Job_source_externalId_key" ON "public"."Job"("source", "externalId");
