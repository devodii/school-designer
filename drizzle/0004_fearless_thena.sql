ALTER TABLE "auth" ALTER COLUMN "access_token" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "auth" ALTER COLUMN "refresh_token" DROP NOT NULL;