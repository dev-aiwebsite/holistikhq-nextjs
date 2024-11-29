-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "emailedTo" TEXT[],
    "type" TEXT NOT NULL DEFAULT 'task',
    "dataId" TEXT,
    "content" TEXT NOT NULL,
    "appRoute" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
