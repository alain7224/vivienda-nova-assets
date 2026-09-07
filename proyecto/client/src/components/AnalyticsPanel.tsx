/** Panel privado de analítica: visitas por día, viviendas más vistas y tabla filtrable por fechas. */
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarDays, Download, Eye, Globe2, Loader2, MapPin, MonitorSmartphone, Search, Trophy, Users, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import "./AnalyticsPanel.css";

type VisitRow = { id: number; visitorId: string; locale: string; page: string; propertyId: number | null; referrer: string | null; deviceType: "mobile" | "tablet" | "desktop" | null; actionType: "view" | "scroll" | "contact" | "reserve"; scrollDepth: number | null; createdAt: Date | string };
type Report = {
  totals: { visits: number; uniqueVisitors: number; averageScrollDepth: number | null; topProperty: { propertyId: number; views: number; title: string | null } | null };
  daily: Array<{ date: string; visits: number; uniqueVisitors: number }>;
  topProperties: Array<{ propertyId: number; views: number; uniqueVisitors: number; title: string | null; city: string | null }>;
  byDevice: Array<{ label: string; count: number }>;
  byLocale: Array<{ label: string; count: number }>;
  topPages: Array<{ label: string; count: number }>;
  topReferrers: Array<{ label: string; count: number }>;
  visits: VisitRow[];
};

type RangeKey = "today" | "week" | "month" | "year" | "custom";

const RANGES: Array<{ key: RangeKey; label: string }> = [
  { key: "today", label: "Hoy" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
  { key: "year", label: "Año" },
  { key: "custom", label: "Rango" },
];

const DEVICE_LABELS: Record<string, string> = { mobile: "Móvil", tablet: "Tableta", desktop: "Escritorio", unknown: "Sin dato" };
const ACTION_LABELS: Record<string, string> = { view: "Vista", scroll: "Desplazamiento", contact: "Contacto", reserve: "Reserva" };

function toInputValue(date: Date) { return date.toISOString().slice(0, 10); }
function rangeDates(range: RangeKey): { startDate: string | null; endDate: string | null } {
  const end = new Date();
  const start = new Date();
  if (range === "today") return { startDate: toInputValue(start), endDate: toInputValue(end) };
  if (range === "week") { start.setDate(start.getDate() - 6); return { startDate: toInputValue(start), endDate: toInputValue(end) }; }
  if (range === "month") { start.setDate(start.getDate() - 29); return { startDate: toInputValue(start), endDate: toInputValue(end) }; }
  if (range === "year") { start.setFullYear(start.getFullYear() - 1); return { startDate: toInputValue(start), endDate: toInputValue(end) }; }
  return { startDate: null, endDate: null };
}

const formatDay = (value: Date | string) => new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
const shortVisitor = (visitorId: string) => visitorId.length > 13 ? `${visitorId.slice(0, 8)}…` : visitorId;

export default function AnalyticsPanel({ propertyNames, onClose }: { propertyNames: Map<number, string>; onClose: () => void }) {
  const [range, setRange] = useState<RangeKey>("month");
  const [custom, setCustom] = useState<{ startDate: string; endDate: string }>({ startDate: "", endDate: "" });
  const [search, setSearch] = useState("");
  const dates = range === "custom" ? { startDate: custom.startDate || null, endDate: custom.endDate || null } : rangeDates(range);
  const reportQuery = trpc.admin.analytics.useQuery({ startDate: dates.startDate, endDate: dates.endDate });
  const report = reportQuery.data as Report | undefined;
  const resolveName = (propertyId: number | null, fallback?: string | null) => {
    if (propertyId === null || propertyId === undefined) return "Escaparate";
    return propertyNames.get(propertyId) || fallback || `Vivienda #${propertyId}`;
  };
  const filteredVisits = useMemo(() => {
    const rows = report?.visits ?? [];
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter((visit) => [visit.visitorId, visit.locale, visit.page, visit.referrer, resolveName(visit.propertyId), visit.deviceType, visit.actionType].filter(Boolean).join(" ").toLowerCase().includes(query));
  }, [report?.visits, search, propertyNames]);
  const exportCsv = () => {
    const rows = filteredVisits;
    if (!rows.length) return;
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const header = ["fecha", "visitante", "vivienda", "pagina", "idioma", "dispositivo", "accion", "scroll", "origen"];
    const body = rows.map((visit) => [new Date(visit.createdAt).toISOString(), visit.visitorId, resolveName(visit.propertyId), visit.page, visit.locale, visit.deviceType || "", ACTION_LABELS[visit.actionType] || visit.actionType, visit.scrollDepth ?? "", visit.referrer || ""].map(escape).join(","));
    const blob = new Blob([`\uFEFF${header.join(",")}\n${body.join("\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `visitas-${dates.startDate || "inicio"}-${dates.endDate || "hoy"}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return <section className="editor-panel analytics-panel" aria-labelledby="analytics-title">
    <div className="editor-heading"><div><p className="admin-kicker"><span /> Métricas privadas</p><h2 id="analytics-title">Visitas y <em>audiencia.</em></h2></div><button type="button" className="editor-close" onClick={onClose}><X size={16} /> Cerrar</button></div>
    <div className="analytics-filters" role="group" aria-label="Rango de fechas">
      {RANGES.map((option) => <button key={option.key} type="button" className={range === option.key ? "is-active" : ""} onClick={() => setRange(option.key)}><CalendarDays size={14} /> {option.label}</button>)}
      {range === "custom" && <div className="analytics-custom"><input type="date" value={custom.startDate} max={custom.endDate || undefined} onChange={(event) => setCustom({ ...custom, startDate: event.target.value })} aria-label="Fecha inicial" /><input type="date" value={custom.endDate} min={custom.startDate || undefined} onChange={(event) => setCustom({ ...custom, endDate: event.target.value })} aria-label="Fecha final" /></div>}
      <button type="button" className="analytics-export" onClick={exportCsv} disabled={!filteredVisits.length}><Download size={14} /> Exportar CSV</button>
    </div>
    {reportQuery.isLoading ? <p className="analytics-loading"><Loader2 size={20} className="spin" /> Cargando métricas…</p> : report ? <>
      <div className="analytics-kpis">
        <div><Users size={18} /><p>Visitantes únicos</p><strong>{report.totals.uniqueVisitors}</strong></div>
        <div><Eye size={18} /><p>Visitas</p><strong>{report.totals.visits}</strong></div>
        <div><Trophy size={18} /><p>Vivienda más vista</p><strong>{report.totals.topProperty ? resolveName(report.totals.topProperty.propertyId, report.totals.topProperty.title) : "—"}</strong>{report.totals.topProperty ? <span>{report.totals.topProperty.views} vistas</span> : null}</div>
        <div><MonitorSmartphone size={18} /><p>Scroll medio</p><strong>{report.totals.averageScrollDepth === null ? "—" : `${report.totals.averageScrollDepth}%`}</strong></div>
      </div>
      <div className="analytics-grid">
        <article className="analytics-card analytics-card--wide"><h3>Visitas por día</h3>{report.daily.length ? <div className="analytics-chart"><ResponsiveContainer width="100%" height={240}><AreaChart data={report.daily} margin={{ top: 8, right: 12, left: -14, bottom: 0 }}><defs><linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d95f42" stopOpacity={0.45} /><stop offset="100%" stopColor="#d95f42" stopOpacity={0.04} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#e3ddd3" /><XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(value: string) => value.slice(5).split("-").reverse().join("/")} /><YAxis allowDecimals={false} tick={{ fontSize: 10 }} /><Tooltip formatter={(value: number, name: string) => [value, name === "visits" ? "Visitas" : "Visitantes únicos"]} labelFormatter={(value: string) => new Intl.DateTimeFormat("es-ES", { dateStyle: "full" }).format(new Date(`${value}T00:00:00`))} /><Area type="monotone" dataKey="visits" stroke="#d95f42" fill="url(#visitsFill)" strokeWidth={2} /><Area type="monotone" dataKey="uniqueVisitors" stroke="#112f3f" fill="none" strokeWidth={1.5} strokeDasharray="5 3" /></AreaChart></ResponsiveContainer></div> : <p className="analytics-empty">Sin visitas en este rango.</p>}</article>
        <article className="analytics-card"><h3>Viviendas más vistas</h3>{report.topProperties.length ? <ol className="analytics-ranking">{report.topProperties.map((entry) => <li key={entry.propertyId}><span><MapPin size={13} /> {resolveName(entry.propertyId, entry.title)}{entry.city ? <em> · {entry.city}</em> : null}</span><strong>{entry.views}</strong></li>)}</ol> : <p className="analytics-empty">Aún no hay vistas de fichas.</p>}</article>
        <article className="analytics-card"><h3>Dispositivos</h3><ul className="analytics-tags">{report.byDevice.filter((entry) => entry.count > 0).map((entry) => <li key={entry.label}><span>{DEVICE_LABELS[entry.label] || entry.label}</span><strong>{entry.count}</strong></li>)}</ul></article>
        <article className="analytics-card"><h3>Idiomas</h3><ul className="analytics-tags">{report.byLocale.map((entry) => <li key={entry.label}><span><Globe2 size={12} /> {entry.label}</span><strong>{entry.count}</strong></li>)}</ul></article>
        <article className="analytics-card"><h3>Páginas más vistas</h3><ul className="analytics-tags">{report.topPages.map((entry) => <li key={entry.label}><span>{entry.label}</span><strong>{entry.count}</strong></li>)}</ul></article>
        <article className="analytics-card"><h3>Origen de las visitas</h3>{report.topReferrers.length ? <ul className="analytics-tags">{report.topReferrers.map((entry) => <li key={entry.label}><span>{entry.label}</span><strong>{entry.count}</strong></li>)}</ul> : <p className="analytics-empty">Sin referencias registradas.</p>}</article>
      </div>
      <div className="analytics-card analytics-card--table"><div className="analytics-table-head"><h3>Registro de visitas</h3><label className="analytics-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por visitante, vivienda, página, idioma…" /></label></div>
        {filteredVisits.length ? <div className="analytics-table-wrap"><table className="analytics-table"><thead><tr><th>Fecha y hora</th><th>Visitante</th><th>Vivienda</th><th>Página</th><th>Idioma</th><th>Dispositivo</th><th>Acción</th><th>Scroll</th><th>Origen</th></tr></thead><tbody>{filteredVisits.slice(0, 200).map((visit) => <tr key={visit.id}><td>{formatDay(visit.createdAt)}</td><td title={visit.visitorId}>{shortVisitor(visit.visitorId)}</td><td>{resolveName(visit.propertyId)}</td><td>{visit.page}</td><td>{visit.locale}</td><td>{DEVICE_LABELS[visit.deviceType || "unknown"]}</td><td>{ACTION_LABELS[visit.actionType] || visit.actionType}</td><td>{visit.scrollDepth === null || visit.scrollDepth === undefined ? "—" : `${visit.scrollDepth}%`}</td><td>{visit.referrer ? visit.referrer.replace(/^https?:\/\//i, "").split("/")[0] : "—"}</td></tr>)}</tbody></table>{filteredVisits.length > 200 ? <p className="analytics-more">Mostrando 200 de {filteredVisits.length} registros. Exporta el CSV para verlos todos.</p> : null}</div> : <p className="analytics-empty">No hay visitas que coincidan con la búsqueda.</p>}
      </div>
    </> : <p className="analytics-loading">No se pudieron cargar las métricas.</p>}
  </section>;
}
