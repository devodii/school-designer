CREATE TABLE "feedback" (
	"id" varchar PRIMARY KEY NOT NULL,
	"file_upload_id" varchar,
	"text" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"account_id" varchar
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_file_upload_id_file_upload_id_fk" FOREIGN KEY ("file_upload_id") REFERENCES "public"."file_upload"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;