-- CreateTable
CREATE TABLE "ShortendUrl" (
    "id" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "longUrl" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortendUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShortendUrl_shortUrl_key" ON "ShortendUrl"("shortUrl");

-- CreateIndex
CREATE INDEX "ShortendUrl_shortUrl_idx" ON "ShortendUrl"("shortUrl");

-- AddForeignKey
ALTER TABLE "ShortendUrl" ADD CONSTRAINT "ShortendUrl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
