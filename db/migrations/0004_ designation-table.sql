CREATE TABLE `designation` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text UNIQUE NOT NULL,
	`description` text NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	`is_disabled` INTEGER DEFAULT 0 CHECK(`is_disabled` IN (0, 1))
);

CREATE INDEX `idx_designation_name` ON `designation` (`name`);