import { Bitcoin } from "lucide-react";

export const CRYPTO_OPTIONS = ["BTC", "ETH", "USDC"] as const;

/** Lista de siglas válidas a partir del JSON guardado en ajustes. */
export function parseCryptoTypes(source?: string | null): string[] {
  try {
    const parsed = JSON.parse(source || "[]");
    const allowed = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && /^[A-Za-z0-9]{2,10}$/.test(item)) : [];
    return (allowed.length ? allowed : [...CRYPTO_OPTIONS]).slice(0, 8);
  } catch { return [...CRYPTO_OPTIONS]; }
}

const LABELS: Record<string, string> = {
  es: "Aceptamos", en: "We accept", nl: "Wij accepteren", de: "Wir akzeptieren", sv: "Vi accepterar", no: "Vi aksepterer", fr: "Nous acceptons", ro: "Acceptăm", ru: "Принимаем", "zh-CN": "接受", "de-CH": "Wir akzeptieren", "fr-CH": "Nous acceptons", "it-CH": "Accettiamo",
};

/** Nota meramente informativa: la web no procesa pagos con criptomonedas. */
export default function CryptoBadge({ enabled, types, locale = "es", variant = "badge" }: { enabled?: number | boolean; types?: string | null; locale?: string; variant?: "badge" | "section" }) {
  if (!enabled) return null;
  const accepted = parseCryptoTypes(types);
  const label = LABELS[locale] ?? LABELS.en;
  if (variant === "section") return <div className="crypto-section"><p className="crypto-section__title"><Bitcoin size={17} /> {label} {accepted.join(" · ")}</p><p className="crypto-section__note">{locale === "es" ? "Opción informativa: la gestión de la compraventa se realiza siempre por los canales habituales de Vivienda Nova." : "Information only: purchases are always arranged through the usual Vivienda Nova channels."}</p></div>;
  return <span className="crypto-badge" title={`${label} ${accepted.join(", ")}`}><Bitcoin size={13} /> {label} {accepted.join(" · ")}</span>;
}
