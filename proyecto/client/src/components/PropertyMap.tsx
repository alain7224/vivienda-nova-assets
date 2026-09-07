import { useEffect, useMemo, useState } from "react";

const DAY_MS = 86_400_000;
const CACHE_KEY = "vivienda-nova:geocode";

type CacheEntry = { lat: number; lng: number; at: number };
type CacheStore = Record<string, CacheEntry>;

function readCache(): CacheStore {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    return parsed && typeof parsed === "object" ? parsed as CacheStore : {};
  } catch { return {}; }
}

function writeCache(store: CacheStore) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(store)); } catch { /* almacenamiento lleno o no disponible */ }
}

/** Resuelve una dirección textual a coordenadas con Nominatim y las cachea 30 días para no repetir peticiones. */
export async function geocodeAddress(query: string): Promise<{ lat: number; lng: number } | null> {
  const key = query.trim().toLowerCase();
  if (!key) return null;
  const cached = readCache()[key];
  if (cached && Date.now() - cached.at < 30 * DAY_MS) return { lat: cached.lat, lng: cached.lng };
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`, { headers: { Accept: "application/json" } });
    if (!response.ok) return null;
    const results = await response.json() as Array<{ lat: string; lon: string }>;
    const first = results[0];
    if (!first) return null;
    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    writeCache({ ...readCache(), [key]: { lat, lng, at: Date.now() } });
    return { lat, lng };
  } catch { return null; }
}

/** Mapa de Google embebido que centra la vivienda aunque no tenga coordenadas guardadas: geocodifica zona + ciudad automáticamente. */
export default function PropertyMap({ latitude, longitude, zone, city, country = "España", address, title, className }: { latitude?: string | null; longitude?: string | null; zone?: string | null; city?: string | null; country?: string | null; address?: string | null; title: string; className?: string }) {
  const hasCoordinates = Boolean(latitude && longitude);
  const query = useMemo(() => [address, zone, city, country].filter((part) => part && part.trim()).join(", "), [address, zone, city, country]);
  const [resolved, setResolved] = useState<string | null>(null);
  useEffect(() => {
    if (hasCoordinates || !query) return;
    let cancelled = false;
    geocodeAddress(query).then((point) => { if (!cancelled && point) setResolved(`${point.lat},${point.lng}`); });
    return () => { cancelled = true; };
  }, [hasCoordinates, query]);
  const target = hasCoordinates ? `${latitude},${longitude}` : resolved || query;
  if (!target) return null;
  return <iframe className={className} title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(target)}&z=15&output=embed`} />;
}
