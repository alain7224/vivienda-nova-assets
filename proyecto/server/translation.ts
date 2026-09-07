/** Traducción estructurada de fichas inmobiliarias desde español a los mercados configurados. */
import { invokeLLM } from "./_core/llm";

export const SUPPORTED_LOCALES = ["en", "nl", "de", "sv", "no", "fr", "ro", "ru", "zh-CN", "de-CH", "fr-CH", "it-CH"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

type SpanishPropertyCopy = { title: string; city: string; zone: string; type: string; tag: string; description: string; features: string[] };
export type TranslatedPropertyCopy = SpanishPropertyCopy & { locale: SupportedLocale };

const languageNames: Record<SupportedLocale, string> = {
  en: "English", nl: "Dutch (Netherlands)", de: "German", sv: "Swedish", no: "Norwegian Bokmål", fr: "French", ro: "Romanian", ru: "Russian", "zh-CN": "Simplified Chinese", "de-CH": "Swiss German standard German", "fr-CH": "Swiss French", "it-CH": "Swiss Italian",
};

const entrySchema = {
  type: "object",
  properties: {
    title: { type: "string" }, city: { type: "string" }, zone: { type: "string" }, type: { type: "string" }, tag: { type: "string" }, description: { type: "string" }, features: { type: "array", items: { type: "string" }, maxItems: 30 },
  },
  required: ["title", "city", "zone", "type", "tag", "description", "features"],
  additionalProperties: false,
};

export async function translatePropertyCopy(copy: SpanishPropertyCopy, targetLocales: readonly SupportedLocale[] = SUPPORTED_LOCALES): Promise<TranslatedPropertyCopy[]> {
  const requestedLocales = targetLocales.filter((locale, index, array) => SUPPORTED_LOCALES.includes(locale) && array.indexOf(locale) === index);
  if (!requestedLocales.length) return [];
  const requested = requestedLocales.map(locale => `${locale}: ${languageNames[locale]}`).join("; ");
  const properties = Object.fromEntries(requestedLocales.map(locale => [locale, entrySchema]));
  const response = await invokeLLM({
    model: "gpt-5-mini",
    maxTokens: 6000,
    messages: [
      { role: "system", content: "You translate Spanish real-estate listing copy. Preserve all factual details, numbers and place names. Do not mention any source agency or seller. Translate features as short natural labels. Do not invent facts. Translate each field naturally for the requested locale. Return only data matching the requested JSON schema." },
      { role: "user", content: `Translate this Spanish property listing into: ${requested}. Source: ${JSON.stringify(copy)}` },
    ],
    outputSchema: {
      name: "property_translations",
      strict: true,
      schema: { type: "object", properties, required: [...requestedLocales], additionalProperties: false },
    },
  });
  const content = response.choices[0]?.message.content;
  if (typeof content !== "string") throw new Error("La traducción no devolvió un contenido válido.");
  const result = JSON.parse(content) as Record<SupportedLocale, SpanishPropertyCopy>;
  return requestedLocales.map(locale => ({ locale, ...result[locale] }));
}
