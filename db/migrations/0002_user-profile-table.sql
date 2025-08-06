CREATE TABLE `user_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text UNIQUE NOT NULL,
	
	-- Address Information
	`address` text NULL,
	`city` text NULL,
	`state` text NULL,
	`country` text NULL,
	`zipcode` text NULL,

	-- Personal Information
	`employee_photo_url` text NULL,
	`personal_email` text NULL,
	`date_of_birth` integer NULL, -- Unix timestamp
	`gender` text NULL, -- 'Male', 'Female', 'Other', 'Prefer not to say'
	`marital_status` text NULL, -- 'Single', 'Married', 'Divorced', 'Widowed'

	-- Employment Information
	`designation_id` text NULL NOT NULL,
	`department_id` text NULL NOT NULL,
	`employment_type` text NOT NULL,
	`work_location` text NOT NULL,
	`date_of_joining` integer NULL,
	`date_of_leaving` integer NULL,

	-- JSON Fields for Grouped Data
	`emergency_contact_details` text NULL, -- JSON: {name, phone, relationship}
	`hr_and_compliance` text NULL, -- JSON: {pan_number, aadhar_number, passport_number, visa_status}
	`payroll_details` text NULL, -- JSON: {bank_account_number, bank_name, ifsc_code, pf_number}

	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`created_by` text NOT NULL,
	`updated_by` text NOT NULL,
	-- Foreign key constraints
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`designation_id`) REFERENCES `designation`(`id`) ON UPDATE restrict ON DELETE restrict,
	FOREIGN KEY (`department_id`) REFERENCES `department`(`id`) ON UPDATE restrict ON DELETE restrict
);

CREATE INDEX `idx_user_profile_user_id` ON `user_profile` (`user_id`);

CREATE INDEX `idx_user_profile_foreign_keys` ON `user_profile` (`user_id`, `designation_id`, `department_id`);

CREATE INDEX `idx_user_profile_employment` ON `user_profile` (`employment_type`, `work_location`);
