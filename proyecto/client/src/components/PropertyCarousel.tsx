import { useRef } from "react";
import { ArrowLeft, ArrowRight, Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import "./PropertyCarousel.css";

export type CarouselProperty = {
  id: number;
  slug: string;
  title: string;
  city: string;
  zone: string;
  type: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  surface: number;
  imageUrl: string;
  galleryUrls?: string | null;
  referenceCode?: string | null;
};

export type CardStyle = "flat" | "three_d" | "shadow" | "frame";

const fallback = "/manus-storage/chalet-minimalista-piscina_3bd4eca8.jpg";

function safeImage(event: React.SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === "true") {
    image.style.opacity = "0";
    return;
  }
  image.dataset.fallbackApplied = "true";
  image.src = fallback;
}

export default function PropertyCarousel({
  title,
  subtitle,
  properties,
  cardStyle = "shadow",
  background,
  compact = false,
}: {
  title: string;
  subtitle?: string;
  properties: CarouselProperty[];
  cardStyle?: CardStyle;
  background?: string;
  compact?: boolean;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  if (!properties.length) return null;
  const scroll = (direction: -1 | 1) => {
    viewport.current?.scrollBy({ left: direction * Math.max(280, viewport.current.clientWidth * 0.76), behavior: "smooth" });
  };
  return <section className={`property-carousel property-carousel--${cardStyle} ${compact ? "property-carousel--compact" : ""}`} style={background ? { background } : undefined} aria-label={title}>
    <div className="property-carousel__heading">
      <div>
        <p className="eyebrow eyebrow--dark"><span /> Selección relacionada</p>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      <div className="property-carousel__controls" aria-label="Desplazar viviendas">
        <button type="button" onClick={() => scroll(-1)} aria-label="Ver viviendas anteriores"><ArrowLeft size={18} /></button>
        <button type="button" onClick={() => scroll(1)} aria-label="Ver más viviendas"><ArrowRight size={18} /></button>
      </div>
    </div>
    <div className="property-carousel__viewport" ref={viewport} tabIndex={0}>
      {properties.slice(0, 5).map((property) => <a className="property-carousel__card" href={`/vivienda/${property.slug}`} key={property.id}>
        <div className="property-carousel__image"><img src={property.imageUrl} alt={property.title} loading="lazy" decoding="async" onError={safeImage} /><span>REF. {property.referenceCode || property.id}</span></div>
        <div className="property-carousel__copy"><p>{property.type} · {property.zone || property.city}</p><h3>{property.title}</h3><strong>{property.price}</strong><div><span><BedDouble size={14} /> {property.bedrooms}</span><span><Bath size={14} /> {property.bathrooms}</span><span><Ruler size={14} /> {property.surface} m²</span><span><MapPin size={14} /> {property.city}</span></div></div>
      </a>)}
    </div>
    <p className="property-carousel__hint">Desliza o usa las flechas para ver hasta cinco viviendas.</p>
  </section>;
}
