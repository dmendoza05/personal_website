ALTER TABLE "ad_reactions" ADD COLUMN "ad" text;
--> statement-breakpoint
UPDATE "ad_reactions" SET "ad" = 'i-need-a-job' WHERE "ad" IS NULL;
--> statement-breakpoint
ALTER TABLE "ad_reactions" ALTER COLUMN "ad" SET NOT NULL;
