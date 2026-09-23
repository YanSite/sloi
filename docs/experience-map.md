# Experience Blueprint — Florist (v1)

The **EXPERIENCE STRUCTURE** layer, expanded into a full creative/UX
blueprint. This document defines the reusable _storytelling system_ the
engine is built around — not just which sections exist (that's the
`SectionId` type, see [Engine mapping](#engine-mapping) below), but why
each one exists, what it shows, what it says, how it moves, what it costs
in assets, and what it asks of the visitor.

**Scope of this phase:** structure and intent only.

- No final copywriting — content below is illustrative, in
  `[BRACKETED_PLACEHOLDER]` style matching
  [business-profile.ts](../src/config/verticals/florist/business-profile.ts).
- No assets generated or sourced — any image/video referenced here is a
  _requirement_, not a deliverable. Generation still goes through
  [generation-policy.md](./generation-policy.md)'s approval gate.
- No components built, no `content.ts` written, no `floristTemplate`
  changes committed. This is the design the implementation phase will
  follow.

First vertical: **florist**. Every scene is designed to generalize — see
[§7 Cross-vertical reusability](#7-cross-vertical-reusability).

## 1. Experience philosophy

Three forces have to hold at once: **luxury editorial** (the page reads
like a magazine feature, not a catalog), **cinematic storytelling** (mood
and pacing are directed, not just laid out), and **local business**
(a real, trustworthy, visitable place) — all in service of **conversion**
(the scroll has to end in an action). None of the four can be dropped: pure
editorial with no CTA is a portfolio piece; pure conversion with no
storytelling is a landing page; pure cinema with no local grounding is a
brand film, not a business.

What this explicitly is **not**:

| Generic ecommerce landing page       | This experience                                                               |
| ------------------------------------ | ----------------------------------------------------------------------------- |
| Uniform product grid up top          | One flagship product, revealed cinematically, before any grid                 |
| Stock hero banner + big "SHOP NOW"   | Atmospheric hero, no CTA at all in the first scene                            |
| CTA button repeated in every section | Exactly one soft CTA, one primary CTA — see [§4](#4-conversion-architecture)  |
| Star-rating widgets                  | Editorial-style pull-quotes                                                   |
| Specs and SKUs                       | Occasions and moments                                                         |
| Flat, uniform pacing                 | Directed pacing — beats of tension (hero, reveal) and rest (statement, story) |

## Signature WOW moments

This blueprint's structure answers "is this well organized?" It doesn't
yet answer the commercial question that actually sells the engine: in the
first 10 seconds, why does a business owner say _"I want this on my
site"_ — not just _"this is nicely laid out"_? Structure alone doesn't do
that; a small number of unmistakable moments do. Exactly **three**, not
one per scene — concentrating art-direction and engineering effort here
is what makes v1 feel expensive while costing three photographs (see
[§6](#6-lean-production-strategy-v1)). Three strong moments beat fifteen
small effects.

**WOW Moment #1 — Hero cinematic reveal** (Scene 1, Cinematic Hero,
0–8%). The first-second shift from "typical local business site" to "a
considered, art-directed thing": layered WebGL parallax pulling a bloom
out of near-total darkness. This is the one moment that has to be
flawless on load — most first impressions are made in this scene alone.

**WOW Moment #2 — Product reveal** (Scene 3, Product Reveal, 20–35%).
Deliberately _not_ a full transformation sequence (rotating bouquet,
unfolding wrap, unfurling petals) — that reads as impressive on a
mockup but is a production-grade-3D-sequence build for a factory of
local-business sites. v1's version is camera language, not
transformation: a scroll-linked zoom on one photograph plus a two-layer
parallax simulating depth. Cheap to build, still reads as "this site has
depth" — that's the wow, not literal motion complexity. A full
transformation sequence is an explicit v2 candidate, built only if v1
data shows it's worth the cost.

**WOW Moment #3 — Final transition into CTA** (Scene 10, Final CTA,
96–100%). The cross-fade-through-black bookend from
[visual-dna.md](./visual-dna.md#transition-language) — the page visibly
returns to the exact dark tone it opened on, then resolves into the ask.
No WebGL required, just a well-timed, well-graded CSS transition; the wow
here is narrative payoff, not rendering complexity.

Every other scene — Editorial Statement, Editorial Grid, Collection
Showcase, Story Section, Service Section, Social Proof, Location Section
— is deliberately **not** trying to wow. It has to be clean, well-typeset,
and consistent with [visual-dna.md](./visual-dna.md); spending "wow"
effort there would dilute these three rather than add to them.

## 2. The scroll journey (0% → 100%)

Ten scenes, an emotional arc from **attention → meaning → desire → breadth
→ depth → trust → clarity → validation → grounding → action**:

| Scroll  | Scene               | Beat                                                           |
| ------- | ------------------- | -------------------------------------------------------------- |
| 0–8%    | Cinematic Hero      | Attention — cinematic mood, no text pressure                   |
| 8–20%   | Editorial Statement | Meaning — the brand's philosophy, earned before any product    |
| 20–35%  | Product Reveal      | Desire — the single flagship object, theatrically shown        |
| 35–48%  | Editorial Grid      | Breadth — "flowers for every story," visitor self-identifies   |
| 48–60%  | Collection Showcase | Depth — curated seasonal browsing within that mood             |
| 60–72%  | Story Section       | Trust — who makes this, and why it's local, not a delivery app |
| 72–82%  | Service Section     | Clarity — how ordering actually works, friction removed        |
| 82–90%  | Social Proof        | Validation — real quotes, right before the ask                 |
| 90–96%  | Location Section    | Grounding — a real, visitable, contactable place               |
| 96–100% | Final CTA           | Action — the ask, bookending the hero                          |

This is a **proposed refinement** of the placeholder order currently in
[floristTemplate](../src/templates/florist.template.ts) (whose own comment
says "Not the final design"). The current file orders
`collection-showcase` immediately after `product-reveal` and places
`editorial-grid` much later, right before `social-proof`. This blueprint
moves `editorial-grid` earlier — as the breadth beat right after the
flagship reveal — and keeps `collection-showcase` as the deeper browsing
beat that follows it, which reads as a cleaner widen-then-narrow arc.
Updating `floristTemplate.experienceMap` to match is an implementation
step, out of scope here.

Landing on **10 scenes** is deliberate, not a default: it's within the
requested 8–12 range, and it matches the engine's existing `SectionId`
taxonomy exactly — this blueprint validates that the original 10-section
design was already well-calibrated, rather than inventing new section
types.

## 3. Scene-by-scene specification

### Scene 1 — Cinematic Hero _(Signature WOW Moment #1)_

**Scroll position:** 0–8%
**Purpose:** Establish the premium/cinematic register before a single
word is read. Signals "not a template site" in the first second.
**Visual:** Full-bleed atmospheric shot or loop — macro bloom in sharp
focus, soft blurred stems behind, cinematic grade matching Visual DNA.
Layered parallax between foreground and background.
**Content:** Business name/logotype, one poetic positioning line (an
editorial dek, not a slogan), a scroll-cue. No CTA.
**Motion:** Slow ambient drift (3–6s loop), logotype reveal on load,
scroll-linked camera drift and color/light shift into Scene 2 as the
visitor scrolls.
**Asset requirement:** One hero-grade photograph (working id
`hero-atmosphere`) — the single highest-leverage asset on the page, and
the one most worth spending Higgsfield budget on. Video is deferred to
v2, not budgeted for v1 (see [§6](#6-lean-production-strategy-v1)). This
same asset is reused, re-graded, at Final CTA — no second hero-grade
asset needed.
**Technology:** WebGL/Three.js — layered depth parallax, optional
shader-driven petal drift / light bloom, scroll-linked camera. Fallback:
static Ken Burns CSS animation for reduced-motion/low-power devices.
**Conversion role:** None. A CTA here breaks the editorial register.

### Scene 2 — Editorial Statement

**Scroll position:** 8–20%
**Purpose:** Give the brand a voice — a manifesto beat that positions the
florist philosophically before any product is shown. This is what earns
attention rather than demanding it.
**Visual:** Generous negative space, large display typography, minimal or
no imagery.
**Content:** 2–4 sentences of brand philosophy (e.g.
`[why flowers, why this florist, why now]`), optionally signed by a
founder name for local authenticity.
**Motion:** Line-by-line reveal on scroll (mask/clip-path or fade-up
stagger). No imagery motion — a deliberate breath after the hero.
**Asset requirement:** None required. If a texture accent is used, reuse
a crop of the `detail-texture` asset (see
[§6](#6-lean-production-strategy-v1)) rather than generating a new one.
**Technology:** Plain HTML/CSS + scroll-triggered reveal (Framer
Motion/GSAP ScrollTrigger). No WebGL.
**Conversion role:** None. Positioning and trust only.

### Scene 3 — Product Reveal _(Signature WOW Moment #2)_

**Scroll position:** 20–35%
**Purpose:** Introduce the flagship arrangement as the emotional payoff of
the two preceding beats — first proof of what the visitor can actually
get.
**Visual:** A single hero product — one photograph — presented through
camera movement, not transformation: a scroll-linked zoom/dolly on that
one image, with a soft two-layer parallax (a sharp foreground bloom
drifting at a different rate than a softly blurred background layer cut
from the same photo) to suggest depth. No rotating bouquet, no unfolding
wrap, no unfurling petals — that's a full product-transformation
sequence, cut from v1 as a cost/complexity risk for a multi-vertical
factory. See [WOW Moment #2](#signature-wow-moments).
**Content:** Product name (e.g. `[Signature Arrangement Name]`), a short
sensory description (material, mood, occasion), optional soft price
framing (`from [price]`).
**Motion:** Scroll-linked zoom and parallax on a pinned/sticky section —
camera movement, not frame-by-frame animation; supporting text reveals
only after the beat completes.
**Asset requirement:** One photograph (working id `flagship-bouquet`).
The motion comes from WebGL acting on a single texture, not from
photographing multiple frames or building a 3D asset — that's what keeps
this scene's cost down to one shoot. This same asset is reused, recropped,
in Collection Showcase and one Editorial Grid tile — see
[§6](#6-lean-production-strategy-v1).
**Technology:** WebGL/Three.js — scroll-linked scale/translate ("camera")
plus two-layer parallax on the single texture. No custom mask authoring,
no displacement shader, no image-sequence player — a v1-cheap build, not
a production-grade 3D sequence. Degrades to the same static photo + CSS
parallax on low-power devices, no separate fallback asset needed.
**Conversion role:** **First conversion CTA** — soft and low-friction
(`"Explore the Collection"`, `"See how it's made"`), never `"Buy Now"`.
Invites deeper engagement, doesn't demand commitment.

### Scene 4 — Editorial Grid

**Scroll position:** 35–48%
**Purpose:** Show the breadth of occasions served, letting different
visitor intents self-select, while keeping the editorial (not catalog)
framing.
**Visual:** Asymmetric magazine-style grid, five occasion tiles (weddings,
everyday, sympathy, corporate/events, seasonal gifting). Three tiles carry
imagery — reused, recropped, duotone-graded crops of `flagship-bouquet`,
`detail-texture`, and `atmospheric-editorial`, each a different source
photo so the tiles read as distinct rather than repeated crops. The other
two are pure typographic color-block cards on Visual DNA background
tones — a real editorial technique (a magazine index page), not a
placeholder-quality downgrade.
**Content:** Occasion label + one evocative line each, e.g. `"Weddings —
flowers that hold a room's attention without asking for it."`
**Motion:** Staggered fade/scale-in per tile on scroll entry; subtle
hover-tilt/parallax on desktop.
**Asset requirement:** None dedicated. Zero new photography — the three
image tiles reuse existing assets; see
[§6](#6-lean-production-strategy-v1).
**Technology:** Plain HTML/CSS Grid + scroll-triggered stagger. No WebGL —
readability matters more than spectacle here.
**Conversion role:** Soft, implicit — each tile can anchor-link further
down the page. No explicit CTA button.

### Scene 5 — Collection Showcase

**Scroll position:** 48–60%
**Purpose:** Demonstrate range and seasonality — proof the business is
active and current, and a curated (not transactional) browsing moment.
**Visual:** Horizontal-scroll look-book of 3–4 cards. Card one is the real
featured piece — `flagship-bouquet`, recropped/re-graded from a different
angle than Product Reveal. The remaining 2–3 cards are typographic
"collection notes" (name + description, no photo — e.g. `"ask us about
this arrangement in-store"`) rather than additional photographed pieces.
**Content:** Collection title (e.g. `"[Season] Collection"`), 3–4
arrangement names with one-line descriptors (one photographed, the rest
text-only for now), optional price range.
**Motion:** Horizontal drag/scroll-snap with momentum; parallax between
image and caption layers.
**Asset requirement:** None new. Reuses `flagship-bouquet` for the one
photographed card. A dedicated collection photoshoot (multiple
arrangements) is an explicit v2 candidate, only after v1 is live and we
can tell whether visitors actually need to see more than one piece to
convert — see [§6](#6-lean-production-strategy-v1).
**Technology:** Plain HTML/CSS/JS (scroll-snap + drag). No WebGL — reserved
for Hero and Product Reveal only.
**Conversion role:** Secondary, functional (`"View arrangement"` per
item) — still browsing-oriented, not the primary ask.

### Scene 6 — Story Section

**Scroll position:** 60–72%
**Purpose:** Build local trust and emotional connection — who makes this,
and why it isn't a national delivery app. The "local business" pillar.
**Visual:** Warm, documentary-style photography — hands arranging, the
workshop, local sourcing. Intentionally less theatrical than the hero;
more intimate.
**Content:** Founder/maker story (3–5 sentences), years in business, local
roots, craft philosophy, optional pull-quote.
**Motion:** Gentle parallax between image and text column, text fade-up on
scroll — minimal, so the photography carries the emotion.
**Asset requirement:** High-value, but not a Higgsfield cost — this must
be real, client-provided photography of the actual people and place
(`source: "client-provided"` in the asset manifest, not `"higgsfield"`).
A generated "local" photo would undermine the claim it's making. Video,
if the client can supply it later, is a v2 upgrade, not required for v1.
**Technology:** Plain HTML/CSS with scroll-triggered fade/parallax.
**Conversion role:** None direct. Pure trust-building ahead of the
process/proof scenes.

### Scene 7 — Service Section

**Scroll position:** 72–82%
**Purpose:** Answer "how do I actually get this" — remove practical
friction before asking for commitment. Bridges emotion to transaction.
**Visual:** Clean, structured 3–4 step process (Consult → Design →
Deliver), icon per step (no photography).
**Content:** Step titles + one-line explanation each; practical
reassurances (delivery radius, lead time, custom/corporate orders
welcome).
**Motion:** Sequential stagger reveal of steps on scroll, simple
connecting line/progress indicator animating alongside.
**Asset requirement:** None — an off-the-shelf/CSS icon set. Optionally
reuse a `detail-texture` crop as a background accent; no new generation.
**Technology:** Plain HTML/CSS + lightweight scroll-triggered stagger. No
WebGL.
**Conversion role:** Optional light functional link (`"Start your
order"`) per step — process education, not the primary close.

### Scene 8 — Social Proof

**Scroll position:** 82–90%
**Purpose:** De-risk the decision immediately before the ask — real
testimonials reduce last-mile hesitation.
**Visual:** Editorial-style large pull-quotes, not star-rating widgets;
optional press/logo strip; optional small customer photos.
**Content:** 3–5 real client quotes (weddings, corporate, repeat
customers), aggregate rating if strong, press mentions if any.
**Motion:** Quote carousel or slow fade-cycle; logo strip ticker (subtle,
slow); fade-up on scroll entry.
**Asset requirement:** Low — quotes are sourced text, press logos are
existing client-provided brand assets, not generated. Customer photos, if
used, are also client-provided.
**Technology:** Plain HTML/CSS + simple JS auto-rotate. No WebGL.
**Conversion role:** Indirect — confidence-building immediately before
Final CTA.

### Scene 9 — Location Section

**Scroll position:** 90–96%
**Purpose:** Ground the brand physically — confirm it's a real, local,
visitable/deliverable business, and give the practical info needed to
act.
**Visual:** Map styled to match Visual DNA (not a default pin drop),
storefront photo, hours/address card.
**Content:** Address, hours, phone, delivery area/radius, a local cue
(`"walk-ins welcome"`).
**Motion:** Minimal — map pin drop-in, card fade-up. Deliberately calm and
utilitarian, not spectacular.
**Asset requirement:** Required, but real and client-provided, not
Higgsfield — one storefront/exterior photograph
(`source: "client-provided"`).
**Technology:** Plain HTML/CSS + a styled map (e.g. Mapbox GL for style
control, or a static styled map image). No custom WebGL scene needed here.
**Conversion role:** Functional CTA (`"Get Directions"` / `"Call Now"`) —
supports but doesn't replace the Final CTA.

### Scene 10 — Final CTA _(Signature WOW Moment #3)_

**Scroll position:** 96–100%
**Purpose:** The narrative's resolution and the primary conversion
moment. Everything before this built desire, meaning, breadth, trust, and
clarity; this scene asks for the action.
**Visual:** Bookends the hero — same visual family and color grade,
full-bleed atmospheric image, deliberate sense of closure.
**Content:** One warm closing line (no discount/urgency gimmicks), primary
CTA button (`"Order Now"` / `"Book a Consultation"` / WhatsApp message),
secondary contact channels below it.
**Motion:** Slow fade/scale-in of the closing visual, CTA subtle
pulse/glow on entry, echoes the hero's ambient drift for symmetry within
plain CSS (no WebGL here).
**Asset requirement:** None new. Reuses `hero-atmosphere` (re-graded,
recropped) for narrative bookending — no separate closing asset.
**Technology:** Plain HTML/CSS only — no WebGL, even though Hero has it.
This is the primary CTA, so reliability and accessibility outrank
spectacle. See [§6](#6-lean-production-strategy-v1) for why WebGL stays
scoped to just two scenes.
**Conversion role:** **Primary CTA.** The single most important
conversion moment on the page.

## 4. Conversion architecture

- **First conversion CTA:** Scene 3, Product Reveal (~20–35%) — soft,
  exploratory (`"Explore the Collection"`), not a purchase ask.
- **Primary CTA:** Scene 10, Final CTA (96–100%) — the one hard ask on the
  page (`"Order Now"` / `"Book a Consultation"`).
- **Functional (non-narrative) CTAs:** small, secondary links inside
  Collection Showcase (`"View arrangement"`), Service Section (`"Start
your order"`), and Location Section (`"Get Directions"` / `"Call
Now"`) — these support wayfinding, they are not additional "asks."
- **Trust/proof:** primary placement is Scene 8, Social Proof (82–90%),
  positioned deliberately right before the ask. Story Section (60–72%)
  reinforces trust earlier through craft/local narrative rather than
  quotes.
- **Location/contact:** primary placement is Scene 9, Location Section
  (90–96%); repeated as secondary contact channels in Scene 10, Final CTA.

The page deliberately has exactly **one** primary CTA and **one** soft
CTA — not a button in every section. That restraint is part of what keeps
this from reading as ecommerce.

## 5. Asset & technology matrix

Consolidates the per-scene Asset Requirement / Technology fields above for
quick reference, reflecting the lean v1 production strategy in
[§6](#6-lean-production-strategy-v1).

| Scene               | Photography                                             | Video          | WebGL/Three.js                                                          | Baseline tech                        |
| ------------------- | ------------------------------------------------------- | -------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| Cinematic Hero      | 1 new (Higgsfield, reused at Final CTA)                 | Deferred to v2 | **Yes** — core to the scene                                             | CSS fallback (Ken Burns)             |
| Editorial Statement | None (optional reused accent)                           | No             | No                                                                      | Plain HTML/CSS                       |
| Product Reveal      | 1 new (Higgsfield, reused elsewhere)                    | Deferred to v2 | **Yes** — camera zoom + 2-layer parallax, not a transformation sequence | Static photo + CSS parallax fallback |
| Editorial Grid      | None new (3 tiles reuse existing assets, 2 typographic) | No             | No                                                                      | Plain HTML/CSS Grid                  |
| Collection Showcase | None new (reuses Product Reveal asset for 1 card)       | No             | No                                                                      | Scroll-snap + drag JS                |
| Story Section       | Required — real, client-provided                        | Deferred to v2 | No                                                                      | Plain HTML/CSS                       |
| Service Section     | None (icons only)                                       | No             | No                                                                      | Plain HTML/CSS                       |
| Social Proof        | Optional (client-provided customer photos)              | No             | No                                                                      | Plain HTML/CSS + JS carousel         |
| Location Section    | Required — real, client-provided                        | No             | No                                                                      | Plain HTML/CSS + styled map          |
| Final CTA           | None new (reuses Hero asset)                            | Deferred to v2 | No                                                                      | Plain HTML/CSS                       |

**New assets required for v1:** just four — Cinematic Hero
(`hero-atmosphere`), Product Reveal (`flagship-bouquet`), a shared
detail/texture shot (`detail-texture`), and a wider editorial/environment
shot (`atmospheric-editorial`), all reused across the other eight scenes.
Full budget in [§6](#6-lean-production-strategy-v1).
**Scenes requiring real, client-provided (non-Higgsfield) photography:**
Story Section and Location Section — the two places a generated image
would undermine the "real local business" claim.
**Video in v1:** none. Every video mention above is a named v2 candidate,
not a v1 requirement.
**Scenes that justify WebGL/Three.js:** only Cinematic Hero and Product
Reveal — the two highest-emotion beats, and the two of three
[Signature WOW moments](#signature-wow-moments) that need it (the third,
Final CTA, doesn't).
**Scenes that remain plain HTML/CSS:** all eight others — Editorial
Statement, Editorial Grid, Collection Showcase, Story Section, Service
Section, Social Proof, Location Section, Final CTA.

## 6. Lean production strategy (v1)

The scene structure in [§3](#3-scene-by-scene-specification) stays
exactly as designed — all 10 scenes hold up as a factory-reusable engine.
What changes is how few assets it actually takes to make them feel
premium. A blueprint that implied 15+ new photographs per business (5–6
for Editorial Grid, 4–8 for Collection Showcase, on top of Hero, Product
Reveal, Story, and Location) doesn't scale as a factory — it turns every
new site into its own production shoot, which is slow, expensive, and
raises the bar every future vertical has to clear.

**Constraints for v1:**

- **4 Higgsfield assets, total, for the whole florist site — exactly the
  demo cap.** [generation-policy.md](./generation-policy.md)'s demo cap is
  4 image generations / 0 videos _for the whole demo_, not per vertical —
  florist v1 uses all 4, so this is a hard ceiling, not a starting
  budget. A 5th candidate (`closing-visual`, a Final CTA reserve) is
  proposed but explicitly not authorized — see
  [asset-manifest.md](./asset-manifest.md#4-higgsfield-budget).
- **Video: zero by default in v1.** Every "video is a strong upgrade"
  note in [§3](#3-scene-by-scene-specification) is a named v2 candidate,
  not a v1 plan.
- **WebGL/Three.js: only Cinematic Hero and Product Reveal**, and even
  there kept to camera zoom + layered parallax on a single image — no
  custom mask/displacement authoring, no image-sequence or 3D asset.
  Collection Showcase and Final CTA ship plain HTML/CSS — no optional
  WebGL upgrade. See [Signature WOW moments](#signature-wow-moments) for
  why effort concentrates on just these two builds plus one CSS
  transition, rather than spreading across all 10 scenes.
- **No dedicated photoshoot for Editorial Grid or Collection Showcase.**
  Both are designed above to work off reused/recropped assets and
  typography instead of new photography.
- Everything else is either real business photography the client
  provides (Story Section, Location Section — these were never meant to
  be AI-generated; a generated "local" photo would undermine the claim
  it's making) or needs no photography at all (Service Section icons,
  Social Proof quotes/logos).

**Proposed v1 asset budget** — illustrative only, still subject to the
`PLAN → show plan → show budget → wait for approval → GENERATE` gate in
[generation-policy.md](./generation-policy.md) before anything is
actually generated:

| Asset (working id)                       | Source                           | What it shows                                                            | Scenes that reuse it                                                                                         |
| ---------------------------------------- | -------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| `hero-atmosphere`                        | Higgsfield                       | Atmospheric flagship shot, sets the palette                              | Cinematic Hero (primary); Final CTA (re-graded, bookend)                                                     |
| `flagship-bouquet`                       | Higgsfield                       | The signature arrangement, clean product shot                            | Product Reveal (primary); Collection Showcase (recropped, featured card); Editorial Grid (recropped, 1 tile) |
| `detail-texture`                         | Higgsfield                       | Abstract macro detail (petal/texture)                                    | Editorial Statement (optional accent); Service Section (optional accent); Editorial Grid (recropped, 1 tile) |
| `atmospheric-editorial`                  | Higgsfield                       | Wider editorial frame, arrangement + suggested environment               | Editorial Grid (recropped, 1 tile); Collection Showcase (optional 2nd card)                                  |
| _(reserve — 5th slot: `closing-visual`)_ | Higgsfield, **not pre-approved** | Only generated if the v1 review below shows real repetition at Final CTA | TBD, decided after launch                                                                                    |
| Storefront/workshop photo                | Client-provided                  | Real place, real people                                                  | Story Section; Location Section                                                                              |

Four Higgsfield assets, reused across nine placements in eight scenes,
cover the whole page. Editorial Grid and Collection Showcase — the two
scenes that previously implied the most new photography — now ship on
zero dedicated assets of their own.

**Sequencing:** build v1 on this minimal set, ship it, and only then
evaluate — with a real page in front of us — whether Final CTA's reused
hero asset feels repetitive. Spending the reserve 5th asset, or
requesting a larger budget, is a decision for after that review, not
before it. The goal is the _feeling_ of a sophisticated, content-rich
site without a production pipeline that can't scale to the next seven
verticals.

## 7. Cross-vertical reusability

**Universal scenes** — identical purpose and structure across every
vertical; only copy and imagery change (7 of 10):
Cinematic Hero, Editorial Statement, Story Section, Service Section,
Social Proof, Location Section, Final CTA.

**Adapted scenes** — same component slot and position in the journey, but
the underlying concept is rewritten per vertical (3 of 10): Product
Reveal, Editorial Grid, Collection Showcase.

This matches the engine's own architecture principle (see
[engine-architecture.md](./engine-architecture.md#the-reusable-core)):
components never change per vertical, only the data and content behind
them do. No scene here is "florist-specific" at the component level —
these three simply carry the most florist-specific _meaning_ today, and
need the most rewriting when adapting to another vertical:

| Scene               | Florist                                             | Restaurant                                             | Barber                 | Beauty               | Dental               | Fitness                 | Automotive               | Local Services              |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------ | ---------------------- | -------------------- | -------------------- | ----------------------- | ------------------------ | --------------------------- |
| Product Reveal      | Signature seasonal bouquet                          | Signature dish                                         | Signature cut/ritual   | Signature treatment  | Smile transformation | Flagship transformation | Flagship vehicle/detail  | Flagship service outcome    |
| Editorial Grid      | Occasions (weddings, everyday, sympathy, corporate) | Dining moments (breakfast, date night, private events) | Service menu by need   | Treatment categories | Care categories      | Program types           | Service categories       | Trade-specific categories   |
| Collection Showcase | Seasonal collection lookbook                        | Tasting menu / seasonal dishes                         | Style gallery/lookbook | Before/after gallery | Smile gallery        | Transformation gallery  | Inventory/fleet showcase | Portfolio of completed work |

The lean production strategy in [§6](#6-lean-production-strategy-v1)
generalizes too: the same "one hero asset + one flagship asset + one
texture asset, reused across most scenes, plus real client photography
for the trust/location beats" pattern applies to every future vertical,
not just florist.

## Engine mapping

This blueprint's ten scenes correspond 1:1 to the closed `SectionId` set
defined at [src/lib/types/section.ts](../src/lib/types/section.ts):
`cinematic-hero`, `editorial-statement`, `product-reveal`,
`editorial-grid`, `collection-showcase`, `story-section`,
`service-section`, `social-proof`, `location-section`, `final-cta`. The
`ExperienceMap` type (`section` + `enabled` + optional `notes`, see
[src/lib/types/experience-map.ts](../src/lib/types/experience-map.ts))
carries only ordering — the creative intent for each entry now lives here
instead.

Business-specific copy for each scene will eventually live in
`ExperienceContent` (see
[src/lib/types/content.ts](../src/lib/types/content.ts)) at
[src/config/verticals/florist/content.ts](../src/config/verticals/florist/content.ts),
currently empty. Assets referenced above will need entries in
[src/config/verticals/florist/asset-manifest.ts](../src/config/verticals/florist/asset-manifest.ts),
gated by [generation-policy.md](./generation-policy.md) before anything is
generated.

One implementation nuance worth flagging now, to solve later:
`AssetManifestEntry` (see
[asset-manifest.md](./asset-manifest.md)) pairs one `asset_id` with one
`section`. The reuse pattern in [§6](#6-lean-production-strategy-v1) —
one generated image backing entries in _multiple_ sections (`hero-
atmosphere` in both Cinematic Hero and Final CTA, `flagship-bouquet` in
three different scenes) — will need either multiple manifest entries that
point at the same underlying generated file, or a small type extension.
Not decided here; an implementation-phase question.

## Out of scope here

This blueprint intentionally stops short of: final copywriting, sourcing
or generating any image/video, approving the illustrative asset budget in
[§6](#6-lean-production-strategy-v1), writing `content.ts`, changing
`floristTemplate.experienceMap`'s order, and building any component.
Those are separate, later phases.
