CREATE TABLE "waitlist" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"study_challenge" text,
	"would_pay" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
