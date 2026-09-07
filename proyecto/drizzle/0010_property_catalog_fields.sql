ALTER TABLE `properties` ADD `referenceCode` varchar(120);
ALTER TABLE `properties` ADD `sourcePrice` varchar(80);
ALTER TABLE `properties` ADD `sourceUrl` text;
ALTER TABLE `properties` ADD `sortOrder` int DEFAULT 0 NOT NULL;
CREATE INDEX `properties_sort_order_idx` ON `properties` (`sortOrder`,`priceValue`);
