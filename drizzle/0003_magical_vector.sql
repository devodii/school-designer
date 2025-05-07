ALTER TYPE "public"."classroom_activity_type" ADD VALUE 'NEW_MEMBER';--> statement-breakpoint
ALTER TABLE "classroom_timeline" ADD COLUMN "file_ids" varchar[];