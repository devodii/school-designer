CREATE TYPE "public"."classroom_activity_type" AS ENUM('NOTE', 'PLAN', 'HOMEWORK');--> statement-breakpoint
CREATE TABLE "classroom_activity" (
	"id" varchar PRIMARY KEY NOT NULL,
	"classroom_id" varchar,
	"account_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"type" "classroom_activity_type" NOT NULL,
	"metadata" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom_timeline" (
	"id" varchar PRIMARY KEY NOT NULL,
	"classroom_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"text" varchar NOT NULL,
	"account_id" varchar
);
--> statement-breakpoint
ALTER TABLE "classroom_invite" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "classroom_invite" CASCADE;--> statement-breakpoint
ALTER TABLE "classroom" ALTER COLUMN "owner_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "classroom_activity" ADD CONSTRAINT "classroom_activity_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_activity" ADD CONSTRAINT "classroom_activity_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_timeline" ADD CONSTRAINT "classroom_timeline_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_timeline" ADD CONSTRAINT "classroom_timeline_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;