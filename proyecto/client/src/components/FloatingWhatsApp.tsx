import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink, clampWhatsAppInterval, normalizeWhatsAppPhone } from "./floatingWhatsApp";
import "./FloatingWhatsApp.css";

export type WhatsAppWidgetStyle = "round" | "outlined" | "pill";

export default function FloatingWhatsApp({
  phone,
  enabled,
  style = "round",
  animationEnabled = true,
  animationIntervalSeconds = 30,
  message = "Hola, me interesa una vivienda de Vivienda Nova.",
}: {
  phone?: string | null;
  enabled?: boolean;
  style?: WhatsAppWidgetStyle;
  animationEnabled?: boolean;
  animationIntervalSeconds?: number;
  message?: string | null;
}) {
  const [celebrating, setCelebrating] = useState(false);
  const digits = normalizeWhatsAppPhone(phone);
  const delay = clampWhatsAppInterval(animationIntervalSeconds) * 1000;

  useEffect(() => {
    if (!enabled || !digits || !animationEnabled) return;
    const run = () => {
      setCelebrating(false);
      window.requestAnimationFrame(() => setCelebrating(true));
      window.setTimeout(() => setCelebrating(false), 1150);
    };
    const timer = window.setInterval(run, delay);
    return () => window.clearInterval(timer);
  }, [animationEnabled, delay, digits, enabled]);

  if (!enabled || !digits) return null;
  const href = buildWhatsAppLink(phone, message);
  if (!href) return null;
  return <a
    className={`floating-whatsapp floating-whatsapp--${style} ${celebrating ? "is-animating" : ""}`}
    href={href}
    target="_blank"
    rel="noreferrer"
    aria-label="Escribir por WhatsApp"
    title="Escribir por WhatsApp"
  >
    <MessageCircle size={style === "pill" ? 21 : 25} aria-hidden="true" />
    {style === "pill" ? <span>WhatsApp</span> : null}
  </a>;
}
