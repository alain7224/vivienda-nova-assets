import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import "./EditorialCards.css";

export type EditorialCard = { id: string; type: "image" | "video"; title: string; description: string; url: string; background: string; textColor: string; width: number; height: number; active: boolean };

export function parseEditorialCards(source?: string | null): EditorialCard[] {
  try {
    const parsed = JSON.parse(source || "[]");
    return Array.isArray(parsed) ? parsed.filter((item): item is EditorialCard => item && (item.type === "image" || item.type === "video") && typeof item.url === "string" && item.url.startsWith("/manus-storage/") && item.active !== false).slice(0, 12) : [];
  } catch { return []; }
}

export default function EditorialCards({ source }: { source?: string | null }) {
  const cards = useMemo(() => parseEditorialCards(source), [source]);
  if (!cards.length) return null;
  return <section className="editorial-cards" aria-label="Contenido editorial">
    <div className="editorial-cards__heading"><p className="eyebrow eyebrow--dark"><span /> Selección visual</p><h2>Espacios <em>que inspiran.</em></h2></div>
    <div className="editorial-cards__grid">{cards.map((card) => <article key={card.id} className="editorial-card" style={{ backgroundColor: card.background, color: card.textColor, gridColumn: `span ${Math.min(12, Math.max(1, card.width))}`, minHeight: card.height }}>
      <div className="editorial-card__media">{card.type === "video" ? <video src={card.url} muted loop playsInline autoPlay preload="metadata" onError={(event) => { event.currentTarget.style.display = "none"; }} /> : <img src={card.url} alt={card.title || "Contenido editorial"} loading="lazy" decoding="async" onError={(event) => { event.currentTarget.style.display = "none"; }} />}<div className="editorial-card__shade" /></div>
      <div className="editorial-card__copy"><p className="editorial-card__type">{card.type === "video" ? "Vídeo editorial" : "Galería editorial"}</p><h3>{card.title}</h3>{card.description && <p>{card.description}</p>}<ArrowUpRight size={18} aria-hidden="true" /></div>
    </article>)}</div>
  </section>;
}
