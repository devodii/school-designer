ALTER TABLE "account" ALTER COLUMN "education_level" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."education_level";--> statement-breakpoint
CREATE TYPE "public"."education_level" AS ENUM('ELEMENTARY_SCHOOL', 'HIGH_SCHOOL', 'COLLEGE', 'RESEARCHER');--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "education_level" SET DATA TYPE "public"."education_level" USING "education_level"::"public"."education_level";