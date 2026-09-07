import { describe, expect, it } from "vitest";
import { readCsv } from "./PropertyImporter";

const headers = "title;slug;address;city;zone;province;country;type;price;priceValue;bedrooms;bathrooms;surface;description;imageUrl;tag;status;linkMode;vendorId;externalUrl;referralParameter;referralCode";
const row = "Casa de la luz;casa-de-la-luz;Calle 1;Marbella;Sierra Blanca;Málaga;España;Casa;900000 €;900000;3;2;180;Una casa luminosa con patio.;https://images.example/casa.jpg;Nueva;published;redirect;;https://seller.example/casa;ref;MARTINEZ";

describe("readCsv", () => {
  it("accepts a valid published property with a direct seller URL", () => {
    const result = readCsv(`${headers}\n${row}`);
    expect(result.errors).toEqual([]);
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]?.referralCode).toBe("MARTINEZ");
  });

  it("requires an internal provider URL only when a redirect is selected", () => {
    const noSellerUrl = row.replace("https://seller.example/casa", "");
    const result = readCsv(`${headers}\n${noSellerUrl}`);
    expect(result.rows).toHaveLength(0);
    expect(result.errors[0]).toContain("enlace interno");
  });

  it("accepts a published Vivienda Nova capture listing without exposing a provider URL", () => {
    const capture = row.replace(";redirect;;https://seller.example/casa;", ";capture;;;" );
    const result = readCsv(`${headers}\n${capture}`);
    expect(result.errors).toEqual([]);
    expect(result.rows[0]?.linkMode).toBe("capture");
    expect(result.rows[0]?.externalUrl).toBeNull();
  });
  it("accepts semicolon CSV fields that contain commas", () => {
    const detailed = "Casa con piscina, jardín y vistas.";
    const result = readCsv(`${headers}\nCasa con piscina;villa-piscina;Calle 1;Marbella;Sierra Blanca;Málaga;España;Casa;900000 €;900000;3;2;180;${detailed};https://images.example/casa.jpg;Nueva;published;redirect;;https://seller.example/casa;ref;MARTINEZ`);
    expect(result.errors).toEqual([]);
    expect(result.rows[0]?.description).toBe(detailed);
  });

});
