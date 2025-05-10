CREATE TYPE "public"."education_level" AS ENUM('COLLEGE', 'HIGH_SCHOOL');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('EMAIL', 'GOOGLE');--> statement-breakpoint
CREATE TYPE "public"."classroom_activity_type" AS ENUM('NOTE', 'PLAN', 'ASSIGNMENT', 'NEW_MEMBER');--> statement-breakpoint
CREATE TYPE "public"."fileUploadType" AS ENUM('IMAGE', 'PDF');--> statement-breakpoint
CREATE TYPE "public"."subscription_frequency" AS ENUM('MONTHLY', 'YEARLY');--> statement-breakpoint
CREATE TABLE "account" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"referral_code" varchar,
	"education_level" "education_level",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"customer_id" varchar,
	"updated_at" timestamp (3),
	"is_onboarded" boolean DEFAULT false,
	"embedding" vector(1536),
	CONSTRAINT "account_email_unique" UNIQUE("email"),
	CONSTRAINT "account_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
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
CREATE TABLE "auth" (
	"id" varchar PRIMARY KEY NOT NULL,
	"token" varchar NOT NULL,
	"email" varchar NOT NULL,
	"account_id" varchar,
	"used_at" timestamp,
	"expires_at" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"access_token" varchar,
	"refresh_token" varchar,
	"provider" "auth_provider",
	"metadata" jsonb,
	CONSTRAINT "auth_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "classroom_timeline" (
	"id" varchar PRIMARY KEY NOT NULL,
	"classroom_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"text" varchar NOT NULL,
	"account_id" varchar,
	"metadata" jsonb,
	"file_ids" varchar[]
);
--> statement-breakpoint
CREATE TABLE "classroom_member" (
	"id" varchar PRIMARY KEY NOT NULL,
	"classroom_id" varchar,
	"account_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "unique_classroom_account" UNIQUE("classroom_id","account_id")
);
--> statement-breakpoint
CREATE TABLE "classroom" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"invite_code" varchar NOT NULL,
	"instructor" jsonb,
	"owner_id" varchar NOT NULL,
	"subject" varchar NOT NULL,
	"description" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "classroom_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" varchar PRIMARY KEY NOT NULL,
	"file_ids" varchar[],
	"text" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"account_id" varchar
);
--> statement-breakpoint
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
CREATE TABLE "note" (
	"id" varchar PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp (3),
	"account_id" varchar NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "timetable" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"file_ids" text[] NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"deleted_at" timestamp,
	"account_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"feature_request" text,
	"would_pay" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth" ADD CONSTRAINT "fk__account_auth" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_timeline" ADD CONSTRAINT "classroom_timeline_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_timeline" ADD CONSTRAINT "classroom_timeline_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_member" ADD CONSTRAINT "classroom_member_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_member" ADD CONSTRAINT "classroom_member_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_owner_id_account_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_upload" ADD CONSTRAINT "fk__account_file_upload" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note" ADD CONSTRAINT "note_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkout_session" ADD CONSTRAINT "checkout_session_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_checkout_session_id_checkout_session_id_fk" FOREIGN KEY ("checkout_session_id") REFERENCES "public"."checkout_session"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timetable" ADD CONSTRAINT "timetable_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "account" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "email_idx" ON "auth" USING btree ("email");--> statement-breakpoint
CREATE INDEX "token_idx" ON "auth" USING btree ("token");--> statement-breakpoint
CREATE INDEX "account_id_idx" ON "file_upload" USING btree ("account_id");