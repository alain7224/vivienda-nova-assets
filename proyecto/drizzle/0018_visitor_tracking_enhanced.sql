ALTER TABLE `siteVisits`
  ADD `propertyId` int,
  ADD `referrer` varchar(500),
  ADD `deviceType` enum('mobile','tablet','desktop'),
  ADD `actionType` enum('view','scroll','contact','reserve') NOT NULL DEFAULT 'view',
  ADD `scrollDepth` int;
ALTER TABLE `siteVisits`
  ADD INDEX `site_visits_property_idx` (`propertyId`),
  ADD INDEX `site_visits_action_idx` (`actionType`);
