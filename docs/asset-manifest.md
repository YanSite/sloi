# Asset Plan — Florist (v1)

The **ASSETS** layer, expanded into a production plan. Local WOW Engine is
a rapid production system for local businesses — the goal is a convincing
WOW demo, produced quickly and repeatedly, not one expensive portfolio
site. This plan exists to prove a premium-feeling 10-scene page doesn't
require a unique photograph per section, and to fix exactly which assets
get made, in what order, before any of them are.

**Scope of this phase:** planning only.

- **No Higgsfield generation call is made in this phase.** No credits
  spent. Every prompt below is a draft, not a submission.
- No entries committed to
  [floristAssetManifest](../src/config/verticals/florist/asset-manifest.ts)
  — it stays `[]` until this plan is approved.
- Approval still has to go through the exact sequence in
  [generation-policy.md](./generation-policy.md):
  `PLAN → show plan → show budget → wait for approval → GENERATE`. This
  document is the "show plan" and "show budget" steps ([§2](#2-minimum-viable-asset-set),
  [§4](#4-higgsfield-budget)). Nothing here authorizes generation by
  itself.

Built on [visual-dna.md](./visual-dna.md) (the art direction every asset
below is produced against, including the three
[Signature WOW moments](./visual-dna.md#signature-wow-moments)) and
[experience-map.md](./experience-map.md) (which scene needs what).

## 1. Asset economy principle

This is a factory, not a bespoke shoot per business. The default
assumption is **reuse**, not **generate**:

- A scene's Asset Requirement in [experience-map.md](./experience-map.md)
  saying "photography" does not by itself justify a new generation — it's
  a cue to check whether an existing or reused asset already covers it
  first.
- **Demo mode target: exactly 4 MUST_HAVE Higgsfield images (the full
  demo cap), 1 NICE_TO_HAVE candidate held in reserve and not authorized,
  0 videos by default** — see [§4](#4-higgsfield-budget) for the full
  accounting against [generation-policy.md](./generation-policy.md).
- Preference order for covering a scene's visual need:
  1. A real business photo the client already has or can take cheaply
     (storefront, workshop, arrangements) — zero Higgsfield cost.
  2. An existing generated asset, recropped/re-graded/masked via CSS into
     a different composition.
  3. A new Higgsfield generation — only when neither of the above can
     credibly cover the scene, and only within the demo cap.

## 2. Minimum viable asset set

Nine assets, in the structured format the plan is reviewed against — four
Higgsfield generations cover the entire page's generated imagery, one
Higgsfield candidate is proposed but held back, and four are real-business
photography.

---

**ASSET ID:** `hero-atmosphere`
**PURPOSE:** Full-bleed cinematic establishing shot — sets the entire
visual language in one image; the asset behind
[WOW Moment #1](./visual-dna.md#signature-wow-moments).
**SCENE:** Cinematic Hero (primary)
**SOURCE:** HIGGSFIELD
**WHY IT NEEDS GENERATION:** No photo a local florist has on hand
achieves controlled single-source Botanical Noir lighting at hero-image
quality — this is the one shot the whole system's visual identity rides
on.
**PROMPT CONCEPT:** Macro photograph of a single deep-burgundy peony
emerging from near-total darkness. One raking source of warm window
light at 45° from camera-left; background falls to near-black bitumen
brown (`#15110D`). Shallow depth of field, one sharp focal plane on the
nearest petal edge, soft falloff within centimeters. Visible fine film
grain, dust motes suspended in the light beam, a muted olive stem faintly
visible at lower frame. No props, no text. Medium-format film aesthetic,
Dutch still-life lighting reference, photographic realism — not
painterly, not a render.
**ASPECT RATIO:** 16:9
**EXPECTED REUSE:** Final CTA (re-graded/recropped bookend,
[WOW Moment #3](./visual-dna.md#signature-wow-moments)) — 2 placements
total.
**PRIORITY:** MUST_HAVE

---

**ASSET ID:** `flagship-bouquet`
**PURPOSE:** The flagship arrangement — the single product the
conversion narrative centers on; the asset behind
[WOW Moment #2](./visual-dna.md#signature-wow-moments).
**SCENE:** Product Reveal (primary)
**SOURCE:** HIGGSFIELD
**WHY IT NEEDS GENERATION:** The flagship arrangement needs the same
controlled lighting recipe as the hero to read as part of one campaign —
an ordinary snapshot of a real bouquet wouldn't match.
**PROMPT CONCEPT:** Editorial photograph of one composed arrangement in a
dark oxidized-brass vessel: deep burgundy garden roses, ink-violet
anemones, muted sage eucalyptus. Positioned in the lower-right third of
frame on dark oiled wood. Single soft raking key light from upper-left,
background falling to near-black void. Shallow depth of field, only the
front-most bloom in critical focus, one deliberately imperfect browning
outer petal. Warm-white highlight falloff, visible photographic grain,
85mm-equivalent lens wide open, Flemish still-life composition,
photographic realism.
**ASPECT RATIO:** 4:5
**EXPECTED REUSE:** Collection Showcase (featured card, recropped);
Editorial Grid (one tile, tight crop + duotone) — 3 placements total.
**PRIORITY:** MUST_HAVE

---

**ASSET ID:** `detail-texture`
**PURPOSE:** Abstract macro accent — texture-forward filler for
non-narrative moments.
**SCENE:** none primary — accent only, reused across three scenes.
**SOURCE:** HIGGSFIELD
**WHY IT NEEDS GENERATION:** A true macro abstract (no recognizable full
bloom) at this lighting quality isn't something a phone camera reliably
produces, and it needs the same lighting recipe to stay in-family.
**PROMPT CONCEPT:** Extreme macro photograph of overlapping petals and
one stem, abstract, no full bloom recognizable. Dark background falling
to near-black, single raking light creating a graduated highlight across
the petal surface. Very shallow focus, most of frame softly dissolved,
warm sepia-shadow grade, visible grain. No props, no hands.
Texture-forward, photographic realism.
**ASPECT RATIO:** 1:1
**EXPECTED REUSE:** Editorial Statement (accent); Service Section
(accent); Editorial Grid (one tile) — 3 placements total.
**PRIORITY:** MUST_HAVE

---

**ASSET ID:** `atmospheric-editorial`
**PURPOSE:** A wider, moodier editorial frame — arrangement plus a
suggested environment (a hint of the stone sill / dark timber named in
[visual-dna.md](./visual-dna.md#background-treatment)) — giving the grid
and collection genuine visual variety beyond recrops of the same two
subjects.
**SCENE:** none primary — supporting variety across Editorial Grid /
Collection Showcase.
**SOURCE:** HIGGSFIELD
**WHY IT NEEDS GENERATION:** Exactly the kind of shot a real local
florist can't self-produce — a styled, wider environmental frame in the
exact lighting recipe, not just a close-up of a bouquet. Without it,
Editorial Grid and Collection Showcase lean on only two source images
recropped repeatedly, which risks feeling thin once the real page exists.
**PROMPT CONCEPT:** Editorial wide photograph of a flower arrangement on
a dark oiled-wood surface with a suggestion of a stone windowsill at
frame edge, single raking window light from camera-left, background
falling into near-total darkness beyond the sill. Wider framing than a
product shot — more scene, less object — arrangement still in the lower
third of frame. Shallow depth of field on the nearest blooms, soft
falloff into the implied room beyond. Visible grain, warm-shadow color
character, photographic realism, no people, no visible shop fixtures.
**ASPECT RATIO:** 4:5
**EXPECTED REUSE:** Editorial Grid (one tile); optionally Collection
Showcase's second card in place of a typographic note, decided at build
time — 1–2 placements, zero additional Higgsfield cost either way.
**PRIORITY:** MUST_HAVE

---

**ASSET ID:** `closing-visual`
**PURPOSE:** A dedicated Final CTA closing image, distinct from the
reused hero shot.
**SCENE:** Final CTA
**SOURCE:** HIGGSFIELD
**WHY IT NEEDS GENERATION:** Not needed by default —
[WOW Moment #3](./visual-dna.md#signature-wow-moments) is designed to
reuse `hero-atmosphere` at zero extra cost. Only relevant if, after v1
ships, the reused hero crop reads as too repetitive at Final CTA.
**PROMPT CONCEPT:** Not drafted. Would echo `hero-atmosphere`'s lighting
recipe from a different angle or subject, only once there's a concrete,
observed reason to need it.
**ASPECT RATIO:** 16:9 (matching Hero)
**EXPECTED REUSE:** Final CTA only, if ever generated.
**PRIORITY:** NICE_TO_HAVE — proposed as a candidate, **not authorized**
as part of this plan; see [§4](#4-higgsfield-budget) for why it doesn't
fit inside the demo cap alongside the four MUST_HAVE assets above.

---

**ASSET ID:** `workshop-photo`
**PURPOSE:** Real evidence of the maker and the craft — the "local
business" trust pillar.
**SCENE:** Story Section
**SOURCE:** REAL_BUSINESS
**WHY IT NEEDS GENERATION:** It doesn't — must not be generated. A
generated "local" photo would undermine the exact claim this scene
exists to make.
**PROMPT CONCEPT:** N/A — client-provided; graded to
[visual-dna.md](./visual-dna.md#image-grading)'s warm-shadow recipe after
the fact.
**ASPECT RATIO:** flexible, cropped to fit at build time.
**EXPECTED REUSE:** Story Section only.
**PRIORITY:** MUST_HAVE

---

**ASSET ID:** `storefront-photo`
**PURPOSE:** Real evidence of a physical, visitable place.
**SCENE:** Location Section
**SOURCE:** REAL_BUSINESS
**WHY IT NEEDS GENERATION:** Same reasoning as `workshop-photo` — must be
real.
**PROMPT CONCEPT:** N/A — client-provided; graded to match.
**ASPECT RATIO:** flexible.
**EXPECTED REUSE:** Location Section only.
**PRIORITY:** MUST_HAVE

---

**ASSET ID:** `customer-photos`
**PURPOSE:** Optional warmth alongside testimonial quotes.
**SCENE:** Social Proof
**SOURCE:** OPTIONAL (real-business, if used)
**WHY IT NEEDS GENERATION:** N/A.
**PROMPT CONCEPT:** N/A.
**ASPECT RATIO:** flexible.
**EXPECTED REUSE:** Social Proof only.
**PRIORITY:** NICE_TO_HAVE

---

**ASSET ID:** `press-logos`
**PURPOSE:** Existing press/partner brand marks, if any exist.
**SCENE:** Social Proof
**SOURCE:** OPTIONAL (real-business, if used)
**WHY IT NEEDS GENERATION:** N/A.
**PROMPT CONCEPT:** N/A.
**ASPECT RATIO:** as provided.
**EXPECTED REUSE:** Social Proof only.
**PRIORITY:** NICE_TO_HAVE

---

### Reuse map — how 4 Higgsfield assets cover ~9 placements

| Asset                   | Also appears in                            | Treatment that creates the variation                                                                                                                               |
| ----------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `hero-atmosphere`       | Final CTA                                  | Different crop region (mirrored/shifted), warmer CSS color-grade — reads as "the same room, later," not a repeated frame.                                          |
| `flagship-bouquet`      | Collection Showcase (featured card)        | Wider crop showing the vessel/base, no overlay, new caption — a different "moment" with the same subject.                                                          |
| `flagship-bouquet`      | Editorial Grid (one tile)                  | Tight crop on the bloom only, duotone overlay via CSS `mix-blend-mode` — reads as a graphic tile, not a repeated product photo.                                    |
| `detail-texture`        | Editorial Statement (optional accent)      | Small, low-opacity crop, mostly obscured behind headline type.                                                                                                     |
| `detail-texture`        | Service Section (optional accent)          | Small corner crop, low opacity, non-narrative.                                                                                                                     |
| `detail-texture`        | Editorial Grid (one tile)                  | Different crop than the Statement/Service placements, duotone-graded — the grid's second image tile.                                                               |
| `atmospheric-editorial` | Editorial Grid (one tile)                  | Wide frame, minimal cropping — the grid's third image tile, visually distinct from the other two because it's a different source photo, not just a different crop. |
| `atmospheric-editorial` | Collection Showcase (optional second card) | Used in place of a typographic-only note if it reads better during build — no extra cost either way.                                                               |

Editorial Grid now runs three image tiles (one per Higgsfield asset) plus
two pure typographic color-block tiles — more visual variety than a
two-image grid, at zero additional generation cost, because each tile
draws from a _different_ source photo rather than recropping the same
one repeatedly.

No Higgsfield asset appears in Story Section or Location Section — those
are covered by real photography, never generated, because a generated
image would undermine the "real local business" claim those two scenes
exist to make.

Real photography gets brought into the same tonal family through CSS
color-grading (matching
[visual-dna.md](./visual-dna.md#image-grading)'s warm-shadow, high-
contrast recipe), not through generation — a phone photo shot near one
window already has the raking-light quality this direction needs.

### Icons / typography / layout (no photography at all)

Service Section (process icons), Editorial Grid's two remaining
typographic tiles, and all headline/body text across every scene need no
asset — they're produced entirely in code against the palette and type
scale in [visual-dna.md](./visual-dna.md#mapping-to-the-visualdna-type).

## 3. Video

None of the "video is a strong upgrade" notes in
[experience-map.md](./experience-map.md) (Cinematic Hero, Product Reveal,
Story Section, Final CTA) clears the bar for v1: each scene already has a
still-image plan that fully executes its purpose. Spending a video
generation now, before the page exists to judge against, would be
spending it on a guess. **Default for v1 is zero video generations** —
the demo tier has no video allowance to spend in the first place (see
[generation-policy.md](./generation-policy.md#demo-mode-limit)), and
production's 2-video allowance (not active for this project) stays
unused regardless. See [§4](#4-higgsfield-budget) for the exact tier
numbers.

## 4. Higgsfield budget

Per-generation credit cost isn't estimated here — no pricing is exposed
to plan against, so this reports **counts only**, per
[generation-policy.md](./generation-policy.md).

**This plan's proposal:** 5 Higgsfield image candidates (4 MUST_HAVE +
1 NICE_TO_HAVE), 0 video candidates.

**Against demo mode** (current tier — see
[generation-policy.md](./generation-policy.md#demo-mode-limit), cap: 4
images / 0 videos / 1 retry per asset):

|                                                                   | Count                                                                                                                                                                        |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Planned generations (MUST_HAVE only)                              | 4 images, 0 video                                                                                                                                                            |
| Uses the full demo image cap                                      | Yes — 4 of 4                                                                                                                                                                 |
| Possible retries (1 per asset, only if a generation fails review) | up to 4                                                                                                                                                                      |
| **Maximum generation calls this phase, if all 4 are approved**    | **4 initial + up to 4 retries = up to 8 image API calls; 0 video calls**                                                                                                     |
| Video allowance used                                              | 0 of 0 (demo mode has no video allowance)                                                                                                                                    |
| Reserve candidate (`closing-visual`)                              | **Not counted — not authorized.** Generating it would be a 5th image, which exceeds the demo cap and needs explicit approval to go over the limit, independent of this plan. |

**Against production mode** (future tier, not active — see
[generation-policy.md](./generation-policy.md#production-mode-limit),
cap: 6 images / 2 videos / 1 retry per asset): the same 4 MUST_HAVE
assets fit comfortably, with headroom for `closing-visual` plus one more
candidate if a real client engagement ever moves past demo. Not relevant
to florist v1 today — documented here only so the numbers are ready if
that happens.

**What this plan is asking for approval on:** the 4 MUST_HAVE assets in
[§2](#2-minimum-viable-asset-set), up to 8 image generation calls total
accounting for retries, 0 video calls. Nothing else.

## 5. Generation order

The first generation is the highest-leverage visual and the one that
validates the whole Botanical Noir direction — everything after it is
judged against whether it matches. Generate one at a time, in this order,
not as a single batch:

1. **`hero-atmosphere`** — first, always. Highest leverage: it's WOW
   Moment #1's asset, the first thing every visitor sees, and the fastest
   way to confirm the lighting recipe (raking key, near-black warm
   ground, film grain, photographic — not rendered — realism) actually
   works before spending any more of the budget.
   **STOP-GATE:** If this asset doesn't clearly read as Botanical Noir —
   check against
   [visual-dna.md's negative visual rules](./visual-dna.md#negative-visual-rules)
   — stop. Revise the prompt or the direction and use the one allowed
   retry before generating anything else. Do not proceed to asset 2 on
   an unapproved hero.
2. **`flagship-bouquet`** — second, only once `hero-atmosphere` is
   approved. Validates the recipe holds on a denser, multi-bloom subject,
   and is WOW Moment #2's asset — second-highest leverage, since the
   first conversion CTA sits on this scene.
3. **`atmospheric-editorial`** — third. Lower risk than 1–2: it's a
   supporting/variety asset, not a hero moment, so more tolerant of
   minor inconsistency.
4. **`detail-texture`** — fourth and last of the MUST_HAVE set. Lowest
   risk of all four: an abstract macro shot is the most forgiving to
   re-crop or regenerate if something's slightly off, and nothing else
   depends on it looking a specific way.

`closing-visual` is not generated in this pass — see [§4](#4-higgsfield-budget).
Real-business photography (`workshop-photo`, `storefront-photo`, and the
optional Social Proof assets) has no ordering dependency on the
Higgsfield sequence and can be captured any time, in parallel.

## Engine mapping

`AssetManifestEntry` (see
[src/lib/types/asset-manifest.ts](../src/lib/types/asset-manifest.ts))
pairs one `asset_id` with exactly one `section`, and its `source` enum is
`"higgsfield" | "stock" | "client-provided" | "placeholder"` — this plan's
`REAL_BUSINESS` maps to `"client-provided"`, and `OPTIONAL` isn't a type
value at all, just a planning-stage flag for "not yet decided whether
this gets sourced." The reuse map in [§2](#2-minimum-viable-asset-set)
needs `flagship-bouquet` and `detail-texture` each behind entries in
three different `SectionId`s, and `hero-atmosphere` and
`atmospheric-editorial` behind two — so turning this plan into real
`floristAssetManifest` entries will mean either multiple manifest entries
per physical asset (one per section, sharing a prompt/generation but
distinct `asset_id`s, e.g. `flagship-bouquet--product-reveal` and
`flagship-bouquet--collection-showcase`), or a small type change (e.g.
`section: SectionId | SectionId[]`, or a `reusedFrom` pointer). Not
decided here — an implementation-phase question, same as the one flagged
in [experience-map.md](./experience-map.md#engine-mapping).

Once this plan is approved, the actual sequence is: write the approved
entries into `floristAssetManifest` with `status: "planned"` →
[generation-policy.md](./generation-policy.md)'s gate → `status:
"approved"` → generate, following [§5](#5-generation-order) → `status:
"generated"`. No step in that sequence has happened yet.

## Summary

- **4 MUST_HAVE Higgsfield images:** `hero-atmosphere`, `flagship-bouquet`,
  `detail-texture`, `atmospheric-editorial` — exactly the demo cap, 0
  video.
- **1 NICE_TO_HAVE Higgsfield candidate, not authorized:**
  `closing-visual` (Final CTA reserve).
- **4 real-business assets:** `workshop-photo`, `storefront-photo`
  (MUST_HAVE), `customer-photos`, `press-logos` (NICE_TO_HAVE, optional).
- **Maximum generation calls if approved:** up to 8 image API calls
  (4 assets × up to 1 retry each), 0 video calls.
- **Generation order:** `hero-atmosphere` → stop-gate → `flagship-bouquet`
  → `atmospheric-editorial` → `detail-texture`.
- Still nothing generated, nothing approved, nothing spent.
