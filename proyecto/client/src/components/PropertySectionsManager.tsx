import { FormEvent, useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { CardStyle, CarouselProperty } from "./PropertyCarousel";
import "./PropertySectionsManager.css";

type Section = { id: number; title: string; subtitle: string; placement: "home" | "property"; propertyIds: string; cardStyle: CardStyle; background: string; active: number; sortOrder: number };

type SectionForm = { title: string; subtitle: string; placement: "home" | "property"; propertyIds: number[]; cardStyle: CardStyle; background: string; active: boolean; sortOrder: number };

const blank = (): SectionForm => ({ title: "Viviendas destacadas", subtitle: "Una selección manual de hasta cinco propiedades.", placement: "home", propertyIds: [], cardStyle: "shadow", background: "#eef2ee", active: true, sortOrder: 0 });

function decodeIds(value: string) { try { const list = JSON.parse(value); return Array.isArray(list) ? list.map(Number).filter(Number.isInteger).slice(0, 5) : []; } catch { return []; } }

export default function PropertySectionsManager({ properties, onClose }: { properties: CarouselProperty[]; onClose: () => void }) {
  const utils = trpc.useUtils();
  const query = trpc.admin.sections.useQuery();
  const create = trpc.admin.createPropertySection.useMutation();
  const update = trpc.admin.updatePropertySection.useMutation();
  const remove = trpc.admin.deletePropertySection.useMutation();
  const [form, setForm] = useState<SectionForm>(blank);
  const [editingId, setEditingId] = useState<number | null>(null);
  const rows = (query.data ?? []) as Section[];
  const selected = useMemo(() => new Set(form.propertyIds), [form.propertyIds]);
  const refresh = async () => { await Promise.all([utils.admin.sections.invalidate(), utils.propertySections.list.invalidate()]); };
  const pick = (id: number) => setForm((current) => {
    if (current.propertyIds.includes(id)) return { ...current, propertyIds: current.propertyIds.filter((value) => value !== id) };
    if (current.propertyIds.length >= 5) { toast.message("Cada sección admite como máximo cinco viviendas."); return current; }
    return { ...current, propertyIds: [...current.propertyIds, id] };
  });
  const move = (id: number, direction: -1 | 1) => setForm((current) => {
    const from = current.propertyIds.indexOf(id); const target = from + direction;
    if (from < 0 || target < 0 || target >= current.propertyIds.length) return current;
    const next = [...current.propertyIds]; [next[from], next[target]] = [next[target], next[from]];
    return { ...current, propertyIds: next };
  });
  const edit = (section: Section) => { setEditingId(section.id); setForm({ title: section.title, subtitle: section.subtitle, placement: section.placement, propertyIds: decodeIds(section.propertyIds), cardStyle: section.cardStyle, background: section.background, active: section.active === 1, sortOrder: section.sortOrder }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const submit = async (event: FormEvent) => { event.preventDefault(); if (!form.propertyIds.length) { toast.error("Elige al menos una vivienda para la sección."); return; } try { if (editingId) await update.mutateAsync({ ...form, id: editingId }); else await create.mutateAsync(form); toast.success(editingId ? "Sección actualizada" : "Sección creada"); setForm(blank()); setEditingId(null); await refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : "No se pudo guardar la sección."); } };
  const deleteSection = async (id: number) => { if (!window.confirm("¿Eliminar esta sección? Las viviendas no se borrarán.")) return; try { await remove.mutateAsync({ id }); toast.success("Sección eliminada"); await refresh(); } catch { toast.error("No se pudo eliminar la sección."); } };
  return <section className="property-sections-manager" aria-labelledby="sections-title">
    <div className="property-sections-manager__heading"><div><p className="admin-kicker"><span /> Organización visual</p><h2 id="sections-title">Secciones y <em>carruseles.</em></h2><p>Elige entre una y cinco viviendas, ordénalas y decide si aparecen en la portada o tras una ficha de vivienda.</p></div><button type="button" className="editor-close" onClick={onClose}>Cerrar</button></div>
    <form className="section-form" onSubmit={submit}><div className="section-form__grid"><label>Título de la sección<input required value={form.title} maxLength={140} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><label>Ubicación<select value={form.placement} onChange={(event) => setForm({ ...form, placement: event.target.value as SectionForm["placement"] })}><option value="home">Portada</option><option value="property">Ficha de vivienda</option></select></label><label className="section-form__wide">Texto corto opcional<textarea rows={2} maxLength={280} value={form.subtitle} onChange={(event) => setForm({ ...form, subtitle: event.target.value })} /></label><label>Diseño de tarjeta<select value={form.cardStyle} onChange={(event) => setForm({ ...form, cardStyle: event.target.value as CardStyle })}><option value="flat">Plano editorial</option><option value="three_d">3D discreto</option><option value="shadow">Sombra editorial</option><option value="frame">Marco premium</option><option value="grid">Mosaico 2×2</option><option value="minimal">Mínimo (solo texto)</option></select></label><label>Color de fondo<input type="color" value={form.background} onChange={(event) => setForm({ ...form, background: event.target.value })} /></label><label>Orden interno<input min={0} type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: Number(event.target.value) })} /></label><label className="section-form__toggle"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Mostrar al público</label></div>
      <div className="section-picker"><div><strong>Viviendas de la sección</strong><span>{form.propertyIds.length}/5 seleccionadas</span></div><div className="section-picker__selected">{form.propertyIds.length ? form.propertyIds.map((id, index) => { const property = properties.find((item) => item.id === id); return property ? <div key={id}><GripVertical size={15} /><span>{index + 1}. {property.title}</span><button type="button" onClick={() => move(id, -1)} aria-label="Subir vivienda"><ChevronUp size={15} /></button><button type="button" onClick={() => move(id, 1)} aria-label="Bajar vivienda"><ChevronDown size={15} /></button><button type="button" onClick={() => pick(id)} aria-label="Quitar vivienda"><Trash2 size={15} /></button></div> : null; }) : <p>Selecciona viviendas debajo; aparecerán aquí en ese orden.</p>}</div><div className="section-picker__properties">{properties.map((property) => <button type="button" className={selected.has(property.id) ? "is-selected" : ""} key={property.id} onClick={() => pick(property.id)}><img src={property.imageUrl} alt="" /><span><strong>{property.title}</strong><small>{property.type} · {property.price}</small></span>{selected.has(property.id) ? <Check size={17} /> : <Plus size={17} />}</button>)}</div></div>
      <div className="section-form__submit"><button className="admin-primary" disabled={create.isPending || update.isPending} type="submit">{editingId ? "Guardar cambios" : "Crear sección"}</button>{editingId ? <button type="button" className="admin-quiet" onClick={() => { setEditingId(null); setForm(blank()); }}>Cancelar edición</button> : null}</div>
    </form>
    <div className="property-sections-manager__saved"><h3>Secciones guardadas</h3>{rows.length ? rows.map((section) => <article key={section.id}><div><span>{section.placement === "home" ? "Portada" : "Ficha"} · {section.active ? "Visible" : "Oculta"}</span><h4>{section.title}</h4><p>{decodeIds(section.propertyIds).length} vivienda(s) · {section.cardStyle}</p></div><div><button type="button" onClick={() => edit(section)} aria-label={`Editar ${section.title}`}><Pencil size={16} /></button><button type="button" onClick={() => deleteSection(section.id)} aria-label={`Eliminar ${section.title}`}><Trash2 size={16} /></button></div></article>) : <p className="section-empty">Aún no hay secciones creadas. El carrusel de similares se genera automáticamente en cada ficha.</p>}</div>
  </section>;
}
