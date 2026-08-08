CREATE TABLE `breeds` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`origin` text,
	`temperament` text,
	`life_span` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `breeds_name_unique` ON `breeds` (`name`);--> statement-breakpoint
ALTER TABLE `cats` ADD `breed_id` text REFERENCES breeds(id);