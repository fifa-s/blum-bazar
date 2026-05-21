CREATE TABLE IF NOT EXISTS `listings` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `itemName` TEXT NOT NULL,
  `itemDescription` TEXT,
  `itemCategory` TEXT NOT NULL,
  `itemPrice` INTEGER NOT NULL,
  `contactName` TEXT,
  `contactEmail` TEXT NOT NULL,
  `listingState` TEXT NOT NULL
);
