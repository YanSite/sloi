# Business Profile

The **BUSINESS DATA** layer. Objective facts about one specific business —
name, contact details, hours, services, service area. Nothing about how the
page looks (that's [Visual DNA](./visual-dna.md)) and nothing about the
marketing copy written around those facts (that's business-specific content,
see [Experience Map](./experience-map.md)).

## Why it's separate

A restaurant and a florist both have a name, a phone number, and hours.
Keeping that shape generic means the same `BusinessProfile` type — and every
component that reads it — works for every vertical. Only the _values_ change
per business.

## Type

Defined at [src/lib/types/business-profile.ts](../src/lib/types/business-profile.ts):

```ts
interface BusinessProfile {
  vertical: Vertical;
  name: string;
  tagline?: string;
  description?: string;
  contact: BusinessContact; // phone, email, address
  hours?: BusinessHours[]; // per-day open/close
  services?: string[];
  products?: string[];
  serviceArea?: string;
  foundedYear?: number;
  socialLinks?: Record<string, string>;
}
```

## Current instance

[src/config/verticals/florist/business-profile.ts](../src/config/verticals/florist/business-profile.ts)
holds a placeholder florist profile. Every value is a `[BRACKETED_PLACEHOLDER]`
— it exists to prove the shape compiles, not to represent a real business.
Replace it with real client facts when the florist vertical moves past the
architecture phase.

## Adding a new business

1. Create `src/config/verticals/<vertical>/business-profile.ts`.
2. Export a `BusinessProfile` object with real facts.
3. Nothing else in the engine changes — templates and components consume
   the type, not the vertical.
