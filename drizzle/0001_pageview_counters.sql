CREATE TABLE "page_view_counts" (
	"path" text PRIMARY KEY NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "page_view_daily" (
	"path" text NOT NULL,
	"day" date NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "page_view_daily_path_day_pk" PRIMARY KEY("path","day")
);
--> statement-breakpoint
INSERT INTO "page_view_counts" ("path", "view_count", "updated_at")
SELECT
	"path",
	COUNT(*)::integer,
	MAX("created_at")
FROM "page_views"
GROUP BY "path";
--> statement-breakpoint
INSERT INTO "page_view_daily" ("path", "day", "view_count")
SELECT
	"path",
	("created_at" AT TIME ZONE 'UTC')::date,
	COUNT(*)::integer
FROM "page_views"
GROUP BY "path", ("created_at" AT TIME ZONE 'UTC')::date;
--> statement-breakpoint
DROP TABLE "page_views";
