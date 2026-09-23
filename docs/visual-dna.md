# Visual DNA — Florist (v1)

The **VISUAL DNA** layer, expanded into a full art-direction spec. One
coherent visual concept — not a moodboard of options — precise enough that
every future asset (generated, stock, or client-provided) can be produced
consistently against it, by anyone, without redefining the look each time.

**Scope of this phase:** art direction only.

- No image/video generated, no Higgsfield credits spent. Any prompt draft
  below is a _plan_, subject to the approval gate in
  [generation-policy.md](./generation-policy.md).
- No `floristVisualDNA` values committed to
  [visual-dna.ts](../src/config/verticals/florist/visual-dna.ts) — that
  stays `"TBD"` until this direction is approved.

Built on [experience-map.md](./experience-map.md) — this concept has to
work across all 10 scenes and survive the lean asset economy in
[asset-manifest.md](./asset-manifest.md), where 4 must-have generated
images (plus one held-in-reserve) carry the whole page.

## The one concept: Botanical Noir

A contemporary photographic translation of 17th-century Dutch/Flemish
still-life painting (de Heem, Ruysch, van Huysum) — not the vanitas
subject matter, but the **light recipe**: a single raking source pulling
form out of near-total darkness, so a bloom reads as sculptural and
inevitable rather than merchandised. The florist's arrangements are shot
the way those paintings were composed — one arrangement, one light, one
unresolved dark field around it.

This is the direction because it solves the production problem in
[asset-manifest.md](./asset-manifest.md) at once: it is visually
distinctive without depending on a specific location or season, and its
"recipe" (hard key light, near-black ground, one saturated color note) is
tight enough to reproduce consistently across a handful of separate
Higgsfield generations _and_ real client photography — a $0 phone photo
of the actual shop, lit near a single window and graded to match, sits in
the same visual family as the generated hero asset. That consistency is
what makes a small, fixed asset budget look intentional instead of thin —
the whole point of a system meant to produce a convincing demo quickly
and repeatedly, not one expensive portfolio site.

### Emotional tone

Reverent, unhurried, quietly dramatic. Attention is treated as something
earned, not seized — the opposite of a bright, evenly-lit product shot
shouting for a scroll-past thumb. Confidence comes from restraint: one
lit subject, one dark field, no clutter competing for the eye. Avoids
both florist-industry pastel-romantic cliché and clinical "clean beauty"
white-background cliché.

### Color palette

- Background — `#15110D`, a warm bitumen brown-black, never a neutral or
  cool-toned black.
- Foreground/text on dark — `#F3ECDF`, warm ivory, never pure white.
- Primary — `#6E2B34`, deep burgundy (the recurring "hero bloom" color).
- Secondary — `#4A5240`, muted, desaturated olive-sage (foliage; never
  kelly or mint green).
- Accent — `#B08D57`, aged/oxidized brass (props, dividers, hover states;
  never a bright gold or chrome).
  No pastel pink, no cool blue, no pure white or pure black anywhere in the
  system.

### Typography direction

- **Display** — a high-contrast, Didone-register serif (reference class:
  Canela, GT Sectra Display) for headlines set against generous dark
  space. Reads like engraved gallery wall-text, not a wedding-invitation
  script.
- **Heading** — the same family at a lighter weight, or a quiet
  complementary serif, for secondary titles (scene labels, occasion
  names).
- **Body** — a humanist sans (reference class: Söhne, National 2; Inter
  as an open-license fallback) kept strictly for legibility — it never
  competes with the display serif.
- Labels (occasion tags, nav, CTAs) set in wide-tracked small caps —
  museum wall-label register, not ecommerce button styling.

### Lighting

Single key, large soft source (window-diffused daylight or one softbox),
struck at roughly 45° to the subject. High lighting ratio — approximately
8:1 to 16:1, key to fill — so shadows fall to near-black rather than a
softened gray. No bounce fill lifting the shadow side. The subject should
look like it is emerging from the dark, not sitting on an evenly lit set.

### Camera language

Still and deliberate. Locked-off or slow, controlled movement only — no
handheld shake, no whip pans. Two registers alternate: extreme macro for
texture beats (Editorial Statement accent, detail crops) and a static,
"held-breath" medium shot for the hero product. Any camera movement paces
like a gallery walkthrough, not a product-ad push-in. On-screen, the only
places the camera is allowed to actually _move_ (as opposed to the still
frame a photograph implies) are the two builds named in
[Signature WOW moments](#signature-wow-moments) — everywhere else, "camera
language" describes how the photograph was shot, not how it animates.

### Lens language

Vintage-character prime equivalents, 85–135mm, shot wide open. Gentle
field curvature and soft edge vignette. Warm glass character rather than
clinical modern-optical sharpness. Flare, if present, comes only from the
single hard source — never a generic anamorphic streak or bokeh sparkle.

### Depth of field

Very shallow — f/1.4–f/2.8 equivalent. One plane of focus (a bloom edge,
a petal vein) is legible; everything else dissolves within centimeters.
Focus falloff is what CSS/WebGL blur simulates on the layered parallax in
Product Reveal — it doesn't need to be re-created with a real focus rack,
just approximated from one sharply-focused source photograph.

### Composition

Diagonal, off-center, classical still-life triangulation — the subject
sits in the lower two-thirds or to one side of frame. Never centered,
never a symmetrical catalog product shot.

### Negative space

Large and deliberate — 40–60% of any hero frame is unresolved dark field.
This is not empty leftover space; it is where headline type sits in
Cinematic Hero, Editorial Statement, and Final CTA. Negative space is
load-bearing, not decorative.

### Materials

Aged/oxidized brass, dark oiled wood, raw linen, hand-thrown or dark
glazed stoneware vessels, waxed kraft paper wrap. Never glossy cellophane,
printed ribbon, or plastic packaging.

### Background treatment

The background is never a passive backdrop — it's the same warm bitumen
black (`#15110D`) in every generated asset and every scene, acting as a
connective thread the whole page shares. It falls from a narrow lit zone
into true, deep, unlit darkness within a short distance — no gradient
rings, no vignette that reads as a lighting rig, no visible studio
backdrop seam or paper-roll curve. Environment is implied, not staged: a
suggestion of a stone sill or dark timber surface, or pure void — never a
full "shop interior" set in generated imagery. Real environments (the
actual shop, the actual workshop) appear only in client-provided Story
Section / Location Section photography, brought into the same tonal
family through grading, not through generation.

### Texture

Visible, fine photographic grain (ISO 400–800 film character, not
digital-clean). Petal surfaces show real imperfection — a browning edge,
a water droplet, a slightly loose outer petal. Deliberate imperfection is
what keeps this from reading as synthetic.

### Contrast

High global contrast — deep, unlifted blacks, no shadow detail forced
back in. Soft local contrast on the bloom itself, so petal falloff reads
skin-like rather than clipped and specular.

### Image grading

Warm-shifted shadows (a bitumen/sepia undertone, never neutral or
cool-blue-black). Slightly desaturated overall, except the single hero
bloom color per frame, which is allowed to read fully saturated — the one
deliberately "loud" element. Highlights are warm-white, never blown to a
cool white. Every asset — generated or real — gets graded to this recipe
before it ships; grading is what makes a phone photo of the actual
storefront sit in the same family as a Higgsfield hero shot.

### Photographic realism

Must read as a photograph of a real, physical arrangement in a real room
— reference class is editorial food/object photography for a design
magazine. Not a 3D render, not airbrushed AI-skin petal texture, not a
painting filter. This is the hardest-to-verify criterion in any generated
asset and the first thing to check before approving one — see
[Generation order](./asset-manifest.md#5-generation-order)'s stop-gate.

### Motion language

Slow, physical, gravity-bound — drift, settle, unfurl. Never bounce,
spring, or elastic easing. Reveals happen the way eyes adjust entering a
dark room: a slow aperture-opening feel, not a slide or wipe.

### Transition language

Cross-fade through the background black between scenes — never a hard
cut, never a horizontal ecommerce-carousel snap. Every scene boundary
briefly touches `#15110D` before the next scene resolves, reinforcing the
"emerging from darkness" motif set in Cinematic Hero. This is the
mechanism behind [WOW Moment #3](#signature-wow-moments) at Final CTA,
and it needs no WebGL — a timed CSS opacity/color transition is enough.

### WebGL language

WebGL is reserved for exactly the two builds named in
[Signature WOW moments](#signature-wow-moments) (Cinematic Hero, Product
Reveal) — never used decoratively elsewhere, and never required for any
scene's core content to be visible. Both builds are **camera-based**, not
simulation-based, for v1: scroll-linked scale/translate/opacity on one or
two image layers cut from a single photograph, not particle systems,
geometry, custom-authored displacement maps, or an image-sequence player.
No scene needs a second, WebGL-specific asset — the same photograph used
for the static layout is the WebGL texture. Every WebGL build must
degrade to a static image plus CSS transform/Ken-Burns for
`prefers-reduced-motion` and low-power devices, with no separate fallback
asset to produce. Target 60fps on a mid-range 2022-tier mobile device; a
build that can't hit that ships as its CSS fallback instead, not as a
degraded WebGL scene.

### Negative visual rules

A single checklist — for briefing a generation prompt, and for rejecting
a generated asset before it's approved:

- Never a pure white, pure black, or cool-toned background — always the
  warm bitumen `#15110D`.
- Never a symmetrical, centered, "catalog" product composition.
- Never bright, even, shadowless lighting, or a visible fill light.
- Never glossy cellophane, printed ribbon, plastic packaging, or floral
  foam visible in frame.
- Never a fully dressed/staged "shop interior" set in generated imagery.
- Never an airbrushed, poreless, obviously-synthetic petal surface, and
  never a look that reads as a 3D render or a painting filter.
- Never pastel pink or cool blue as a dominant color.
- Never bounce, spring, or elastic motion easing anywhere on the page.
- Never a hard cut or a horizontal carousel-snap transition between
  scenes.
- Never WebGL outside the two named Signature WOW builds.
- Never a multi-frame photographed sequence, a custom alpha/displacement
  mask, or a 3D product asset — that's the explicitly deferred v2
  "transformation" build, not v1's camera-language version.

## Signature WOW moments

Three moments, not one per scene, carry the entire "why does a business
owner say _I want this_" case for the engine — the full narrative
rationale for each is in
[experience-map.md](./experience-map.md#signature-wow-moments); this is
the production-ready spec for each, in the exact terms a build or a
generation prompt needs.

**NAME:** WOW Moment #1 — Hero Cinematic Reveal
**PURPOSE:** Shift the visitor's read of the site from "typical local
business page" to "considered, art-directed thing" in the first second,
before any text is read.
**WHAT THE USER SEES:** A single bloom resolving out of near-total
darkness, lit by one raking source; foreground and background separate
and drift at different rates as the page loads and as the visitor begins
to scroll.
**MOTION:** Layered parallax — a sharp foreground layer and a softer
background layer, cut from one photograph, moving at different scroll-
linked rates; a slow ambient drift loop before any scrolling happens.
**TECHNOLOGY:** WebGL/Three.js, two-layer scroll-linked parallax. CSS
Ken-Burns fallback for reduced-motion/low-power devices.
**ASSET REQUIRED:** `hero-atmosphere` (one photograph — see
[asset-manifest.md](./asset-manifest.md)).
**WHY IT CREATES A WOW MOMENT:** It's the only scene that has to be
flawless, because most first impressions of the whole site are formed
here alone, before any scrolling — and it's built from one photograph,
not a shoot.

**NAME:** WOW Moment #2 — Product Reveal
**PURPOSE:** Make the flagship arrangement feel inevitable and desired —
the emotional payoff after Hero and Editorial Statement — without
building a full product-transformation sequence.
**WHAT THE USER SEES:** The flagship arrangement, framed exactly as shot,
appearing to gain depth and presence as the visitor scrolls through a
pinned section — not rotating, not unwrapping, not unfurling.
**MOTION:** Scroll-linked camera zoom/dolly on one photograph, plus the
same two-layer parallax technique as Hero (sharp foreground bloom,
softly-blurred background layer from the same image).
**TECHNOLOGY:** WebGL/Three.js, scroll-linked scale/translate + two-layer
parallax on a single texture — no custom mask, no displacement shader, no
image-sequence player. CSS-parallax fallback for low-power devices.
**ASSET REQUIRED:** `flagship-bouquet` (one photograph).
**WHY IT CREATES A WOW MOMENT:** It reads as "this site has depth and
craft" from camera language alone — the wow is the confident, considered
motion, not literal transformation complexity. A full rotating/unfolding
sequence is an explicit v2 candidate, built only once v1 proves it's
worth the cost.

**NAME:** WOW Moment #3 — Final Transition into CTA
**PURPOSE:** Resolve the whole scroll journey by visibly returning to
where it started, then asking for the action — narrative closure, not a
generic "contact us" footer.
**WHAT THE USER SEES:** The page fades through the exact background black
it opened on, then resolves into the closing visual and the primary CTA —
the same room, later, at the end of the story.
**MOTION:** A timed cross-fade through `#15110D`, then a slow fade/scale-
in of the closing visual and a subtle pulse/glow on the CTA button.
**TECHNOLOGY:** Plain CSS transition (opacity/color-timed) — no WebGL.
Reliability and accessibility outrank spectacle on the one scene that
has to convert.
**ASSET REQUIRED:** None new — reuses `hero-atmosphere`, re-graded and
recropped.
**WHY IT CREATES A WOW MOMENT:** The payoff is structural, not
technical — a visitor who unconsciously registers "we're back where we
started" experiences narrative closure, which is what makes the ask feel
earned instead of bolted on. Costs zero additional assets.

Every scene outside these three — Editorial Statement, Editorial Grid,
Collection Showcase, Story Section, Service Section, Social Proof,
Location Section — is deliberately **not** trying to wow. Clean,
well-typeset, and consistent with this document, but spending "wow"
effort there would dilute these three rather than add to them.

## Mapping to the `VisualDNA` type

Concrete values for
[floristVisualDNA](../src/config/verticals/florist/visual-dna.ts) once
this direction is approved (see
[src/lib/types/visual-dna.ts](../src/lib/types/visual-dna.ts)):

```ts
{
  vertical: "florist",
  mood: ["reverent", "unhurried", "tactile", "quietly-dramatic"],
  colorPalette: {
    primary: "#6E2B34",
    secondary: "#4A5240",
    accent: "#B08D57",
    background: "#15110D",
    foreground: "#F3ECDF",
  },
  typography: {
    display: "Didone-register serif (Canela / GT Sectra Display class)",
    heading: "same family, lighter weight",
    body: "humanist sans (Söhne / National 2 class; Inter fallback)",
  },
  imageryStyle: "botanical-noir-still-life",
  motionPersonality: "gravity-drift",
}
```

`mood`, `colorPalette`, and `typography` map directly. `imageryStyle` and
`motionPersonality` are each a single free-text string, so they carry only
a slug here — the full Lighting/Lens/Camera/Composition/WebGL/Negative-
rules language above has no structured home in the current type. That's
fine for now: section components will read the type's five fields for
tokens and colors, while this document stays the source of truth an
implementer or a Higgsfield prompt references for everything else.
Whether that detail eventually needs its own field (e.g. a `styleGuideRef`
or richer `imageryStyle` object) is an implementation-phase question, not
decided here.

## Concrete asset plan

Which assets get produced against this direction, in what quantity, in
what order, and how they're reused across scenes:
[asset-manifest.md](./asset-manifest.md).
