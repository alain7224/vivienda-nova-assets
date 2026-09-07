ALTER TABLE `siteSettings`
  ADD `cryptoEnabled` int NOT NULL DEFAULT 0,
  ADD `cryptoAcceptedTypes` text;
ALTER TABLE `siteSettings`
  MODIFY `cardStyle` enum('flat','three_d','shadow','frame','grid','minimal') NOT NULL DEFAULT 'flat';
ALTER TABLE `propertySections`
  MODIFY `cardStyle` enum('flat','three_d','shadow','frame','grid','minimal') NOT NULL DEFAULT 'shadow';
