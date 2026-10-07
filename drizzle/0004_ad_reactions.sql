CREATE TABLE "ad_reactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"vote" text NOT NULL,
	"path" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
