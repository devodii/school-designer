CREATE TYPE "public"."level" AS ENUM('COLLEGE', 'HIGH SCHOOL');--> statement-breakpoint
CREATE TYPE "public"."auth_provider" AS ENUM('EMAIL', 'GOOGLE');--> statement-breakpoint
CREATE TYPE "public"."fileUploadType" AS ENUM('IMAGE');--> statement-breakpoint
CREATE TABLE "account" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"referral_code" varchar,
	"level" "level",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"profile" jsonb,
	"is_onboarded" boolean DEFAULT false,
	CONSTRAINT "account_email_unique" UNIQUE("email"),
	CONSTRAINT "account_referral_code_unique" UNIQUE("referral_code")
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
	CONSTRAINT "auth_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "classroom_invite" (
	"id" varchar PRIMARY KEY NOT NULL,
	"classroom_id" varchar,
	"email" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom_member" (
	"id" varchar PRIMARY KEY NOT NULL,
	"classroom_id" varchar,
	"account_id" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classroom" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"invite_code" varchar NOT NULL,
	"owner_id" varchar,
	"subject" varchar NOT NULL,
	"description" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "classroom_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" varchar PRIMARY KEY NOT NULL,
	"file_upload_id" varchar,
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
CREATE TABLE "waitlist" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"feature_request" text,
	"would_pay" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auth" ADD CONSTRAINT "fk__account_auth" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_invite" ADD CONSTRAINT "classroom_invite_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_member" ADD CONSTRAINT "classroom_member_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_member" ADD CONSTRAINT "classroom_member_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_owner_id_account_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_file_upload_id_file_upload_id_fk" FOREIGN KEY ("file_upload_id") REFERENCES "public"."file_upload"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_upload" ADD CONSTRAINT "fk__account_file_upload" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_idx" ON "auth" USING btree ("email");--> statement-breakpoint
CREATE INDEX "token_idx" ON "auth" USING btree ("token");--> statement-breakpoint
CREATE INDEX "account_id_idx" ON "file_upload" USING btree ("account_id");