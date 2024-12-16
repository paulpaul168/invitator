-- CreateTable
CREATE TABLE "Invite" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "accepted" TEXT NOT NULL,
    "plusOne" INTEGER NOT NULL,
    "phone" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Invite_fullName_key" ON "Invite"("fullName");

-- CreateIndex
CREATE UNIQUE INDEX "Invite_token_key" ON "Invite"("token");
