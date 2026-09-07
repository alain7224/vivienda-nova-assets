import { useMemo } from "react";
import { MapPin, UsersRound } from "lucide-react";
import { MapView } from "@/components/Map";
import "./ClientLeadsMap.css";

type Lead = {
  id: number;
  leadType: "property" | "construction" | "product";
  name: string;
  email: string;
  phone: string | null;
  preferredLocation: string | null;
  preferredProvince: string | null;
  latitude: string | null;
  longitude: string | null;
  budget: string | null;
  status: string;
  createdAt: Date;
  privacyAcceptedAt?: Date | null;
};

type Point = Lead & { lat: number; lng: number };
type Group = { key: string; lat: number; lng: number; leads: Point[] };

function getPoints(leads: Lead[]): Point[] {
  return leads.flatMap((lead) => {
    // The map is strictly private and only shows projects whose requester provided
    // location coordinates together with the mandatory privacy acknowledgement.
    if (lead.leadType !== "construction" || !lead.privacyAcceptedAt) return [];
    const lat = Number(lead.latitude);
    const lng = Number(lead.longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? [{ ...lead, lat, lng }] : [];
  });
}

function groupPoints(points: Point[]): Group[] {
  const groups = new Map<string, Group>();
  for (const lead of points) {
    // Rounding groups precisely overlapping requests. The pin remains at the true point;
    // the popover fans out individual cards rather than hiding ten markers under one another.
    const key = `${lead.lat.toFixed(6)},${lead.lng.toFixed(6)}`;
    const existing = groups.get(key);
    if (existing) existing.leads.push(lead);
    else groups.set(key, { key, lat: lead.lat, lng: lead.lng, leads: [lead] });
  }
  return [...groups.values()];
}

function makeCard(lead: Point): HTMLElement {
  const card = document.createElement("article");
  card.className = "client-map-card";
  const heading = document.createElement("strong"); heading.textContent = lead.name;
  const location = document.createElement("span"); location.textContent = [lead.preferredLocation, lead.preferredProvince].filter(Boolean).join(" · ") || "Ubicación indicada";
  const status = document.createElement("small"); status.textContent = lead.status === "new" ? "Nuevo" : lead.status.replaceAll("_", " ");
  card.append(heading, location, status);
  const contact = document.createElement("a"); contact.href = `mailto:${lead.email}`; contact.textContent = "Abrir contacto"; contact.setAttribute("aria-label", `Contactar con ${lead.name}`);
  card.append(contact);
  return card;
}

export default function ClientLeadsMap({ leads }: { leads: Lead[] }) {
  const points = useMemo(() => getPoints(leads), [leads]);
  const groups = useMemo(() => groupPoints(points), [points]);
  const center = useMemo(() => groups.length ? { lat: groups.reduce((sum, group) => sum + group.lat, 0) / groups.length, lng: groups.reduce((sum, group) => sum + group.lng, 0) / groups.length } : { lat: 39.4, lng: -3.7 }, [groups]);

  const addMarkers = (map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    const infoWindow = new window.google.maps.InfoWindow({ maxWidth: 330, pixelOffset: new window.google.maps.Size(0, -10) });
    for (const group of groups) {
      const position = { lat: group.lat, lng: group.lng };
      bounds.extend(position);
      const pin = document.createElement("button");
      pin.type = "button"; pin.className = "client-map-pin"; pin.textContent = String(group.leads.length); pin.title = `${group.leads.length} cliente${group.leads.length === 1 ? "" : "s"} en este punto`;
      const marker = new window.google.maps.marker.AdvancedMarkerElement({ map, position, title: pin.title, content: pin });
      const openCards = () => {
        const panel = document.createElement("section"); panel.className = "client-map-popover";
        const heading = document.createElement("p"); heading.textContent = group.leads.length === 1 ? "Cliente con ubicación confirmada" : `${group.leads.length} clientes en esta ubicación`;
        const note = document.createElement("small"); note.textContent = "Las tarjetas se abren separadas; la punta señala la ubicación exacta.";
        const cards = document.createElement("div"); cards.className = "client-map-popover__cards";
        group.leads.forEach((lead, index) => { const card = makeCard(lead); card.style.setProperty("--card-step", String(index)); cards.append(card); });
        panel.append(heading, note, cards);
        infoWindow.setContent(panel); infoWindow.open({ map, anchor: marker, shouldFocus: false });
      };
      marker.addListener("click", openCards);
      pin.addEventListener("click", openCards);
    }
    if (groups.length === 1) { map.setCenter({ lat: groups[0].lat, lng: groups[0].lng }); map.setZoom(13); }
    else if (groups.length > 1) map.fitBounds(bounds, 52);
  };

  return <section className="client-leads-map" aria-labelledby="client-map-title"><div className="client-leads-map__heading"><div><p className="admin-kicker"><span /> Vista privada</p><h2 id="client-map-title">Mapa de <em>clientes.</em></h2><p>Solo muestra solicitudes de construcción con ubicación enviada voluntariamente y aceptación de privacidad.</p></div><div className="client-leads-map__count"><UsersRound size={18} /><strong>{points.length}</strong><span>solicitudes<br />geolocalizadas</span></div></div>{points.length ? <><div className="client-leads-map__legend"><MapPin size={16} /><span>Un marcador agrupado evita solapamientos. Haz clic para desplegar las tarjetas separadas y su línea de ubicación.</span></div><MapView className="client-leads-map__canvas" initialCenter={center} initialZoom={6} onMapReady={addMarkers} /></> : <div className="client-leads-map__empty"><MapPin size={26} /><h3>Aún no hay ubicaciones para mostrar.</h3><p>Las solicitudes de construcción aparecerán aquí cuando incluyan coordenadas y consentimiento de privacidad.</p></div>}</section>;
}
