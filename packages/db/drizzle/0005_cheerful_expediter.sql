CREATE TABLE `feeding_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`cat_id` text NOT NULL,
	`amount` real,
	`food_type` text,
	`memo` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`cat_id`) REFERENCES `cats`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `poop_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`cat_id` text NOT NULL,
	`condition` text,
	`memo` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`cat_id`) REFERENCES `cats`(`id`) ON UPDATE no action ON DELETE cascade
);
