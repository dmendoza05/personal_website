CREATE TABLE "analytics_dimensions" (
	"window" text NOT NULL,
	"kind" text NOT NULL,
	"key" text NOT NULL,
	"value" integer NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "analytics_dimensions_window_kind_key_pk" PRIMARY KEY("window","kind","key")
);
