# Engine Architecture

Local WOW Engine is a reusable system for producing premium landing pages
for local businesses. The goal: a new business — even a new *vertical* — is
represented entirely through data and configuration, never by modifying the
reusable core.

## The equation

```
business = BusinessProfile + VisualDNA + Template + AssetManifest (+ ExperienceContent)
```

| Layer | Answers | Type | Lives in |
|---|---|---|---|
| Business data | "What are the facts?" | `BusinessProfile` | `src/config/verticals/<vertical>/business-profile.ts` |
| Visual DNA | "What does it look like?" | `VisualDNA` | `src/config/verticals/<vertical>/visual-dna.ts` |
| Experience structure | "What sections, in what order?" | `ExperienceMap` (inside `Template`) | `src/templates/<vertical>.template.ts` |
| Assets | "What images/video, and their status?" | `AssetManifest` | `src/config/verticals/<vertical>/asset-manifest.ts` |
| Business-specific content | "What does each section say?" | `ExperienceContent` | `src/config/verticals/<vertical>/content.ts` |
| Motion | "How does it move?" | `MotionConfig` / presets | `src/components/wow/motion` (vertical-agnostic) |
| Template | Binds vertical → default `ExperienceMap` | `Template` | `src/templates` |

Full type definitions: [src/lib/types](../src/lib/types).

## The reusable core

Two things never change per business or per vertical:

1. **WOW section components** — [src/components/wow/sections](../src/components/wow/sections).
   `CinematicHero`, `ProductReveal`, `FinalCTA`, etc. take generic props
   (`MediaRef`, `CtaLink`, plain strings) — never florist-specific fields
   like "bouquet type." A restaurant and a florist both render through the
   same `CinematicHero`.
2. **Motion primitives** — [src/components/wow/motion](../src/components/wow/motion).
   Presets like `fade-up` or `stagger-children` are vertical-agnostic by
   construction; a `VisualDNA.motionPersonality` value selects among them,
   it doesn't define new ones per business.

## Adding a new vertical without touching the core

To add, say, `barber`:

1. `src/config/verticals/barber/business-profile.ts` — real facts.
2. `src/config/verticals/barber/visual-dna.ts` — real palette/type/mood.
3. `src/config/verticals/barber/asset-manifest.ts` — planned assets (see
   [generation-policy.md](./generation-policy.md) before generating any).
4. `src/config/verticals/barber/content.ts` — section copy.
5. `src/templates/barber.template.ts` — which sections, in what order.
6. Register it in `src/templates/index.ts`'s `templateRegistry`.

No file under `src/components/wow` changes. `"barber"` is already a valid
`Vertical` (see [src/lib/types/vertical.ts](../src/lib/types/vertical.ts)),
alongside `florist`, `restaurant`, `beauty`, `dental`, `fitness`,
`automotive`, and `local-services`.

## Rendering (not yet built)

The piece intentionally missing in this phase: a function that takes a
`Vertical`, loads its `BusinessProfile` + `VisualDNA` + `Template` +
`AssetManifest` + `ExperienceContent`, and renders the `ExperienceMap` by
mapping each `SectionId` to its component with the right props. That's the
next phase, once the florist vertical's data and design are actually
filled in — see the "not implemented yet" list at the end of this
foundation work.

## Layer boundaries — what must never leak

- Section components must never import from `src/config/verticals/*`.
- `BusinessProfile` must never contain color/type/motion values (that's
  `VisualDNA`).
- `VisualDNA` must never contain business facts like phone numbers.
- `AssetManifest` entries reference a `SectionId`; they never embed a raw
  image URL or a generation credential.
