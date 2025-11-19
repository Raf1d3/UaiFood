-- DropForeignKey
ALTER TABLE "public"."Order" DROP CONSTRAINT "Order_clientId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
