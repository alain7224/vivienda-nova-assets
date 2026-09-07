ALTER TABLE `siteSettings`
  ADD `reservationButtonText` varchar(80) NOT NULL DEFAULT 'Solicitar reserva',
  ADD `reservationButtonBackground` varchar(24) NOT NULL DEFAULT '#8bbf9f',
  ADD `reservationButtonColor` varchar(24) NOT NULL DEFAULT '#112f3f',
  ADD `officeMapEmbedUrl` text NULL;

ALTER TABLE `propertyLeads`
  ADD `requestedReservationDate` varchar(10) NULL,
  ADD `reservationGuests` int NOT NULL DEFAULT 1;
