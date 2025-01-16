-- CreateTable
CREATE TABLE "Excel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "file" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Excel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Excel" ADD CONSTRAINT "Excel_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
