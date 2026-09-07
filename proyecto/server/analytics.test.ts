import { describe, expect, it } from "vitest";
import { createSiteVisit, getAnalyticsReport, getDefaultPublicSiteSettings, getPropertiesByIds, getTopPropertiesByViews, getVisitsByDateRange } from "../../proyecto/server/db";

describe("analytics helpers without database", () => {
  it("returns safe empty results when no database is configured", async () => {
    expect(await getVisitsByDateRange({})).toEqual([]);
    expect(await getTopPropertiesByViews(5)).toEqual([]);
    expect(await getPropertiesByIds([1, 2])).toEqual([]);
    const report = await getAnalyticsReport({ startDate: new Date("2020-01-01"), endDate: new Date() });
    expect(report.totals.visits).toBe(0);
    expect(report.totals.uniqueVisitors).toBe(0);
    expect(report.daily).toEqual([]);
    expect(report.topProperties).toEqual([]);
  });
  it("does not throw when recording a visit without database", async () => {
    await expect(createSiteVisit("anon-12345678", "es", "/", { deviceType: "mobile", scrollDepth: 150 })).resolves.toBeUndefined();
  });
  it("keeps crypto display disabled by default", () => {
    const defaults = getDefaultPublicSiteSettings();
    expect(defaults.cryptoEnabled).toBe(0);
    expect(JSON.parse(defaults.cryptoAcceptedTypes)).toEqual(["BTC", "ETH", "USDC"]);
  });
});
