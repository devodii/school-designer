CREATE TYPE "public"."fileUploadType" AS ENUM('IMAGE');--> statement-breakpoint
CREATE TABLE "file_upload" (
	"id" varchar PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"account_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"type" "fileUploadType" NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "auth" ALTER COLUMN "access_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "auth" ALTER COLUMN "refresh_token" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "file_upload" ADD CONSTRAINT "fk__account_file_upload" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_id_idx" ON "file_upload" USING btree ("account_id");