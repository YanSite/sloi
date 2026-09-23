# Engine Architecture

Local WOW Engine is a reusable system for producing premium landing pages
for local businesses. The goal: a new business — even a new _vertical_ — is
represented entirely through data and configuration, never by modifying the
reusable core. As of the Engine v1 Lock audit, this has been proven with
two verticals (florist, barber) rendering through one unmodified core — see
the Stage 8 Portability Report in the project history for the test itself.

## The equation

```
SiteConfig = BusinessProfile + VisualDNA + Experience(Template)
           + Content(ExperienceContent) + Assets(AssetManifest)
           + Theme(ThemeTokens) + Motion(MotionConfig)
```

| Layer                | Answers                                          | Type                                | Lives in                                                                                       |
| -------------------- | ------------------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| Business data        | "What are the facts?"                            | `BusinessProfile`                   | `src/config/verticals/<vertical>/business-profile.ts`                                          |
| Visual DNA           | "What does it look like?"                        | `VisualDNA`                         | `src/config/verticals/<vertical>/visual-dna.ts`                                                |
| Experience structure | "What sections, in what order, which variant?"   | `ExperienceMap` (inside `Template`) | `src/templates/<vertical>.template.ts`                                                         |
| Content              | "What does each section say?"                    | `ExperienceContent`                 | `src/config/verticals/<vertical>/content.ts`                                                   |
| Assets               | "What images/video, and their status?"           | `AssetManifest`                     | `src/config/verticals/<vertical>/asset-manifest.ts`                                            |
| Theme                | "What are the concrete, CSS-ready tokens?"       | `ThemeTokens`                       | `src/config/verticals/<vertical>/theme-tokens.ts`, resolved from VisualDNA via `src/lib/theme` |
| Motion               | "How does it move, sitewide?"                    | `MotionConfig`                      | Set directly on `SiteConfig.motion`; per-section overrides live on `ExperienceMapEntry.motion` |
| Composition          | Binds every layer above into one renderable unit | `SiteConfig`                        | `src/config/verticals/<vertical>/site-config.ts`                                               |

Full type definitions: [src/lib/types](../src/lib/types).

## The reusable core

Nothing under these paths changes per business or per vertical. Each is a
separate, independently-testable module — none of them import from
`src/config/verticals/*`, and none of them know a vertical's name:

1. **Types** — [src/lib/types](../src/lib/types). Every shape above, plus
   the closed enums (`SECTION_IDS`, `MOTION_PRESETS`, `ASSET_TYPES`,
   `ASSET_SOURCES`, `ASSET_STATUSES`, `VERTICALS`) the rest of the core
   validates against at runtime, since TypeScript's own checking is
   erased by the time anything actually executes.
2. **WOW section components** — [src/components/wow/sections](../src/components/wow/sections).
   `CinematicHero`, `ProductReveal`, `FinalCTA`, etc. take generic props
   (`MediaRef`, `CtaLink`, plain strings, a resolved `AssetManifest`, a
   `ThemeTokens`) — never vertical-specific fields. The same
   `CinematicHero` renders both the florist and the barber hero.
3. **Motion primitives** — [src/components/wow/motion](../src/components/wow/motion).
   `Reveal`, `Parallax`, `PinnedScroll`, `HorizontalScroll`, `Crossfade`,
   plus the `useMotionCapability()` hook every one of them reads instead
   of querying `matchMedia` independently. A `MotionPreset` slug selects
   among these; sections express _intent_, never animation code.
4. **WebGL layer** — [src/components/wow/webgl](../src/components/wow/webgl).
   `WebGLImageLayer` — a pure enhancement, never a hard dependency. Only
   used by Cinematic Hero and Product Reveal (the two Signature WOW
   Moments approved for it, see visual-dna.md); Final CTA never uses it.
5. **Asset resolver** — [src/lib/assets](../src/lib/assets).
   `resolveAsset(mediaRef, manifest)` is the only place a `MediaRef`
   becomes real render data (alt, focal point, responsive sources,
   status). A section never reads an `AssetManifest` entry or a file path
   directly.
6. **Theme resolver** — [src/lib/theme](../src/lib/theme).
   `resolveTheme(visualDNA, fonts, scaleOverrides?)` is the only way to
   produce a `ThemeTokens` — colors come straight from
   `VisualDNA.colorPalette`, so a vertical's theme can't drift from its
   approved visual direction. `defaultThemeScale` supplies
   spacing/radius/shadows/transitions/breakpoints unless overridden.
7. **Renderer** — [src/lib/render](../src/lib/render). See "Rendering
   pipeline" below.
8. **Validation** — [src/lib/validation](../src/lib/validation).
   `validateSiteConfig`/`assertValidSiteConfig` — required fields, valid
   section ids/order/variants, duplicate/missing sections, invalid
   motion/variant references, asset metadata, and asset reference
   resolution. Every vertical's `site-config.ts` wraps its export in
   `assertValidSiteConfig`, so a broken config fails loudly at import
   time, not mid-render.
9. **Generation workflow** — [src/lib/generation](../src/lib/generation).
   Encodes [generation-policy.md](./generation-policy.md) as a state
   machine (`PLANNED → APPROVED → GENERATING → GENERATED → REVIEW →
{APPROVED|RETRY|REJECTED}`) plus Demo/Production budget policies and a
   call-count estimator. A planning/authoring tool, not a pipeline that
   calls a generation provider — nothing in this project calls Higgsfield
   automatically.

## Rendering pipeline

`SiteConfig → PageRenderer → SectionRegistry → Section`:

1. `PageRenderer` ([src/lib/render/PageRenderer.tsx](../src/lib/render/PageRenderer.tsx))
   takes a `SiteConfig` and nothing else.
2. It calls `resolveSections(config)`
   ([resolve-sections.ts](../src/lib/render/resolve-sections.ts)), which
   reads order and which sections are enabled from
   `config.experience.experienceMap` — **never hardcoded** — and, for
   each enabled entry, looks up its component via the section registry
   and assembles its props from every `SiteConfig` layer (content,
   `assets`, `visualDNA`, `theme`, motion). One `SectionId`-keyed special
   case exists (`withBusinessFacts`): `location-section` gets
   `contact`/`hours` merged in from `BusinessProfile`, since those are
   business facts, not authored copy.
3. `resolveSectionComponent(section, variant)`
   ([section-registry.ts](../src/lib/render/section-registry.ts)) maps a
   `SectionId` + variant slug to a component — `"product-reveal"` +
   `"image-parallax"` resolves to a different registered implementation
   than `"product-reveal"` + `"default"`. Throws on an unregistered
   section/variant pair rather than degrading silently.
4. `defineContent`/`SectionContentMap`
   ([section-content.ts](../src/lib/render/section-content.ts)) gives a
   vertical's `content.ts` compile-time checking against each section's
   real props (minus the fields the renderer supplies itself) without
   `lib/types` having to import component prop shapes.

## Preview

[src/config/preview-registry.ts](../src/config/preview-registry.ts) maps a
slug to a `SiteConfig`; [app/preview/[slug]/page.tsx](../app/preview/%5Bslug%5D/page.tsx)
renders whichever one matches via the same `PageRenderer`.
[app/preview](../app/preview/page.tsx) lists every registered config.
Adding a vertical to preview is one line in that registry — no route or
component changes.

This file lives under `src/config`, not `src/lib/render` — it names real
verticals by import, which is exactly what the core layers above are never
allowed to do. A registry of real vertical configs is inherently
vertical-_aware_, so it belongs beside `config/verticals/*`.

## Adding a new vertical without touching the core

To add, say, `dental`:

1. `src/config/verticals/dental/business-profile.ts` — real facts.
2. `src/config/verticals/dental/visual-dna.ts` — real palette/type/mood/imageryStyle/motionPersonality.
3. `src/config/verticals/dental/theme-tokens.ts` — `resolveTheme(dentalVisualDNA, fonts, scaleOverrides?)`.
4. `src/config/verticals/dental/asset-manifest.ts` — planned assets (see
   [generation-policy.md](./generation-policy.md) before generating any).
5. `src/config/verticals/dental/content.ts` — section copy, via
   `defineContent(...)` for compile-time checking.
6. `src/templates/dental.template.ts` — which sections, in what order,
   which variants.
7. `src/config/verticals/dental/site-config.ts` — compose the above into
   one `SiteConfig`, wrapped in `assertValidSiteConfig(...)`.
8. `src/config/verticals/dental/index.ts` — barrel export.
9. Register the template in `src/templates/index.ts`'s `templateRegistry`.
10. Register the site config in `src/config/preview-registry.ts` to view
    it at `/preview/dental`.

No file under `src/lib` or `src/components/wow` changes. `"dental"` is
already a valid `Vertical` (see
[src/lib/types/vertical.ts](../src/lib/types/vertical.ts)).

## Layer boundaries — what must never leak

- `src/lib/types`, `src/components/wow/*`, `src/lib/render`,
  `src/lib/assets`, `src/lib/theme`, `src/lib/validation`,
  `src/lib/generation` must never import from `src/config/verticals/*` or
  reference a vertical by name.
- Section components must never import from `src/config/verticals/*`.
- `BusinessProfile` must never contain color/type/motion values (that's
  `VisualDNA`).
- `VisualDNA` must never contain business facts like phone numbers.
- `AssetManifest` entries reference a `SectionId`; they never embed a
  generation credential. A resolved file's `url` may be a real path, a
  remote URL, or (for a still-unproduced placeholder) a data URI — never
  a raw filesystem path assumed to exist.
- `ExperienceContent`/`SectionContent` (the `SiteConfig.content` field's
  actual type) stays loose (`Record<string, unknown>`) on purpose — see
  `src/lib/types/content.ts`. `defineContent`'s stricter checking is an
  authoring-time convenience in `lib/render`, not a change to that
  contract.

## Known, disclosed gaps (see the Engine v1 Lock Audit for the full list)

- Two config fixtures under `src/config/__fixtures__` (`demoSiteConfig`,
  `abstractTestSiteConfig`) exist purely to prove the renderer/theme
  system in isolation — they are not verticals and aren't meant to be
  extended like one.
- Six of the ten approved section types (`EditorialGrid`,
  `CollectionShowcase`, `StorySection`, `ServiceSection`, `SocialProof`,
  `LocationSection`) are still interface-only stubs (`return null`).
  Their content/asset/theme contracts are proven; their visual
  implementation is not.
