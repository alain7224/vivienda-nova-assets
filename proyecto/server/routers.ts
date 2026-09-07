import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import sharp from "sharp";
import { referenceMimeTypes } from "../shared/referenceFiles";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createCommissionOperation,
  createProperty,
  createPropertyLead,
  createReferralClick,
  createSiteVisit,
  createVendor,
  countPropertiesForVendor,
  deleteProperty,
  deleteVendor,
  getAdminOverview,
  getPropertyById,
  getPropertyBySourceUrl,
  getPropertyLeadById,
  getPublicSiteSettings,
  getSiteSettings,
  getVendorById,
  listAdminProperties,
  listCommissionOperations,
  listPropertyLeads,
  listPublishedProperties,
  listReferralClicks,
  listSiteVisits,
  listVendors,
  replacePropertyTranslations,
  updateCommissionOperation,
  updateProperty,
  updatePropertyLeadStatus,
  moveProperty,
  updateSiteSettings,
  updateVendor,
  listPropertySections,
  listPublicPropertySections,
  createPropertySection,
  updatePropertySection,
  deletePropertySection,
  getAnalyticsReport,
} from "./db";
import { buildReferralChannelUrl } from "./referral";
import { createLeadConsentTimestamps } from "./consent";
import { storagePut } from "./storage";
import { SUPPORTED_LOCALES, translatePropertyCopy, type SupportedLocale } from "./translation";
import { ENV } from "./_core/env";

const directChannels = ["direct", "email", "whatsapp", "sms", "phone"] as const;
const cardStyles = ["flat", "three_d", "shadow", "frame", "grid", "minimal"] as const;
const cryptoTypeSchema = z.string().max(12000).refine((value) => { try { const parsed = JSON.parse(value); return Array.isArray(parsed) && parsed.length <= 8 && parsed.every((item) => typeof item === "string" && /^[A-Za-z0-9]{2,10}$/.test(item)); } catch { return false; } }, "La lista de criptomonedas no es válida.");
const propertyInput = z.object({
  slug: z.string().trim().min(3).max(180), title: z.string().trim().min(3).max(180), city: z.string().trim().min(2).max(100), zone: z.string().trim().min(2).max(140),
  province: z.string().trim().max(140).nullable().optional(), address: z.string().trim().max(300).nullable().optional(), country: z.string().trim().min(2).max(100).default("España"), type: z.string().trim().min(2).max(80),
  price: z.string().trim().min(1).max(80), priceValue: z.number().int().nonnegative(), referenceCode: z.string().trim().max(120).nullable().optional(), sourcePrice: z.string().trim().max(80).nullable().optional(), sourceUrl: z.string().url().max(3000).nullable().optional(), sortOrder: z.number().int().min(0).max(100000).default(0), bedrooms: z.number().int().min(0).max(30), bathrooms: z.number().int().min(0).max(30), surface: z.number().int().positive().max(100000),
  description: z.string().trim().min(10).max(5000), imageUrl: z.string().trim().min(1).max(3000), galleryUrls: z.string().max(50000).nullable().optional(), features: z.string().max(10000).default("[]").refine((value) => { try { const parsed = JSON.parse(value); return Array.isArray(parsed) && parsed.length <= 30 && parsed.every((item) => typeof item === "string" && item.length <= 100); } catch { return false; } }, "Las características no son válidas."), descriptionMode: z.enum(["auto", "compact", "scroll", "full"]).default("auto"), descriptionHeight: z.number().int().min(120).max(1200).default(260), featured: z.boolean().default(false), latitude: z.string().trim().max(32).nullable().optional(), longitude: z.string().trim().max(32).nullable().optional(), tag: z.string().trim().min(2).max(100), status: z.enum(["draft", "published"]),
  linkMode: z.enum(["capture", "redirect", "both"]).default("capture"), vendorId: z.number().int().positive().nullable().optional(), externalUrl: z.string().url().max(3000).nullable().optional(),
  referralParameter: z.string().trim().min(1).max(80).default("ref"), referralCode: z.string().trim().min(1).max(160).nullable().optional(),
}).superRefine((value, ctx) => {
  if ((value.linkMode === "redirect" || value.linkMode === "both") && !value.externalUrl) {
    ctx.addIssue({ code: "custom", path: ["externalUrl"], message: "Indica el enlace del vendedor para activar la derivación." });
  }
  const publicCopy = `${value.title} ${value.description} ${value.tag}`;
  if (/\b(?:l\s*&\s*r\s*costa\s*homes|lrcostahomes)\b/i.test(publicCopy)) {
    ctx.addIssue({ code: "custom", path: ["description"], message: "La ficha pública no puede mencionar la inmobiliaria fuente. Usa una descripción propia de Vivienda Nova." });
  }
});

const vendorInput = z.object({
  name: z.string().trim().min(2).max(160), email: z.string().email().max(320).nullable().optional(), phone: z.string().trim().max(50).nullable().optional(),
  contactMethod: z.enum(directChannels).default("direct"), contactValue: z.string().trim().max(3000).nullable().optional(), referralParameter: z.string().trim().min(1).max(80).default("ref"),
  referralCode: z.string().trim().min(1).max(160).nullable().optional(), attributionNote: z.string().trim().max(3000).nullable().optional(), publicationAuthorized: z.boolean().default(false), authorizationNote: z.string().trim().max(3000).nullable().optional(),
}).superRefine((value, ctx) => { if (value.contactMethod !== "direct" && !value.contactValue) ctx.addIssue({ code: "custom", path: ["contactValue"], message: "Indica el correo o teléfono del canal elegido." }); });

const leadInput = z.object({
  leadType: z.enum(["property", "construction", "product"]).default("property"), propertyId: z.number().int().positive().nullable().optional(), name: z.string().trim().min(2).max(160),
  email: z.string().email().max(320), phone: z.string().trim().max(50).nullable().optional(), preferredLocation: z.string().trim().max(200).nullable().optional(), preferredProvince: z.string().trim().max(140).nullable().optional(),
  latitude: z.string().trim().max(32).nullable().optional(), longitude: z.string().trim().max(32).nullable().optional(), budget: z.string().trim().max(100).nullable().optional(),
  requestedReservationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(), reservationGuests: z.number().int().min(1).max(20).optional(), referenceImages: z.array(z.string().startsWith("/manus-storage/")).max(5).optional(), attributionCode: z.string().trim().min(1).max(160).default("MARTINEZ"), privacyAccepted: z.boolean(), referralConsent: z.boolean(), message: z.string().trim().min(5).max(5000),
}).superRefine((value, ctx) => { if (value.leadType === "property" && !value.propertyId) ctx.addIssue({ code: "custom", path: ["propertyId"], message: "Selecciona una vivienda." }); });

const operationInput = z.object({
  leadId: z.number().int().positive().nullable().optional(), propertyId: z.number().int().positive().nullable().optional(), vendorId: z.number().int().positive().nullable().optional(), operationType: z.enum(["property", "construction", "product"]).default("property"),
  clientName: z.string().trim().min(2).max(160), title: z.string().trim().min(2).max(220), address: z.string().trim().min(2).max(300), city: z.string().trim().min(2).max(140), province: z.string().trim().min(2).max(140), country: z.string().trim().min(2).max(100).default("España"),
  salePrice: z.number().int().nonnegative(), commissionPercent: z.number().int().min(0).max(100), commissionStatus: z.enum(["expected", "pending", "paid", "cancelled"]), closedAt: z.date().nullable().optional(), paidAt: z.date().nullable().optional(), notes: z.string().trim().max(5000).nullable().optional(),
});

const editorialCard = z.object({ id: z.string().min(1).max(80), type: z.enum(["image", "video"]), title: z.string().trim().max(120), description: z.string().trim().max(400), url: z.string().startsWith("/manus-storage/").max(3000), background: z.string().regex(/^#[0-9a-fA-F]{6}$/), textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/), width: z.number().int().min(1).max(12), height: z.number().int().min(180).max(900), active: z.boolean() });
const propertySectionInput = z.object({ title: z.string().trim().min(2).max(140), subtitle: z.string().trim().max(280).default(""), placement: z.enum(["home", "property"]).default("home"), propertyIds: z.array(z.number().int().positive()).min(1).max(5), cardStyle: z.enum(cardStyles).default("shadow"), background: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#eef2ee"), active: z.boolean().default(true), sortOrder: z.number().int().min(0).max(100000).default(0) });
const settingsInput = z.object({ bannerText: z.string().trim().min(1).max(220), bannerBackground: z.string().regex(/^#[0-9a-fA-F]{6}$/), bannerColor: z.string().regex(/^#[0-9a-fA-F]{6}$/), bannerHeight: z.number().int().min(26).max(72), bannerRotationSeconds: z.number().int().min(2).max(20), cardStyle: z.enum(cardStyles), enabledLocales: z.string().trim().min(2).max(1000), contactPhone: z.string().trim().max(32).optional(), midPageCta: z.string().trim().min(1).max(220).optional(), cryptoEnabled: z.boolean().optional(), cryptoAcceptedTypes: cryptoTypeSchema.optional(), reservationButtonText: z.string().trim().min(2).max(80).optional(), reservationButtonBackground: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), reservationButtonColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(), relatedPropertiesCount: z.number().int().min(1).max(5).optional(), whatsappEnabled: z.boolean().optional(), whatsappPhone: z.string().trim().max(32).optional().refine((value) => !value || /^[+()\s0-9.-]{6,32}$/.test(value), "Introduce un teléfono válido de WhatsApp."), whatsappMessage: z.string().trim().min(2).max(500).optional(), whatsappStyle: z.enum(["round", "outlined", "pill"]).optional(), whatsappAnimationEnabled: z.boolean().optional(), whatsappAnimationSeconds: z.number().int().min(15).max(120).optional(), officeMapEmbedUrl: z.string().url().max(3000).nullable().optional().refine((value) => !value || /^https:\/\/(www\.)?google\.[a-z.]+\/maps\//i.test(value), "Usa un enlace de inserción de Google Maps."), heroImageUrl: z.string().startsWith("/manus-storage/").max(3000).optional(), heroVideos: z.string().max(5000).optional().refine((value) => { if (value === undefined) return true; try { const parsed = JSON.parse(value); return Array.isArray(parsed) && parsed.length <= 6 && parsed.every((item) => typeof item?.label === "string" && typeof item?.url === "string" && item.url.startsWith("/manus-storage/")); } catch { return false; } }, "La lista de vídeos no es válida."), editorialCards: z.string().max(30000).optional().refine((value) => { if (value === undefined) return true; try { const parsed = JSON.parse(value); return Array.isArray(parsed) && parsed.length <= 12 && parsed.every((item) => editorialCard.safeParse(item).success); } catch { return false; } }, "Las tarjetas editoriales no son válidas.") });

async function syncTranslations(propertyId: number, input: z.infer<typeof propertyInput>) {
  const features = (() => { try { const parsed = JSON.parse(input.features || "[]"); return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string").slice(0, 30) : []; } catch { return []; } })();
  const settings = await getSiteSettings();
  const enabled = (settings?.enabledLocales || "es,en,nl,de,sv,no,fr,ro,ru,zh-CN,de-CH,fr-CH,it-CH").split(",").map((item) => item.trim()).filter((locale): locale is SupportedLocale => locale !== "es" && (SUPPORTED_LOCALES as readonly string[]).includes(locale));
  const translations = await translatePropertyCopy({ title: input.title, city: input.city, zone: input.zone, type: input.type, tag: input.tag, description: input.description, features }, enabled);
  await replacePropertyTranslations(propertyId, translations.map(({ features, ...translation }) => ({ ...translation, features: JSON.stringify(features) })));
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => { const cookieOptions = getSessionCookieOptions(ctx.req); ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 }); return { success: true } as const; }),
  }),
  settings: router({ public: publicProcedure.query(() => getPublicSiteSettings()) }),
  propertySections: router({ list: publicProcedure.input(z.object({ placement: z.enum(["home", "property"]).default("home") }).optional()).query(({ input }) => listPublicPropertySections(input?.placement || "home")) }),
  properties: router({
    list: publicProcedure.input(z.object({ locale: z.string().max(12).optional() }).optional()).query(({ input }) => listPublishedProperties(input?.locale)),
    createLead: publicProcedure.input(leadInput).mutation(async ({ input, ctx }) => {
      const property = input.propertyId ? await getPropertyById(input.propertyId) : undefined;
      if (input.leadType === "property" && (!property || property.status !== "published")) throw new Error("La vivienda no está disponible.");
      const { privacyAccepted, referralConsent, ...lead } = input;
      const consent = createLeadConsentTimestamps({ privacyAccepted, referralConsent });
      const configuredBase = ENV.publicAppUrl.replace(/\/$/, "") || `${ctx.req.protocol}://${ctx.req.get("host")}`;
      const propertyLink = property ? `${configuredBase}/vivienda/${encodeURIComponent(property.slug)}` : null;
      const enrichedMessage = property && propertyLink ? `[FICHA DE INTERÉS: ${property.title} · ${propertyLink}]\n${lead.message}` : lead.message;
      await createPropertyLead({ ...lead, message: enrichedMessage, propertyId: lead.propertyId || null, phone: lead.phone || null, preferredLocation: lead.preferredLocation || null, preferredProvince: lead.preferredProvince || null, latitude: lead.latitude || null, longitude: lead.longitude || null, budget: lead.budget || null, referenceImages: lead.referenceImages?.length ? JSON.stringify(lead.referenceImages) : null, attributionCode: lead.attributionCode || "MARTINEZ", status: "new", ...consent });
      const internalVendor = property?.vendorId ? await getVendorById(property.vendorId) : undefined;
      const label = property?.title || (input.leadType === "construction" ? "Proyecto de construcción" : "Producto");
      const internalProvider = internalVendor ? ` · Proveedor interno: ${internalVendor.name}${internalVendor.referralCode ? ` · Código interno: ${internalVendor.referralCode}` : ""}` : "";
      const notificationSent = await notifyOwner({ title: `Nuevo interesado: ${label}`, content: `${input.name} · ${input.email}${input.phone ? ` · ${input.phone}` : ""} · Referencia: ${input.attributionCode || "MARTINEZ"}${propertyLink ? ` · Ficha: ${propertyLink}` : ""}${internalProvider}` });
      return { success: true, notificationSent };
    }),
    createReservationLead: publicProcedure.input(z.object({
      propertyId: z.number().int().positive(), name: z.string().trim().min(2).max(160), email: z.string().email().max(320), phone: z.string().trim().max(50).nullable().optional(),
      preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(), guests: z.number().int().min(1).max(20).default(1), message: z.string().trim().min(5).max(5000),
      privacyAccepted: z.boolean(), reservationConsent: z.boolean(),
    })).mutation(async ({ input, ctx }) => {
      const property = await getPropertyById(input.propertyId);
      if (!property || property.status !== "published") throw new Error("La vivienda no está disponible.");
      const consent = createLeadConsentTimestamps({ privacyAccepted: input.privacyAccepted, referralConsent: input.reservationConsent });
      const configuredBase = ENV.publicAppUrl.replace(/\/$/, "") || `${ctx.req.protocol}://${ctx.req.get("host")}`;
      const propertyLink = `${configuredBase}/vivienda/${encodeURIComponent(property.slug)}`;
      await createPropertyLead({ leadType: "property", propertyId: property.id, name: input.name, email: input.email, phone: input.phone || null, preferredLocation: null, preferredProvince: null, latitude: null, longitude: null, budget: null, requestedReservationDate: input.preferredDate || null, reservationGuests: input.guests, referenceImages: null, attributionCode: "MARTINEZ", message: `[SOLICITUD DE RESERVA · FICHA: ${property.title} · ${propertyLink}] ${input.message}`, status: "new", ...consent });
      const internalVendor = property.vendorId ? await getVendorById(property.vendorId) : undefined;
      const internalProvider = internalVendor ? ` · Proveedor interno: ${internalVendor.name}${internalVendor.referralCode ? ` · Código interno: ${internalVendor.referralCode}` : ""}` : "";
      const notificationSent = await notifyOwner({ title: `Nueva solicitud de reserva: ${property.title}`, content: `${input.name} · ${input.email}${input.phone ? ` · ${input.phone}` : ""} · Fecha: ${input.preferredDate || "Sin fecha"} · Personas: ${input.guests} · Ficha: ${propertyLink}${internalProvider}` });
      return { success: true, notificationSent };
    }),
  }),
  analytics: router({
    recordVisit: publicProcedure.input(z.object({
      visitorId: z.string().min(8).max(80),
      locale: z.string().min(2).max(12),
      page: z.string().min(1).max(200),
      propertyId: z.number().int().positive().nullable().optional(),
      referrer: z.string().max(500).nullable().optional(),
      deviceType: z.enum(["mobile", "tablet", "desktop"]).nullable().optional(),
      actionType: z.enum(["view", "scroll", "contact", "reserve"]).optional(),
      scrollDepth: z.number().min(0).max(100).nullable().optional(),
    })).mutation(({ input }) => createSiteVisit(input.visitorId, input.locale, input.page, { propertyId: input.propertyId ?? null, referrer: input.referrer || null, deviceType: input.deviceType ?? null, actionType: input.actionType ?? "view", scrollDepth: input.scrollDepth ?? null })),
  }),
  construction: router({
    uploadReference: publicProcedure.input(z.object({ filename: z.string().trim().min(1).max(180), mimeType: z.enum(referenceMimeTypes), base64: z.string().min(1).max(12_000_000) })).mutation(async ({ input }) => {
      const encoded = input.base64.includes(",") ? input.base64.split(",")[1] : input.base64;
      const image = Buffer.from(encoded, "base64");
      if (!image.length || image.length > 8_000_000) throw new Error("Cada archivo debe pesar como máximo 8 MB.");
      const cleanName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
      return storagePut(`referencias-construccion/${Date.now()}-${cleanName}`, image, input.mimeType);
    }),
  }),
  referrals: router({
    visit: publicProcedure.input(z.object({ propertyId: z.number().int().positive(), visitorId: z.string().min(8).max(80).optional() })).mutation(async ({ input, ctx }) => {
      const property = await getPropertyById(input.propertyId);
      if (!property || property.status !== "published" || !property.externalUrl) throw new Error("El enlace del vendedor no está disponible.");
      const vendor = property.vendorId ? await getVendorById(property.vendorId) : undefined;
      const channel = vendor?.contactMethod ?? "direct";
      const contactValue = channel === "direct" ? property.externalUrl : vendor?.contactValue;
      if (!contactValue) throw new Error("El vendedor no tiene un canal de derivación configurado.");
      const code = vendor?.referralCode ?? property.referralCode;
      const parameter = vendor?.referralParameter ?? property.referralParameter;
      const message = `Nuevo interesado referido por MARTINEZ. Vivienda: ${property.title}. Código: ${code}. Enlace: ${property.externalUrl}`;
      const destinationUrl = buildReferralChannelUrl(channel, contactValue, message, parameter, code);
      await createReferralClick(property.id, destinationUrl, vendor?.id ?? property.vendorId, channel, input.visitorId);
      return { destinationUrl, channel };
    }),
  }),
  admin: router({
    overview: adminProcedure.query(() => getAdminOverview()), properties: adminProcedure.query(() => listAdminProperties()), sections: adminProcedure.query(() => listPropertySections()), leads: adminProcedure.query(() => listPropertyLeads()), vendors: adminProcedure.query(() => listVendors()),
    operations: adminProcedure.query(() => listCommissionOperations()), interactions: adminProcedure.query(async () => {
      const [visits, clicks] = await Promise.all([listSiteVisits(), listReferralClicks()]);
      return [
        ...visits.map((visit) => ({ id: `visit-${visit.id}`, kind: "visit" as const, propertyId: visit.propertyId ?? null, channel: null, locale: visit.locale, createdAt: visit.createdAt })),
        ...clicks.map((click) => ({ id: `click-${click.id}`, kind: "click" as const, propertyId: click.propertyId, channel: click.channel, locale: null, createdAt: click.createdAt })),
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 100);
    }), settings: adminProcedure.query(() => getSiteSettings()),
    analytics: adminProcedure.input(z.object({ startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(), endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional() }).optional()).query(({ input }) => {
      const startDate = input?.startDate ? new Date(`${input.startDate}T00:00:00.000Z`) : undefined;
      const endDate = input?.endDate ? new Date(`${input.endDate}T23:59:59.999Z`) : undefined;
      return getAnalyticsReport({ startDate: startDate && !Number.isNaN(startDate.getTime()) ? startDate : undefined, endDate: endDate && !Number.isNaN(endDate.getTime()) ? endDate : undefined });
    }),
    createProperty: adminProcedure.input(propertyInput).mutation(async ({ input }) => { if (input.status === "published" && input.vendorId) { const vendor = await getVendorById(input.vendorId); if (!vendor?.publicationAuthorized) throw new Error("Antes de publicar una ficha de este proveedor, guarda su autorización escrita en Vendedores."); } const id = await createProperty({ ...input, province: input.province || null, address: input.address || null, vendorId: input.vendorId || null, externalUrl: input.externalUrl || null, referenceCode: input.referenceCode || null, sourcePrice: input.sourcePrice || null, sourceUrl: input.sourceUrl || null, galleryUrls: input.galleryUrls || null, latitude: input.latitude || null, longitude: input.longitude || null, referralCode: input.referralCode || "MARTINEZ", featured: input.featured ? 1 : 0 }); let translationsReady = true; try { await syncTranslations(id, input); } catch { translationsReady = false; } return { success: true, translationsReady }; }),
    updateProperty: adminProcedure.input(propertyInput.safeExtend({ id: z.number().int().positive() })).mutation(async ({ input }) => { const { id, ...values } = input; if (values.status === "published" && values.vendorId) { const vendor = await getVendorById(values.vendorId); if (!vendor?.publicationAuthorized) throw new Error("Antes de publicar una ficha de este proveedor, guarda su autorización escrita en Vendedores."); } await updateProperty(id, { ...values, province: values.province || null, address: values.address || null, vendorId: values.vendorId || null, externalUrl: values.externalUrl || null, referenceCode: values.referenceCode || null, sourcePrice: values.sourcePrice || null, sourceUrl: values.sourceUrl || null, galleryUrls: values.galleryUrls || null, latitude: values.latitude || null, longitude: values.longitude || null, referralCode: values.referralCode || "MARTINEZ", featured: values.featured ? 1 : 0 }); let translationsReady = true; try { await syncTranslations(id, values); } catch { translationsReady = false; } return { success: true, translationsReady }; }),
    updatePropertyDetailsBatch: adminProcedure.input(z.object({ rows: z.array(propertyInput).min(1).max(150) })).mutation(async ({ input }) => {
      let updated = 0; let skipped = 0; let translated = 0; let translationPending = 0;
      for (const row of input.rows) {
        if (!row.sourceUrl) { skipped += 1; continue; }
        const existing = await getPropertyBySourceUrl(row.sourceUrl);
        if (!existing) { skipped += 1; continue; }
        await updateProperty(existing.id, {
          title: row.title, address: row.address || null, city: row.city, zone: row.zone, province: row.province || null, country: row.country,
          referenceCode: row.referenceCode || null, sourcePrice: row.sourcePrice || null, sourceUrl: row.sourceUrl, bedrooms: row.bedrooms, bathrooms: row.bathrooms,
          surface: row.surface, description: row.description, imageUrl: row.imageUrl, galleryUrls: row.galleryUrls || null, features: row.features,
          latitude: row.latitude || null, longitude: row.longitude || null, tag: row.tag,
        });
        try { await syncTranslations(existing.id, row); translated += 1; }
        catch { translationPending += 1; }
        updated += 1;
      }
      return { updated, skipped, translated, translationPending };
    }),
    createPropertySection: adminProcedure.input(propertySectionInput).mutation(async ({ input }) => { await createPropertySection({ ...input, propertyIds: JSON.stringify(input.propertyIds), active: input.active ? 1 : 0 }); return { success: true }; }),
    updatePropertySection: adminProcedure.input(propertySectionInput.extend({ id: z.number().int().positive() })).mutation(async ({ input }) => { const { id, ...values } = input; await updatePropertySection(id, { ...values, propertyIds: JSON.stringify(values.propertyIds), active: values.active ? 1 : 0 }); return { success: true }; }),
    deletePropertySection: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await deletePropertySection(input.id); return { success: true }; }),
    translatePublishedProperties: adminProcedure.input(z.object({ propertyIds: z.array(z.number().int().positive()).max(150).optional() }).optional()).mutation(async ({ input }) => { const properties = await listAdminProperties(); const chosen = properties.filter((property) => property.status === "published" && (!input?.propertyIds?.length || input.propertyIds.includes(property.id))); let translated = 0; const pending: number[] = []; for (const property of chosen) { try { await syncTranslations(property.id, { ...property, province: property.province || null, address: property.address || null, sourcePrice: property.sourcePrice || null, sourceUrl: property.sourceUrl || null, galleryUrls: property.galleryUrls || null, latitude: property.latitude || null, longitude: property.longitude || null, referralCode: property.referralCode || "MARTINEZ", vendorId: property.vendorId || null, externalUrl: property.externalUrl || null, referenceCode: property.referenceCode || null, featured: property.featured === 1 }); translated += 1; } catch { pending.push(property.id); } } return { requested: chosen.length, translated, pending }; }),
    deleteProperty: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { await deleteProperty(input.id); return { success: true }; }),
    moveProperty: adminProcedure.input(z.object({ id: z.number().int().positive(), direction: z.enum(["up", "down"]) })).mutation(async ({ input }) => { await moveProperty(input.id, input.direction); return { success: true }; }),
    createVendor: adminProcedure.input(vendorInput).mutation(async ({ input }) => { await createVendor({ ...input, email: input.email || null, phone: input.phone || null, contactValue: input.contactValue || null, referralCode: input.referralCode || "MARTINEZ", attributionNote: input.attributionNote || null, publicationAuthorized: input.publicationAuthorized ? 1 : 0, authorizationNote: input.authorizationNote || null }); return { success: true }; }),
    updateVendor: adminProcedure.input(vendorInput.safeExtend({ id: z.number().int().positive() })).mutation(async ({ input }) => { const { id, ...values } = input; await updateVendor(id, { ...values, email: values.email || null, phone: values.phone || null, contactValue: values.contactValue || null, referralCode: values.referralCode || "MARTINEZ", attributionNote: values.attributionNote || null, publicationAuthorized: values.publicationAuthorized ? 1 : 0, authorizationNote: values.authorizationNote || null }); return { success: true }; }),
    deleteVendor: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(async ({ input }) => { if (await countPropertiesForVendor(input.id)) throw new Error("Desvincula primero las viviendas de este vendedor."); await deleteVendor(input.id); return { success: true }; }),
    updateLeadStatus: adminProcedure.input(z.object({ id: z.number().int().positive(), status: z.enum(["new", "contacted", "sent_to_seller", "in_follow_up", "won", "lost"]) })).mutation(async ({ input }) => { await updatePropertyLeadStatus(input.id, input.status); return { success: true }; }),
    prepareLeadReferral: adminProcedure.input(z.object({ leadId: z.number().int().positive(), vendorId: z.number().int().positive() })).mutation(async ({ input }) => {
      const [lead, vendor] = await Promise.all([getPropertyLeadById(input.leadId), getVendorById(input.vendorId)]);
      if (!lead || !vendor) throw new Error("No se encontró el cliente o el vendedor.");
      if (!lead.referralConsentAt) throw new Error("Este cliente no autorizó el envío de sus datos al vendedor.");
      const property = lead.propertyId ? await getPropertyById(lead.propertyId) : undefined;
      const title = property?.title || (lead.leadType === "construction" ? "Proyecto de construcción a medida" : "Consulta de producto");
      const message = `Cliente referido por MARTINEZ\nNombre: ${lead.name}\nCorreo: ${lead.email}\nTeléfono: ${lead.phone || "No indicado"}\nInterés: ${title}\nMensaje: ${lead.message}\nReferencia: ${vendor.referralCode}`;
      const channel = vendor.contactMethod;
      if (!vendor.contactValue && channel !== "direct") throw new Error("Este vendedor no tiene un canal de contacto configurado.");
      const destinationUrl = buildReferralChannelUrl(channel, channel === "direct" ? property?.externalUrl || "" : vendor.contactValue || "", message, vendor.referralParameter, vendor.referralCode);
      await updatePropertyLeadStatus(lead.id, "sent_to_seller");
      return { destinationUrl, channel };
    }),
    createOperation: adminProcedure.input(operationInput).mutation(async ({ input }) => { const commissionAmount = Math.round(input.salePrice * input.commissionPercent / 100); await createCommissionOperation({ ...input, leadId: input.leadId || null, propertyId: input.propertyId || null, vendorId: input.vendorId || null, commissionAmount, closedAt: input.closedAt || null, paidAt: input.paidAt || null, notes: input.notes || null }); return { success: true, commissionAmount }; }),
    updateOperation: adminProcedure.input(operationInput.extend({ id: z.number().int().positive() })).mutation(async ({ input }) => { const { id, ...values } = input; const commissionAmount = Math.round(values.salePrice * values.commissionPercent / 100); await updateCommissionOperation(id, { ...values, leadId: values.leadId || null, propertyId: values.propertyId || null, vendorId: values.vendorId || null, commissionAmount, closedAt: values.closedAt || null, paidAt: values.paidAt || null, notes: values.notes || null }); return { success: true, commissionAmount }; }),
    updateSettings: adminProcedure.input(settingsInput).mutation(async ({ input }) => { const { whatsappEnabled, whatsappAnimationEnabled, cryptoEnabled, ...values } = input; await updateSiteSettings({ ...values, ...(whatsappEnabled === undefined ? {} : { whatsappEnabled: whatsappEnabled ? 1 : 0 }), ...(whatsappAnimationEnabled === undefined ? {} : { whatsappAnimationEnabled: whatsappAnimationEnabled ? 1 : 0 }), ...(cryptoEnabled === undefined ? {} : { cryptoEnabled: cryptoEnabled ? 1 : 0 }) }); return { success: true }; }),
    uploadImage: adminProcedure.input(z.object({ filename: z.string().trim().min(1).max(180), mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "image/avif"]), base64: z.string().min(1).max(30_000_000) })).mutation(async ({ input, ctx }) => {
      const encoded = input.base64.includes(",") ? input.base64.split(",")[1] : input.base64;
      const image = Buffer.from(encoded, "base64");
      if (!image.length || image.length > 20_000_000) throw new Error("La imagen original debe pesar como máximo 20 MB.");
      let optimized: Buffer;
      try {
        optimized = await sharp(image, { failOn: "none", limitInputPixels: 40_000_000 })
          .rotate()
          .resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 86, effort: 5, smartSubsample: true })
          .toBuffer();
      } catch {
        throw new Error("No se pudo leer esta imagen. Usa JPG, PNG, WebP o AVIF válido.");
      }
      const cleanBaseName = input.filename.replace(/[^a-zA-Z0-9_-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "vivienda";
      const result = await storagePut(`viviendas/${ctx.user.id}/${Date.now()}-${cleanBaseName}.webp`, optimized, "image/webp");
      return { ...result, originalBytes: image.length, optimizedBytes: optimized.length, savedPercent: Math.max(0, Math.round((1 - optimized.length / image.length) * 100)) };
    }),
    uploadHeroVideo: adminProcedure.input(z.object({ filename: z.string().trim().min(1).max(180), mimeType: z.enum(["video/mp4", "video/webm"]), base64: z.string().min(1).max(65_000_000) })).mutation(async ({ input, ctx }) => { const encoded = input.base64.includes(",") ? input.base64.split(",")[1] : input.base64; const video = Buffer.from(encoded, "base64"); if (!video.length || video.length > 45_000_000) throw new Error("El vídeo debe pesar como máximo 45 MB."); const cleanName = input.filename.replace(/[^a-zA-Z0-9._-]/g, "-"); return storagePut(`videos-portada/${ctx.user.id}/${Date.now()}-${cleanName}`, video, input.mimeType); }),
  }),
});

export type AppRouter = typeof appRouter;
