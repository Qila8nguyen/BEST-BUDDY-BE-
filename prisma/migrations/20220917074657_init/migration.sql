-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "userName" TEXT NOT NULL,
    "message" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Notification_id_key" ON "Notification"("id");
