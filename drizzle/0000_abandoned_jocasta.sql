CREATE TABLE "account" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"referral_code" varchar,
	"level" "level",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	"profile" jsonb,
	CONSTRAINT "account_email_unique" UNIQUE("email"),
	CONSTRAINT "account_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "auth" (
	"id" varchar PRIMARY KEY NOT NULL,
	"token" varchar NOT NULL,
	"email" varchar NOT NULL,
	"account_id" varchar NOT NULL,
	"used_at" timestamp,
	"expires_at" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3),
	CONSTRAINT "auth_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "auth" ADD CONSTRAINT "fk__account_auth" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_idx" ON "auth" USING btree ("email");--> statement-breakpoint
CREATE INDEX "token_idx" ON "auth" USING btree ("token");