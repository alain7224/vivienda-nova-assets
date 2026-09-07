import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, clampWhatsAppInterval, normalizeWhatsAppPhone } from "./floatingWhatsApp";

describe("floating WhatsApp", () => {
  it("normalizes a Spanish phone and encodes its greeting", () => {
    expect(normalizeWhatsAppPhone("+34 600 00 00 00")).toBe("34600000000");
    expect(buildWhatsAppLink("+34 600 00 00 00", "Hola desde Vivienda Nova")).toBe("https://wa.me/34600000000?text=Hola%20desde%20Vivienda%20Nova");
  });

  it("does not generate a destination without a phone and uses a safe frequency", () => {
    expect(buildWhatsAppLink("", "Hola")).toBeNull();
    expect(clampWhatsAppInterval(2)).toBe(15);
    expect(clampWhatsAppInterval(30)).toBe(30);
    expect(clampWhatsAppInterval(300)).toBe(120);
  });
});
