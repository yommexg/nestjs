/*
  Warnings:

  - You are about to drop the `JwtUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "JwtUser";

-- CreateTable
CREATE TABLE "jwt-users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "hashedRt" TEXT,

    CONSTRAINT "jwt-users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "jwt-users_email_key" ON "jwt-users"("email");
