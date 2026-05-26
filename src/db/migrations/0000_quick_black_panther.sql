CREATE TABLE `listings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`itemName` text NOT NULL,
	`itemDescription` text,
	`itemCategory` text NOT NULL,
	`itemPrice` integer NOT NULL,
	`contactName` text NOT NULL,
	`contactEmail` text NOT NULL,
	`listingState` text NOT NULL,
	`imagePath` text
);
--> statement-breakpoint
CREATE TABLE `systemSetting` (
	`name` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
