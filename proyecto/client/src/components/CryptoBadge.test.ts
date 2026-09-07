import { describe, expect, it } from "vitest";
import { CRYPTO_OPTIONS, parseCryptoTypes } from "./CryptoBadge";

describe("parseCryptoTypes", () => {
  it("returns the default options when nothing is stored", () => {
    expect(parseCryptoTypes(null)).toEqual([...CRYPTO_OPTIONS]);
    expect(parseCryptoTypes("")).toEqual([...CRYPTO_OPTIONS]);
    expect(parseCryptoTypes("not-json")).toEqual([...CRYPTO_OPTIONS]);
  });

  it("keeps only valid ticker symbols and limits the list", () => {
    expect(parseCryptoTypes('["BTC","ETH","USDC"]')).toEqual(["BTC", "ETH", "USDC"]);
    expect(parseCryptoTypes('["BTC","invalid ticker!","ETH",123]')).toEqual(["BTC", "ETH"]);
    expect(parseCryptoTypes('["AA","BB","CC","DD","EE","FF","GG","HH","II"]')).toHaveLength(8);
  });
});
