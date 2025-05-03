ALTER TYPE "public"."fileUploadType" ADD VALUE 'PDF';--> statement-breakpoint
CREATE TABLE "timetable" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"file_ids" text[] NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"account_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;