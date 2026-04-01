CREATE TABLE `userPasswords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`email` varchar(320) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`passwordResetToken` varchar(255),
	`passwordResetExpiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPasswords_id` PRIMARY KEY(`id`),
	CONSTRAINT `userPasswords_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `userPasswords_email_unique` UNIQUE(`email`)
);
