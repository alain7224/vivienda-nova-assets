ALTER TABLE `properties`
  MODIFY `linkMode` enum('capture','redirect','both') NOT NULL DEFAULT 'capture';
