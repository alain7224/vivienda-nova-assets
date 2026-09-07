ALTER TABLE `siteSettings`
  ADD `whatsappEnabled` int NOT NULL DEFAULT 0,
  ADD `whatsappPhone` varchar(32) NOT NULL DEFAULT '',
  ADD `whatsappMessage` varchar(500) NOT NULL DEFAULT 'Hola, me interesa una vivienda de Vivienda Nova.',
  ADD `whatsappStyle` enum('round','outlined','pill') NOT NULL DEFAULT 'round',
  ADD `whatsappAnimationEnabled` int NOT NULL DEFAULT 1,
  ADD `whatsappAnimationSeconds` int NOT NULL DEFAULT 30;
