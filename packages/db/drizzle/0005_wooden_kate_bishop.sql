CREATE TABLE `feeding_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`cat_id` text NOT NULL,
	`fed_date` text NOT NULL,
	`meal_type` text NOT NULL,
	`amount_given` real,
	`amount_left` real,
	`memo` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`cat_id`) REFERENCES `cats`(`id`) ON UPDATE no action ON DELETE cascade
);
