ALTER TABLE `listings` ADD `authorId` text NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `listings` ADD `reservedById` text REFERENCES users(id);