CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`content` text,
	`html` text,
	`lexical` text,
	`featured_image` text,
	`excerpt` text,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int)),
	`published` integer DEFAULT false,
	`published_at` integer,
	`author_id` text NOT NULL,
	`meta_title` text,
	`meta_description` text,
	`og_image` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `author_id_idx` ON `posts` (`author_id`);