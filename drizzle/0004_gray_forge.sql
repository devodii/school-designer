ALTER TYPE "public"."level" RENAME TO "education_level";--> statement-breakpoint
CREATE TABLE "profile" (
	"id" varchar PRIMARY KEY NOT NULL,
	"full_name" varchar NOT NULL,
	"picture_url" varchar NOT NULL,
	"school_name" varchar NOT NULL,
	"account_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "profile" TO "education_level";--> statement-breakpoint
DROP TYPE "public"."classroom_activity_type";--> statement-breakpoint
CREATE TYPE "public"."classroom_activity_type" AS ENUM('NOTE', 'PLAN', 'ASSIGNMENT', 'NEW_MEMBER');--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "level";