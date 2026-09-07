import "./OfficeMap.css";

type OfficeMapProps = { embedUrl?: string | null };

export default function OfficeMap({ embedUrl }: OfficeMapProps) {
  if (!embedUrl) return null;
  return <section className="office-map" aria-labelledby="office-map-title"><div className="office-map__copy"><p className="eyebrow"><span /> Punto de atención</p><h2 id="office-map-title">Encuéntranos<br /><em>en el mapa.</em></h2><p>Consulta la ubicación de Vivienda Nova antes de visitarnos. El mapa se gestiona desde el administrador.</p></div><iframe title="Mapa de Vivienda Nova" src={embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /></section>;
}
