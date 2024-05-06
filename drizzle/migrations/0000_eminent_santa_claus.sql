CREATE TABLE `organizations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`website` text,
	`slug` text NOT NULL,
	`email` text,
	`logo` text,
	`db_url` text,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`productId` text NOT NULL,
	`productName` text,
	`variantId` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` text NOT NULL,
	`isUsageBased` integer DEFAULT false,
	`interval` text,
	`intervalCount` integer,
	`trialInterval` text,
	`trialIntervalCount` integer,
	`sort` integer
);
--> statement-breakpoint
CREATE TABLE `subscription` (
	`id` text PRIMARY KEY NOT NULL,
	`lemonSqueezyId` text NOT NULL,
	`orderId` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`status` text NOT NULL,
	`statusFormatted` text NOT NULL,
	`renewsAt` text,
	`endsAt` text,
	`trialEndsAt` text,
	`price` text NOT NULL,
	`isUsageBased` integer DEFAULT false,
	`isPaused` integer DEFAULT false,
	`subscriptionItemId` text,
	`organizationId` text NOT NULL,
	`planId` text NOT NULL,
	FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`planId`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`avatar` text,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`updated_at` integer DEFAULT (cast(unixepoch() as int))
);
--> statement-breakpoint
CREATE TABLE `users_to_organizations` (
	`userId` text,
	`organizationId` text,
	`role` text NOT NULL,
	PRIMARY KEY(`organizationId`, `userId`),
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`organizationId`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `webhookEvent` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`eventName` text NOT NULL,
	`processed` integer DEFAULT false,
	`body` text NOT NULL,
	`processingError` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `slug_idx` ON `organizations` (`slug`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `organizations` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `plans_variantId_unique` ON `plans` (`variantId`);--> statement-breakpoint
CREATE UNIQUE INDEX `subscription_lemonSqueezyId_unique` ON `subscription` (`lemonSqueezyId`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);