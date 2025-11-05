-- -- /*
-- --   Warnings:

-- --   - Changed the column `role` on the `User` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

-- -- */
-- -- -- AlterEnum
-- -- ALTER TYPE "Role" ADD VALUE 'DEFAULT';

-- -- -- AlterTable
-- -- ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT ARRAY['USER']::"Role"[],
-- -- -- ALTER COLUMN "role" SET DATA TYPE "Role"[];
-- -- -- THE CRUCIAL FIX IS HERE: adding the USING clause
-- -- ALTER COLUMN "role" SET DATA TYPE "Role"[] USING ARRAY["role"]::"Role"[];

-- /*
--   Warnings:

--   - Changed the column `role` on the `User` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

-- */
-- -- AlterEnum
-- ALTER TYPE "Role" ADD VALUE 'DEFAULT';

-- -- Step 1: Change the type and migrate existing data.
-- ALTER TABLE "User" 
--   ALTER COLUMN "role" SET DATA TYPE "Role"[] USING ARRAY["role"]::"Role"[];

-- -- Step 2: Set the new default value separately.
-- ALTER TABLE "User" 
--   ALTER COLUMN "role" SET DEFAULT ARRAY['USER']::"Role"[];
/*
  Warnings:

  - Changed the column `role` on the `User` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'DEFAULT';

-- Step 1: Temporarily drop the NOT NULL constraint and the old default, if they exist.
-- Prisma generally handles NOT NULL, but explicitly dropping the default can solve the P3006 error.
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;

-- Step 2: Change the column type and migrate existing data. (CRUCIAL STEP)
ALTER TABLE "User" 
  ALTER COLUMN "role" SET DATA TYPE "Role"[] USING ARRAY["role"]::"Role"[];

-- Step 3: Set the new default value.
ALTER TABLE "User" 
  ALTER COLUMN "role" SET DEFAULT ARRAY['USER']::"Role"[];

-- Note: Depending on your database state, you may also need to check/set NOT NULL again, 
-- but Prisma usually handles that through the schema.prisma file itself.