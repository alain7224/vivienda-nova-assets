import { index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/** Usuarios autenticados; la cuenta propietaria conserva el rol admin. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/** Vendedores externos y la vía acordada para derivarles visitas o clientes. */
export const vendors = mysqlTable("vendors", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  contactMethod: mysqlEnum("contactMethod", ["direct", "email", "whatsapp", "sms", "phone"]).default("direct").notNull(),
  contactValue: text("contactValue"),
  referralParameter: varchar("referralParameter", { length: 80 }).default("ref").notNull(),
  referralCode: varchar("referralCode", { length: 160 }).default("MARTINEZ").notNull(),
  attributionNote: text("attributionNote"),
  /** Solo se puede usar para nuevas fichas tras tener permiso comercial y de publicación documentado. */
  publicationAuthorized: int("publicationAuthorized").default(0).notNull(),
  authorizationNote: text("authorizationNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("vendors_name_idx").on(table.name)]);

/** Viviendas o productos promocionados. Los archivos viven en almacenamiento y aquí solo se conserva la URL. */
export const properties = mysqlTable("properties", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 180 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  zone: varchar("zone", { length: 140 }).notNull(),
  province: varchar("province", { length: 140 }),
  country: varchar("country", { length: 100 }).default("España").notNull(),
  address: varchar("address", { length: 300 }),
  type: varchar("type", { length: 80 }).notNull(),
  price: varchar("price", { length: 80 }).notNull(),
  priceValue: int("priceValue").notNull(),
  /** Reference/code supplied by the source agency. */
  referenceCode: varchar("referenceCode", { length: 120 }),
  /** Original price captured from the source, kept for audit/comparison. */
  sourcePrice: varchar("sourcePrice", { length: 80 }),
  sourceUrl: text("sourceUrl"),
  /** Lower values appear first; price is the default tie-breaker. */
  sortOrder: int("sortOrder").default(0).notNull(),
  bedrooms: int("bedrooms").notNull(),
  bathrooms: int("bathrooms").notNull(),
  surface: int("surface").notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl").notNull(),
  /** JSON array of all source gallery image URLs. */
  galleryUrls: text("galleryUrls"),
  /** JSON array of verified amenities, such as pool or garage. */
  features: text("features").default("[]").notNull(),
  /** Presentación del texto: automática, compacta con expansión o completa. */
  descriptionMode: mysqlEnum("descriptionMode", ["auto", "compact", "scroll", "full"]).default("auto").notNull(),
  /** Alto máximo, en píxeles, para el modo compacto editable. */
  descriptionHeight: int("descriptionHeight").default(260).notNull(),
  /** Marca editorial independiente del orden automático por precio. */
  featured: int("featured").default(0).notNull(),
  /** Public source coordinates used only to center the property map. */
  latitude: varchar("latitude", { length: 32 }),
  longitude: varchar("longitude", { length: 32 }),
  tag: varchar("tag", { length: 100 }).default("Nueva oportunidad").notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  linkMode: mysqlEnum("linkMode", ["capture", "redirect", "both"]).default("capture").notNull(),
  vendorId: int("vendorId"),
  externalUrl: text("externalUrl"),
  referralParameter: varchar("referralParameter", { length: 80 }).default("ref").notNull(),
  referralCode: varchar("referralCode", { length: 160 }).default("MARTINEZ").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("properties_status_idx").on(table.status),
  index("properties_city_idx").on(table.city),
  index("properties_vendor_idx").on(table.vendorId),
]);

/** Copias multilingües generadas al guardar la ficha en español. */
export const propertyTranslations = mysqlTable("propertyTranslations", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  locale: varchar("locale", { length: 12 }).notNull(),
  title: varchar("title", { length: 240 }).notNull(),
  city: varchar("city", { length: 140 }).notNull(),
  zone: varchar("zone", { length: 180 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  tag: varchar("tag", { length: 140 }).notNull(),
  description: text("description").notNull(),
  features: text("features").default("[]").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  uniqueIndex("property_translation_locale_uq").on(table.propertyId, table.locale),
  index("property_translation_locale_idx").on(table.locale),
]);

/** Contactos voluntarios: sobre un inmueble, un producto o una casa a construir desde cero. */
export const propertyLeads = mysqlTable("propertyLeads", {
  id: int("id").autoincrement().primaryKey(),
  leadType: mysqlEnum("leadType", ["property", "construction", "product"]).default("property").notNull(),
  propertyId: int("propertyId"),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  preferredLocation: varchar("preferredLocation", { length: 200 }),
  preferredProvince: varchar("preferredProvince", { length: 140 }),
  latitude: varchar("latitude", { length: 32 }),
  longitude: varchar("longitude", { length: 32 }),
  budget: varchar("budget", { length: 100 }),
  /** Optional availability preferences submitted from a property reservation form. */
  requestedReservationDate: varchar("requestedReservationDate", { length: 10 }),
  reservationGuests: int("reservationGuests").default(1).notNull(),
  referenceImages: text("referenceImages"),
  attributionCode: varchar("attributionCode", { length: 160 }).default("MARTINEZ").notNull(),
  privacyAcceptedAt: timestamp("privacyAcceptedAt"),
  referralConsentAt: timestamp("referralConsentAt"),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "contacted", "sent_to_seller", "in_follow_up", "won", "lost"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("property_leads_property_idx").on(table.propertyId),
  index("property_leads_created_idx").on(table.createdAt),
  index("property_leads_status_idx").on(table.status),
]);

/** Huella de cada salida pública hacia un vendedor; no se almacena IP. */
export const referralClicks = mysqlTable("referralClicks", {
  id: int("id").autoincrement().primaryKey(),
  propertyId: int("propertyId").notNull(),
  vendorId: int("vendorId"),
  channel: mysqlEnum("channel", ["direct", "email", "whatsapp", "sms", "phone"]).default("direct").notNull(),
  visitorId: varchar("visitorId", { length: 80 }),
  destinationUrl: text("destinationUrl").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [
  index("referral_clicks_property_idx").on(table.propertyId),
  index("referral_clicks_created_idx").on(table.createdAt),
]);

/** Visitas pseudónimas para el cuadro de métricas privado. */
export const siteVisits = mysqlTable("siteVisits", {
  id: int("id").autoincrement().primaryKey(),
  visitorId: varchar("visitorId", { length: 80 }).notNull(),
  locale: varchar("locale", { length: 12 }).notNull(),
  page: varchar("page", { length: 200 }).notNull(),
  /** Vivienda vista, cuando la visita corresponde a una ficha concreta. */
  propertyId: int("propertyId"),
  /** Origen de la visita, si el navegador lo comparte. */
  referrer: varchar("referrer", { length: 500 }),
  deviceType: mysqlEnum("deviceType", ["mobile", "tablet", "desktop"]),
  actionType: mysqlEnum("actionType", ["view", "scroll", "contact", "reserve"]).default("view").notNull(),
  /** Porcentaje máximo de desplazamiento registrado en la página (0-100). */
  scrollDepth: int("scrollDepth"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => [index("site_visits_visitor_idx").on(table.visitorId), index("site_visits_created_idx").on(table.createdAt), index("site_visits_property_idx").on(table.propertyId), index("site_visits_action_idx").on(table.actionType)]);

/** Operaciones que el administrador confirma después de recibir la información del vendedor externo. */
export const commissionOperations = mysqlTable("commissionOperations", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"),
  propertyId: int("propertyId"),
  vendorId: int("vendorId"),
  operationType: mysqlEnum("operationType", ["property", "construction", "product"]).default("property").notNull(),
  clientName: varchar("clientName", { length: 160 }).notNull(),
  title: varchar("title", { length: 220 }).notNull(),
  address: varchar("address", { length: 300 }).notNull(),
  city: varchar("city", { length: 140 }).notNull(),
  province: varchar("province", { length: 140 }).notNull(),
  country: varchar("country", { length: 100 }).default("España").notNull(),
  salePrice: int("salePrice").notNull(),
  commissionPercent: int("commissionPercent").notNull(),
  commissionAmount: int("commissionAmount").notNull(),
  commissionStatus: mysqlEnum("commissionStatus", ["expected", "pending", "paid", "cancelled"]).default("expected").notNull(),
  closedAt: timestamp("closedAt"),
  paidAt: timestamp("paidAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [
  index("commission_operations_status_idx").on(table.commissionStatus),
  index("commission_operations_vendor_idx").on(table.vendorId),
  index("commission_operations_closed_idx").on(table.closedAt),
]);

/** Parámetros visuales y funcionales que el propietario puede editar sin cambiar código. */
export const siteSettings = mysqlTable("siteSettings", {
  id: int("id").autoincrement().primaryKey(),
  bannerText: varchar("bannerText", { length: 220 }).default("Vivienda Nova · Selección internacional").notNull(),
  bannerBackground: varchar("bannerBackground", { length: 24 }).default("#d95f42").notNull(),
  bannerColor: varchar("bannerColor", { length: 24 }).default("#fffdf8").notNull(),
  bannerHeight: int("bannerHeight").default(36).notNull(),
  bannerRotationSeconds: int("bannerRotationSeconds").default(5).notNull(),
  cardStyle: mysqlEnum("cardStyle", ["flat", "three_d", "shadow", "frame", "grid", "minimal"]).default("flat").notNull(),
  enabledLocales: varchar("enabledLocales", { length: 1000 }).default("es,en,nl,de,sv,no,fr,ro,ru,zh-CN,de-CH,fr-CH,it-CH").notNull(),
  /** Lista JSON de vídeos breves y optimizados para el bloque editorial de la portada. */
  heroVideos: text("heroVideos"),
  /** Tarjetas editoriales configurables con imagen o vídeo, medidas y colores. */
  editorialCards: text("editorialCards"),
  heroImageUrl: text("heroImageUrl"),
  /** Teléfono público opcional, gestionado desde el área privada. */
  contactPhone: varchar("contactPhone", { length: 32 }).default("").notNull(),
  midPageCta: varchar("midPageCta", { length: 220 }).default("Compra con claridad · Información directa del vendedor").notNull(),
  /** Reservation CTA styling controlled by the administrator. */
  reservationButtonText: varchar("reservationButtonText", { length: 80 }).default("Solicitar reserva").notNull(),
  reservationButtonBackground: varchar("reservationButtonBackground", { length: 24 }).default("#8bbf9f").notNull(),
  reservationButtonColor: varchar("reservationButtonColor", { length: 24 }).default("#112f3f").notNull(),
  /** Optional Google Maps embed link for the office or physical point of attention. */
  officeMapEmbedUrl: text("officeMapEmbedUrl"),
  /** Máximo de tarjetas del carrusel automático de viviendas similares. */
  relatedPropertiesCount: int("relatedPropertiesCount").default(5).notNull(),
  /** Floating WhatsApp contact controlled by the administrator. */
  whatsappEnabled: int("whatsappEnabled").default(0).notNull(),
  whatsappPhone: varchar("whatsappPhone", { length: 32 }).default("").notNull(),
  whatsappMessage: varchar("whatsappMessage", { length: 500 }).default("Hola, me interesa una vivienda de Vivienda Nova.").notNull(),
  whatsappStyle: mysqlEnum("whatsappStyle", ["round", "outlined", "pill"]).default("round").notNull(),
  whatsappAnimationEnabled: int("whatsappAnimationEnabled").default(1).notNull(),
  whatsappAnimationSeconds: int("whatsappAnimationSeconds").default(30).notNull(),
  /** Interruptor global: solo muestra una nota visual de criptomonedas aceptadas; no procesa pagos. */
  cryptoEnabled: int("cryptoEnabled").default(0).notNull(),
  /** Lista JSON de siglas visibles, por ejemplo ["BTC","ETH","USDC"]. */
  cryptoAcceptedTypes: text("cryptoAcceptedTypes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/** Carruseles editoriales de viviendas, configurados desde el administrador. */
export const propertySections = mysqlTable("propertySections", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 140 }).notNull(),
  subtitle: varchar("subtitle", { length: 280 }).default("").notNull(),
  placement: mysqlEnum("placement", ["home", "property"]).default("home").notNull(),
  /** Lista JSON de IDs seleccionados por el administrador; máximo cinco por sección. */
  propertyIds: text("propertyIds").notNull(),
  cardStyle: mysqlEnum("cardStyle", ["flat", "three_d", "shadow", "frame", "grid", "minimal"]).default("shadow").notNull(),
  background: varchar("background", { length: 24 }).default("#eef2ee").notNull(),
  active: int("active").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => [index("property_sections_placement_idx").on(table.placement)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = typeof properties.$inferInsert;
export type Vendor = typeof vendors.$inferSelect;
export type InsertVendor = typeof vendors.$inferInsert;
export type PropertyLead = typeof propertyLeads.$inferSelect;
export type InsertPropertyLead = typeof propertyLeads.$inferInsert;
export type PropertyTranslation = typeof propertyTranslations.$inferSelect;
export type InsertPropertyTranslation = typeof propertyTranslations.$inferInsert;
export type PropertySection = typeof propertySections.$inferSelect;
export type InsertPropertySection = typeof propertySections.$inferInsert;
export type CommissionOperation = typeof commissionOperations.$inferSelect;
export type InsertCommissionOperation = typeof commissionOperations.$inferInsert;
