export function normalizeWhatsAppPhone(phone?: string | null) {
  return (phone || "").replace(/\D/g, "");
}

export function buildWhatsAppLink(phone?: string | null, message?: string | null) {
  const digits = normalizeWhatsAppPhone(phone);
  if (!digits) return null;
  const greeting = message?.trim() || "Hola, me interesa una vivienda de Vivienda Nova.";
  return `https://wa.me/${digits}?text=${encodeURIComponent(greeting)}`;
}

export function clampWhatsAppInterval(seconds?: number) {
  return Math.max(15, Math.min(120, seconds || 30));
}
