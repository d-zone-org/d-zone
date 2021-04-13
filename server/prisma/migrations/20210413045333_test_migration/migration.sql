-- CreateTable
CREATE TABLE "ChatChannel" (
    "id" TEXT NOT NULL,
    "module" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatChannel.id_unique" ON "ChatChannel"("id");
