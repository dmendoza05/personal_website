CREATE TABLE "analytics_daily" (
	"day" date PRIMARY KEY NOT NULL,
	"unique_visitors" integer NOT NULL,
	"page_visits" integer NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "analytics_rollups" (
	"window" text PRIMARY KEY NOT NULL,
	"start_day" date NOT NULL,
	"end_day" date NOT NULL,
	"unique_visitors" integer NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
