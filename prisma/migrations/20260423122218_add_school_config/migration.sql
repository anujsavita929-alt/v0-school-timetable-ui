-- CreateTable
CREATE TABLE "SchoolConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "schoolName" TEXT NOT NULL,
    "totalPeriodsPerDay" INTEGER NOT NULL DEFAULT 8,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "BellTime" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "periodNumber" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isBreak" BOOLEAN NOT NULL DEFAULT false,
    "breakLabel" TEXT,
    "schoolConfigId" TEXT NOT NULL,
    CONSTRAINT "BellTime_schoolConfigId_fkey" FOREIGN KEY ("schoolConfigId") REFERENCES "SchoolConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Lab" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "capacity" INTEGER,
    "labType" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "schoolConfigId" TEXT NOT NULL,
    CONSTRAINT "Lab_schoolConfigId_fkey" FOREIGN KEY ("schoolConfigId") REFERENCES "SchoolConfig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "BellTime_schoolConfigId_periodNumber_key" ON "BellTime"("schoolConfigId", "periodNumber");
