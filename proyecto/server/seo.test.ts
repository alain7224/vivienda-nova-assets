import { describe, expect, it } from "vitest";
import { buildRobotsTxt, buildSitemapXml, requestOrigin } from "./seo";

describe("search-engine discovery files", () => {
  it("publishes a robots policy with the canonical sitemap and protected admin route", () => {
    const robots = buildRobotsTxt("https://www.viviendanova.es/ ");
    expect(robots).toContain("Allow: /");
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toContain("Sitemap: https://www.viviendanova.es/sitemap.xml");
  });

  it("includes every published property as a canonical, XML-escaped URL", () => {
    const xml = buildSitemapXml("https://www.viviendanova.es", [
      { slug: "villa-piscina", updatedAt: new Date("2026-09-06T12:00:00Z") },
      { slug: "atico-&-mar", updatedAt: new Date("2026-09-05T12:00:00Z") },
    ]);
    expect(xml).toContain("https://www.viviendanova.es/vivienda/villa-piscina");
    expect(xml).toContain("https://www.viviendanova.es/vivienda/atico-%26-mar");
    expect(xml).toContain("2026-09-06");
  });

  it("uses a configured domain when available and proxy headers otherwise", () => {
    expect(requestOrigin({ host: "preview.example" }, "https://www.viviendanova.es/")).toBe("https://www.viviendanova.es");
    expect(requestOrigin({ host: "localhost:3000" })).toBe("http://localhost:3000");
    expect(requestOrigin({ host: "internal", "x-forwarded-host": "www.viviendanova.es", "x-forwarded-proto": "https" })).toBe("https://www.viviendanova.es");
  });
});
