type SitemapProperty = {
  slug: string;
  updatedAt: Date;
};

function xml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;",
  })[character] || character);
}

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/+$/, "");
}

export function buildRobotsTxt(origin: string) {
  const canonicalOrigin = normalizeOrigin(origin);
  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api/",
    "",
    `Sitemap: ${canonicalOrigin}/sitemap.xml`,
    "",
  ].join("\n");
}

export function buildSitemapXml(origin: string, properties: SitemapProperty[]) {
  const canonicalOrigin = normalizeOrigin(origin);
  const pages = [
    { location: `${canonicalOrigin}/`, lastmod: new Date().toISOString().slice(0, 10), priority: "1.0", changefreq: "daily" },
    ...properties.map((property) => ({
      location: `${canonicalOrigin}/vivienda/${encodeURIComponent(property.slug)}`,
      lastmod: new Date(property.updatedAt).toISOString().slice(0, 10),
      priority: "0.8",
      changefreq: "weekly",
    })),
  ];
  const entries = pages.map((page) => [
    "  <url>",
    `    <loc>${xml(page.location)}</loc>`,
    `    <lastmod>${page.lastmod}</lastmod>`,
    `    <changefreq>${page.changefreq}</changefreq>`,
    `    <priority>${page.priority}</priority>`,
    "  </url>",
  ].join("\n")).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`;
}

export function requestOrigin(headers: { host?: string; "x-forwarded-host"?: string; "x-forwarded-proto"?: string }, configuredOrigin?: string) {
  if (configuredOrigin?.trim()) return normalizeOrigin(configuredOrigin.trim());
  const host = (headers["x-forwarded-host"] || headers.host || "localhost:3000").split(",")[0].trim();
  const isLocal = host.startsWith("localhost") || host.startsWith("127.0.0.1") || host.startsWith("[::1]");
  const protocol = (headers["x-forwarded-proto"] || (isLocal ? "http" : "https")).split(",")[0].trim();
  return `${protocol}://${host}`;
}
