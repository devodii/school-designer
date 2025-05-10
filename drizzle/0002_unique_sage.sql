CREATE TYPE "public"."classroom_type" AS ENUM('PUBLIC', 'PRIVATE');--> statement-breakpoint
CREATE TABLE "research_action" (
	"id" varchar PRIMARY KEY NOT NULL,
	"research_id" varchar,
	"account_id" varchar,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "research" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"survey_link" varchar NOT NULL,
	"target_audience" text[] NOT NULL,
	"account_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "classroom" DROP CONSTRAINT "classroom_owner_id_account_id_fk";
--> statement-breakpoint
ALTER TABLE "classroom" ADD COLUMN "type" "classroom_type" DEFAULT 'PUBLIC' NOT NULL;--> statement-breakpoint
ALTER TABLE "research_action" ADD CONSTRAINT "research_action_research_id_research_id_fk" FOREIGN KEY ("research_id") REFERENCES "public"."research"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_action" ADD CONSTRAINT "research_action_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research" ADD CONSTRAINT "research_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_owner_id_account_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;