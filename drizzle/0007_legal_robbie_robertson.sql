ALTER TABLE "account" ALTER COLUMN "level" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."level";--> statement-breakpoint
CREATE TYPE "public"."level" AS ENUM('COLLEGE', 'HIGH SCHOOL');--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "level" SET DATA TYPE "public"."level" USING "level"::"public"."level";