import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Bath, BedDouble, MapPin, Ruler, X } from "lucide-react";
import PropertyMap from "@/components/PropertyMap";
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
  address?: string | null;
  country?: string | null;
  latitude?: string | null;
  longitude?: string | null;
};

export type CardStyle = "flat" | "three_d" | "shadow" | "frame" | "grid" | "minimal";

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
  const [mapProperty, setMapProperty] = useState<CarouselProperty | null>(null);
  if (!properties.length) return null;
  const scroll = (direction: -1 | 1) => {
    viewport.current?.scrollBy({ left: direction * Math.max(280, viewport.current.clientWidth * 0.76), behavior: "smooth" });
  };
  const cards = cardStyle === "grid" ? properties.slice(0, 4) : properties.slice(0, 5);
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
      {cards.map((property) => <div className="property-carousel__card" key={property.id}>
        <a className="property-carousel__card-link" href={`/vivienda/${property.slug}`}>
          <div className="property-carousel__image"><img src={property.imageUrl} alt={property.title} loading="lazy" decoding="async" onError={safeImage} /><span>REF. {property.referenceCode || property.id}</span></div>
          <div className="property-carousel__copy"><p>{property.type} · {property.zone || property.city}</p><h3>{property.title}</h3><strong>{property.price}</strong><div><span><BedDouble size={14} /> {property.bedrooms}</span><span><Bath size={14} /> {property.bathrooms}</span><span><Ruler size={14} /> {property.surface} m²</span></div></div>
        </a>
        <button type="button" className="property-carousel__location" onClick={() => setMapProperty(property)} title={`Ver ubicación de ${property.title}`} aria-label={`Ver ubicación de ${property.title}`}><MapPin size={13} /> <span>{property.city}</span></button>
      </div>)}
    </div>
    <p className="property-carousel__hint">Desliza o usa las flechas para ver hasta cinco viviendas.</p>
    {mapProperty && <div className="carousel-map-backdrop" role="presentation" onMouseDown={() => setMapProperty(null)}><section className="carousel-map-dialog" role="dialog" aria-modal="true" aria-label={`Ubicación de ${mapProperty.title}`} onMouseDown={(event) => event.stopPropagation()}><button type="button" className="carousel-map-close" onClick={() => setMapProperty(null)} aria-label="Cerrar mapa"><X size={18} /></button><div className="carousel-map-heading"><p><MapPin size={14} /> Ubicación</p><h3>{mapProperty.title}</h3><span>{mapProperty.address || `${mapProperty.zone}, ${mapProperty.city}`}</span></div><PropertyMap title={`Mapa de ${mapProperty.title}`} latitude={mapProperty.latitude} longitude={mapProperty.longitude} address={mapProperty.address} zone={mapProperty.zone} city={mapProperty.city} country={mapProperty.country || "España"} className="carousel-map-canvas" /></section></div>}
  </section>;
}
