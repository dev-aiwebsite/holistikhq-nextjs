-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isLogin" BOOLEAN,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "roles" TEXT[];
