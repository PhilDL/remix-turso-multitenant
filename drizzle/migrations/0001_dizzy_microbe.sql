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
CREATE UNIQUE INDEX `plans_variantId_unique` ON `plans` (`variantId`);