ALTER TABLE `vendors`
  ADD `publicationAuthorized` int NOT NULL DEFAULT 0,
  ADD `authorizationNote` text NULL;

ALTER TABLE `properties`
  ADD `descriptionMode` enum('auto','compact','scroll','full') NOT NULL DEFAULT 'auto',
  ADD `descriptionHeight` int NOT NULL DEFAULT 260,
  ADD `featured` int NOT NULL DEFAULT 0;

ALTER TABLE `siteSettings`
  MODIFY `cardStyle` enum('flat','three_d','shadow','frame') NOT NULL DEFAULT 'flat',
  ADD `relatedPropertiesCount` int NOT NULL DEFAULT 5;

CREATE TABLE `propertySections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(140) NOT NULL,
  `subtitle` varchar(280) NOT NULL DEFAULT '',
  `placement` enum('home','property') NOT NULL DEFAULT 'home',
  `propertyIds` text NOT NULL,
  `cardStyle` enum('flat','three_d','shadow','frame') NOT NULL DEFAULT 'shadow',
  `background` varchar(24) NOT NULL DEFAULT '#eef2ee',
  `active` int NOT NULL DEFAULT 1,
  `sortOrder` int NOT NULL DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `property_sections_placement_idx` (`placement`)
);
