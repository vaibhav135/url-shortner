/*
  Warnings:

  - A unique constraint covering the columns `[longUrl]` on the table `ShortendUrl` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ShortendUrl_longUrl_key" ON "ShortendUrl"("longUrl");
