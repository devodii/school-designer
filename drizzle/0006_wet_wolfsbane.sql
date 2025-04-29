CREATE TYPE "public"."auth_provider" AS ENUM('EMAIL', 'GOOGLE');--> statement-breakpoint
ALTER TABLE "auth" ADD COLUMN "provider" "auth_provider";