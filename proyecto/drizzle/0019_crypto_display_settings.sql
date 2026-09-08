-- Migration 0019: Cryptocurrency display settings and extended card styles
-- Adds cryptoEnabled and cryptoAcceptedTypes to siteSettings
-- Extends card style enums to support 6 styles (flat, three_d, shadow, frame, grid, minimal)

-- Add crypto columns to siteSettings
ALTER TABLE "siteSettings"
ADD COLUMN IF NOT EXISTS "cryptoEnabled" integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS "cryptoAcceptedTypes" text DEFAULT '[\"BTC\", \"ETH\", \"USDC\"]';

-- Add constraint: cryptoEnabled must be 0 or 1
ALTER TABLE "siteSettings"
ADD CONSTRAINT "siteSettings_cryptoEnabled_bool" CHECK ("cryptoEnabled" IN (0, 1));

-- Add constraint: cryptoAcceptedTypes must be valid JSON array
ALTER TABLE "siteSettings"
ADD CONSTRAINT "siteSettings_cryptoAcceptedTypes_json" CHECK (
  "cryptoAcceptedTypes" IS NULL OR
  json_valid("cryptoAcceptedTypes")
);

-- Create indexes for crypto queries (if needed)
CREATE INDEX IF NOT EXISTS "idx_siteSettings_cryptoEnabled" ON "siteSettings"("cryptoEnabled");

-- Note: Card style enums are extended in schema.ts and handled by the application layer.
-- The database will accept any string value for cardStyle in siteSettings and propertySections.
-- Valid values are: "flat", "three_d", "shadow", "frame", "grid", "minimal"
-- Application code (server/db.ts) validates and defaults to "flat" if invalid.
