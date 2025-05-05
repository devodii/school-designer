CREATE TYPE "public"."subscription_frequency" AS ENUM('MONTHLY', 'YEARLY');--> statement-breakpoint
CREATE TABLE "checkout_session" (
	"id" varchar PRIMARY KEY NOT NULL,
	"account_id" varchar NOT NULL,
	"provider_id" varchar NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" varchar PRIMARY KEY NOT NULL,
	"provider_id" varchar NOT NULL,
	"account_id" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"status" varchar,
	"frequency" "subscription_frequency",
	"metadata" jsonb,
	"checkout_session_id" varchar,
	"expires_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "auth" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "checkout_session" ADD CONSTRAINT "checkout_session_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_checkout_session_id_checkout_session_id_fk" FOREIGN KEY ("checkout_session_id") REFERENCES "public"."checkout_session"("id") ON DELETE no action ON UPDATE no action;