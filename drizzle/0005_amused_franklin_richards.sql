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
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp (3)
);
--> statement-breakpoint
ALTER TABLE "classroom_invite" ADD CONSTRAINT "classroom_invite_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_member" ADD CONSTRAINT "classroom_member_classroom_id_classroom_id_fk" FOREIGN KEY ("classroom_id") REFERENCES "public"."classroom"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_member" ADD CONSTRAINT "classroom_member_account_id_account_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom" ADD CONSTRAINT "classroom_owner_id_account_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."account"("id") ON DELETE no action ON UPDATE no action;