CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`emp_code` text UNIQUE NOT NULL,
	`name` text NOT NULL,
	`email` text UNIQUE NOT NULL,
	`password` text NOT NULL,
	`role` text NOT NULL,
	`phone` text UNIQUE NOT NULL,
	`last_login_at` integer NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	-- Force user to change password on first login
	`force_password_change` INTEGER DEFAULT 0 CHECK(`force_password_change` IN (0, 1)),
	-- User has confirmed their email/account
	`is_verified` INTEGER DEFAULT 0 CHECK(`is_verified` IN (0, 1)),
	-- User is disabled or not
	`is_disabled` INTEGER DEFAULT 0 CHECK(`is_disabled` IN (0, 1))
);

CREATE INDEX `idx_user_email` ON `user` (`email`);

CREATE INDEX `idx_user_phone` ON `user` (`phone`);

CREATE INDEX `idx_user_emp_code` ON `user` (`emp_code`);

CREATE UNIQUE INDEX `composite_user_email_phone` ON `user` (`email`, `phone`);