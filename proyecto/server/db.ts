import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  commissionOperations,
  InsertCommissionOperation,
  InsertProperty,
  InsertPropertyLead,
  InsertPropertyTranslation,
  InsertPropertySection,
  InsertUser,
  InsertVendor,
  properties,
  propertyLeads,
  propertyTranslations,
  propertySections,
  referralClicks,
  siteSettings,
  siteVisits,
  users,
  vendors,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

/** Valores seguros para que el escaparate funcione antes de que el administrador guarde ajustes. */
export function getDefaultPublicSiteSettings() {
  return {
    bannerText: "Vivienda Nova · Selección internacional",
    bannerBackground: "#d95f42",
    bannerColor: "#fffdf8",
    bannerHeight: 36,
    bannerRotationSeconds: 5,
    cardStyle: "flat" as const,
    enabledLocales: "es,en,nl,de,sv,no,fr,ro,ru,zh-CN,de-CH,fr-CH,it-CH",
    heroVideos: JSON.stringify([{
      label: "Costa Blanca Norte",
      url: "/manus-storage/chalet-piscina-recorrido_14603e97.mp4",
    }]),
    editorialCards: "[]",
    heroImageUrl: "/manus-storage/chalet-minimalista-piscina_3bd4eca8.jpg",
    contactPhone: "",
    midPageCta: "Compra con claridad · Información directa del vendedor",
    reservationButtonText: "Solicitar reserva",
    reservationButtonBackground: "#8bbf9f",
    reservationButtonColor: "#112f3f",
    officeMapEmbedUrl: "",
    whatsappEnabled: 0,
    whatsappPhone: "",
    whatsappMessage: "Hola, me interesa una vivienda de Vivienda Nova.",
    whatsappStyle: "round" as const,
    whatsappAnimationEnabled: 1,
    whatsappAnimationSeconds: 30,
  };
}

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); }
    catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, lastSignedIn: new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: new Date() };
  (["name", "email", "loginMethod"] as const).forEach((field) => {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  });
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listPublishedProperties(locale?: string) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(properties).where(eq(properties.status, "published")).orderBy(asc(properties.sortOrder), desc(properties.priceValue), desc(properties.createdAt));
  // Public visitors receive the commercial content only. Supplier name, URL, tracking
  // code and routing configuration stay in the private administrator and owner notices.
  const publicRows = rows.map(({ vendorId, externalUrl, referralParameter, referralCode, sourceUrl, sourcePrice, ...property }) => property);
  if (!locale || locale === "es" || publicRows.length === 0) return publicRows;
  const translations = await db.select().from(propertyTranslations).where(eq(propertyTranslations.locale, locale));
  const translationByProperty = new Map(translations.map((translation) => [translation.propertyId, translation]));
  return publicRows.map((property) => {
    const translation = translationByProperty.get(property.id);
    return translation ? { ...property, title: translation.title, city: translation.city, zone: translation.zone, type: translation.type, tag: translation.tag, description: translation.description, features: translation.features } : property;
  });
}

export async function listAdminProperties() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(properties).orderBy(asc(properties.sortOrder), desc(properties.priceValue), desc(properties.updatedAt));
}

export async function getPropertyBySourceUrl(sourceUrl: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(properties).where(eq(properties.sourceUrl, sourceUrl)).limit(1);
  return result[0];
}

export async function getPropertyById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
  return result[0];
}

export async function createProperty(values: InsertProperty) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const result = await db.insert(properties).values(values);
  return Number((result as unknown as { insertId: number }).insertId);
}

export async function updateProperty(id: number, values: Partial<InsertProperty>) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(properties).set({ ...values, updatedAt: new Date() }).where(eq(properties.id, id));
}

export async function moveProperty(id: number, direction: "up" | "down") {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const rows = await db.select().from(properties).orderBy(asc(properties.sortOrder), desc(properties.priceValue), desc(properties.updatedAt));
  const index = rows.findIndex((row) => row.id === id);
  const target = index + (direction === "up" ? -1 : 1);
  if (index < 0 || target < 0 || target >= rows.length) return;
  const ordered = rows.map((row, position) => ({ ...row, sortOrder: position }));
  [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  await Promise.all(ordered.map((row, position) => db.update(properties).set({ sortOrder: position, updatedAt: new Date() }).where(eq(properties.id, row.id))));
}

export async function deleteProperty(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.delete(properties).where(eq(properties.id, id));
}

export async function deletePropertyTranslations(propertyId: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.delete(propertyTranslations).where(eq(propertyTranslations.propertyId, propertyId));
}

export async function replacePropertyTranslations(propertyId: number, translations: Omit<InsertPropertyTranslation, "propertyId">[]) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  await db.delete(propertyTranslations).where(eq(propertyTranslations.propertyId, propertyId));
  if (translations.length) await db.insert(propertyTranslations).values(translations.map((translation) => ({ ...translation, propertyId })));
}


export async function listPropertySections(placement?: "home" | "property") {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(propertySections).orderBy(asc(propertySections.sortOrder), desc(propertySections.updatedAt));
  return placement ? rows.filter((section) => section.placement === placement) : rows;
}

export async function listPublicPropertySections(placement: "home" | "property") {
  return (await listPropertySections(placement)).filter((section) => section.active === 1);
}

export async function createPropertySection(values: InsertPropertySection) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(propertySections).values(values);
}

export async function updatePropertySection(id: number, values: Partial<InsertPropertySection>) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(propertySections).set({ ...values, updatedAt: new Date() }).where(eq(propertySections.id, id));
}

export async function deletePropertySection(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.delete(propertySections).where(eq(propertySections.id, id));
}

export async function listVendors() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vendors).orderBy(desc(vendors.updatedAt));
}

export async function getVendorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vendors).where(eq(vendors.id, id)).limit(1);
  return result[0];
}

export async function createVendor(values: InsertVendor) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(vendors).values(values);
}

export async function updateVendor(id: number, values: Partial<InsertVendor>) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(vendors).set({ ...values, updatedAt: new Date() }).where(eq(vendors.id, id));
}

export async function countPropertiesForVendor(vendorId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select({ id: properties.id }).from(properties).where(eq(properties.vendorId, vendorId));
  return rows.length;
}

export async function deleteVendor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.delete(vendors).where(eq(vendors.id, id));
}

export async function createPropertyLead(values: InsertPropertyLead) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(propertyLeads).values(values);
}

export async function listPropertyLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(propertyLeads).orderBy(desc(propertyLeads.createdAt));
}

export async function getPropertyLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(propertyLeads).where(eq(propertyLeads.id, id)).limit(1);
  return rows[0];
}

export async function updatePropertyLeadStatus(id: number, status: "new" | "contacted" | "sent_to_seller" | "in_follow_up" | "won" | "lost") {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(propertyLeads).set({ status, updatedAt: new Date() }).where(eq(propertyLeads.id, id));
}

export async function createReferralClick(propertyId: number, destinationUrl: string, vendorId?: number | null, channel: "direct" | "email" | "whatsapp" | "sms" | "phone" = "direct", visitorId?: string | null) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(referralClicks).values({ propertyId, destinationUrl, vendorId: vendorId || null, channel, visitorId: visitorId || null });
}

export async function listReferralClicks() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(referralClicks).orderBy(desc(referralClicks.createdAt));
}

export async function createSiteVisit(visitorId: string, locale: string, page: string) {
  const db = await getDb();
  if (!db) return;
  return db.insert(siteVisits).values({ visitorId, locale, page });
}

export async function listSiteVisits() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteVisits).orderBy(desc(siteVisits.createdAt));
}

export async function listCommissionOperations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(commissionOperations).orderBy(desc(commissionOperations.createdAt));
}

export async function createCommissionOperation(values: InsertCommissionOperation) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.insert(commissionOperations).values(values);
}

export async function updateCommissionOperation(id: number, values: Partial<InsertCommissionOperation>) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  return db.update(commissionOperations).set({ ...values, updatedAt: new Date() }).where(eq(commissionOperations.id, id));
}

export async function getSiteSettings() {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(siteSettings).limit(1);
  return rows[0];
}

/** Nunca devuelve undefined: se utiliza en la ruta pública para evitar errores de caché del cliente. */
export async function getPublicSiteSettings() {
  return (await getSiteSettings()) ?? getDefaultPublicSiteSettings();
}

export async function updateSiteSettings(values: Partial<typeof siteSettings.$inferInsert>) {
  const db = await getDb();
  if (!db) throw new Error("La base de datos no está disponible.");
  const current = await getSiteSettings();
  if (current) return db.update(siteSettings).set({ ...values, updatedAt: new Date() }).where(eq(siteSettings.id, current.id));
  return db.insert(siteSettings).values(values);
}

export async function getAdminOverview() {
  const [propertyRows, leadRows, clickRows, visitRows, operationRows] = await Promise.all([
    listAdminProperties(), listPropertyLeads(), listReferralClicks(), listSiteVisits(), listCommissionOperations(),
  ]);
  return {
    properties: propertyRows.length,
    published: propertyRows.filter((property) => property.status === "published").length,
    leads: leadRows.length,
    clicks: clickRows.length,
    visitors: new Set(visitRows.map((visit) => visit.visitorId)).size,
    visits: visitRows.length,
    expectedCommission: operationRows.filter((operation) => operation.commissionStatus === "expected").reduce((total, operation) => total + operation.commissionAmount, 0),
    pendingCommission: operationRows.filter((operation) => operation.commissionStatus === "pending").reduce((total, operation) => total + operation.commissionAmount, 0),
    paidCommission: operationRows.filter((operation) => operation.commissionStatus === "paid").reduce((total, operation) => total + operation.commissionAmount, 0),
  };
}
