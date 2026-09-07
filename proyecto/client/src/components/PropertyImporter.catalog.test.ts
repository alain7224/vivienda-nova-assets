import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { readCsv } from "./PropertyImporter";

const catalogPath = resolve(process.cwd(), "..", "CORRECCION_DETALLES_CARACTERISTICAS_109.csv");

describe("corrected LRCostaHomes catalog", () => {
  it("imports all listings without malformed geographic placeholders", () => {
    const catalog = readCsv(readFileSync(catalogPath, "utf-8"));
    expect(catalog.errors).toEqual([]);
    expect(catalog.rows).toHaveLength(109);
    expect(catalog.rows.some((row) => /no se encontraron resultados|no results found/i.test(`${row.city} ${row.zone} ${row.address}`))).toBe(false);
  });

  it("keeps source-agency language out of public copy and uses verified galleries", () => {
    const catalog = readCsv(readFileSync(catalogPath, "utf-8"));
    expect(catalog.rows.every((row) => !/l\s*&\s*r\s*costa\s*homes|lrcostahomes/i.test(`${row.description} ${row.tag}`))).toBe(true);
    expect(catalog.rows.filter((row) => row.slug !== "local-comercial").every((row) => {
      const gallery = JSON.parse(row.galleryUrls || "[]") as string[];
      return Array.isArray(gallery) && gallery.length > 0 && gallery[0] === row.imageUrl;
    })).toBe(true);
  });
});
