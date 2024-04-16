CREATE TABLE posts (
	id text PRIMARY KEY NOT NULL,
	title text NOT NULL,
	slug text NOT NULL,
	content text,
	created_at integer DEFAULT (cast(unixepoch() as int)),
	updated_at integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE UNIQUE INDEX slug_idx ON posts (slug);