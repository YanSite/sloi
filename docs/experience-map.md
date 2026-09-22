# Experience Map

The **EXPERIENCE STRUCTURE** layer. Which WOW sections a business's page is
built from, in what order, and whether each is enabled. No copy, no styling,
no assets — pure composition.

## Type

Defined at [src/lib/types/experience-map.ts](../src/lib/types/experience-map.ts):

```ts
interface ExperienceMapEntry {
  section: SectionId;   // one of the 10 WOW sections, see below
  enabled: boolean;
  notes?: string;
}

type ExperienceMap = ExperienceMapEntry[];
```

`SectionId` (in [src/lib/types/section.ts](../src/lib/types/section.ts)) is
the closed set of reusable sections:

- `cinematic-hero`
- `editorial-statement`
- `product-reveal`
- `editorial-grid`
- `collection-showcase`
- `story-section`
- `service-section`
- `social-proof`
- `location-section`
- `final-cta`

Their component interfaces live in
[src/components/wow/sections](../src/components/wow/sections) — see
[engine-architecture.md](./engine-architecture.md) for how a `Template`
combines an `ExperienceMap` with those components.

## Business-specific content

Structure (which sections, what order) is reusable. The actual copy inside
each section — headlines, quotes, captions — is not, and lives in a
separate, deliberately loose type:

```ts
// src/lib/types/content.ts
type SectionContent = Record<string, unknown>;
type ExperienceContent = Partial<Record<SectionId, SectionContent>>;
```

It's loose because each section's real content shape isn't finalized until
that section is actually designed. Once `CinematicHero` (for example) has a
final prop interface, its slice of `ExperienceContent` can be tightened to
match.

## Current instance

- [src/templates/florist.template.ts](../src/templates/florist.template.ts) —
  the default `ExperienceMap` for the florist vertical (all 10 sections,
  enabled, in a reasonable default order).
- [src/config/verticals/florist/content.ts](../src/config/verticals/florist/content.ts) —
  empty; no copy has been written yet.
