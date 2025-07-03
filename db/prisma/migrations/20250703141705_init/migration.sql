-- CreateEnum
CREATE TYPE "Step" AS ENUM ('PRODUCED', 'SHIPPED', 'RECEIVED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('MANUFACTURER', 'SUPPLIER', 'DISTRIBUTOR', 'RETAILER');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('FOOD', 'ELECTRONICS', 'MEDICINE', 'FASHION', 'OTHER');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "category" "Category" NOT NULL,
    "manufacturerKey" TEXT NOT NULL,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pubKey" TEXT NOT NULL,
    "role" "RoleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTrack" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "step" "Step" NOT NULL,
    "location" TEXT NOT NULL,
    "holder" TEXT NOT NULL,
    "message" TEXT,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductUpdate" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "signatures" JSONB NOT NULL,
    "txHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_batchId_key" ON "Product"("batchId");

-- CreateIndex
CREATE UNIQUE INDEX "Participant_pubKey_key" ON "Participant"("pubKey");

-- AddForeignKey
ALTER TABLE "ProductTrack" ADD CONSTRAINT "ProductTrack_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Product"("batchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductUpdate" ADD CONSTRAINT "ProductUpdate_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Product"("batchId") ON DELETE RESTRICT ON UPDATE CASCADE;
