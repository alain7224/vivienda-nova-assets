import { describe, expect, it } from "vitest";
import { ADMIN_SESSION_TTL_MS } from "@shared/const";

describe("admin session security", () => {
  it("requires a new authenticated session after thirty minutes", () => {
    expect(ADMIN_SESSION_TTL_MS).toBe(30 * 60 * 1000);
  });
});
