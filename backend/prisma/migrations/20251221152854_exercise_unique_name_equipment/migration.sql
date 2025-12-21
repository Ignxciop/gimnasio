-- DropIndex
DROP INDEX "Exercise_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Exercise_name_equipmentId_key" ON "Exercise"("name", "equipmentId");
