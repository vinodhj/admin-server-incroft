CREATE TABLE `user_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text UNIQUE NOT NULL,
	`address` text NULL,
	`city` text NULL,
	`state` text NULL,
	`country` text NULL,
	`zipcode` text NULL,
	`designation_id` text NULL NOT NULL,
	`department_id` text NULL NOT NULL,
	`date_of_joining` integer NULL,
	`date_of_leaving` integer NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	-- Foreign key constraints
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY (`designation_id`) REFERENCES `department`(`id`) ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY (`department_id`) REFERENCES `designation`(`id`) ON UPDATE restrict ON DELETE restrict
    
);

CREATE INDEX `idx_user_profile_user_id` ON `user_profile` (`user_id`);

CREATE INDEX `idx_user_profile_foreign_keys` ON `user_profile` (`user_id`, `designation_id`, `department_id`);