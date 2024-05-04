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
CREATE TABLE `webhookEvent` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch() as int)),
	`eventName` text NOT NULL,
	`processed` integer DEFAULT false,
	`body` text NOT NULL,
	`processingError` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscription_lemonSqueezyId_unique` ON `subscription` (`lemonSqueezyId`);