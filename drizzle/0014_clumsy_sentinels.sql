ALTER TABLE "feedback" DROP CONSTRAINT "feedback_file_upload_id_file_upload_id_fk";
--> statement-breakpoint
ALTER TABLE "feedback" ADD COLUMN "file_ids" varchar[];--> statement-breakpoint
ALTER TABLE "feedback" DROP COLUMN "file_upload_id";