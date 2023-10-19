-- CreateTable
CREATE TABLE "AccessTokens" (
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AccessTokens_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccessTokens_token_key" ON "AccessTokens"("token");

-- AddForeignKey
ALTER TABLE "AccessTokens" ADD CONSTRAINT "AccessTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
