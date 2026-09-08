-- Migration 0018: Enhanced visitor tracking
-- Adds device type, referrer, action type, and scroll depth tracking to siteVisits

-- Add new columns to siteVisits table
ALTER TABLE "siteVisits"
ADD COLUMN IF NOT EXISTS "propertyId" integer,
ADD COLUMN IF NOT EXISTS "referrer" text,
ADD COLUMN IF NOT EXISTS "deviceType" text DEFAULT 'desktop',
ADD COLUMN IF NOT EXISTS "actionType" text DEFAULT 'view',
ADD COLUMN IF NOT EXISTS "scrollDepth" integer DEFAULT 0;

-- Add constraint for scroll depth (0-100)
ALTER TABLE "siteVisits"
ADD CONSTRAINT "siteVisits_scrollDepth_range" CHECK ("scrollDepth" >= 0 AND "scrollDepth" <= 100);

-- Add foreign key for propertyId (optional, if property exists)
ALTER TABLE "siteVisits"
ADD CONSTRAINT "siteVisits_propertyId_fk" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE SET NULL;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS "idx_siteVisits_propertyId" ON "siteVisits"("propertyId");
CREATE INDEX IF NOT EXISTS "idx_siteVisits_deviceType" ON "siteVisits"("deviceType");
CREATE INDEX IF NOT EXISTS "idx_siteVisits_actionType" ON "siteVisits"("actionType");
CREATE INDEX IF NOT EXISTS "idx_siteVisits_createdAt_propertyId" ON "siteVisits"("createdAt" DESC, "propertyId");
CREATE INDEX IF NOT EXISTS "idx_siteVisits_visitorId_createdAt" ON "siteVisits"("visitorId", "createdAt" DESC);

-- Create composite index for analytics queries
CREATE INDEX IF NOT EXISTS "idx_siteVisits_analytics" ON "siteVisits"("createdAt" DESC, "deviceType", "actionType", "scrollDepth");
