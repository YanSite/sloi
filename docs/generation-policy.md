# Generation Policy

## HIGGSFIELD IS A LIMITED PAID RESOURCE.

Every generation call costs real money. This policy is not a suggestion —
treat it as a hard gate on any work involving Higgsfield.

## Demo mode limit

While this project is in demo mode:

- **Maximum 4 image generations**
- **Maximum 0 video generations**
- **Maximum 1 retry per asset**

These are totals for the whole demo, not per-session or per-vertical
allowances.

## Production mode limit

A separate, higher tier for a real (non-demo) client engagement, once one
exists. **Nothing in this project has moved to production mode — the
florist vertical is demo mode, and stays demo mode until a human says
otherwise.**

- **Maximum 6 image generations**
- **Maximum 2 video generations**
- **Maximum 1 retry per asset**

Like the demo limit, these are hard ceilings, not starting budgets, and
apply per engagement once production mode is explicitly entered — not
automatically unlocked by finishing a demo.

## Both tiers are hard limits

Demo mode's 4/0 and production mode's 6/2 are hard limits **unless the
user explicitly approves an increase** for that specific asset or batch.
An asset plan proposing more candidates than a tier allows (see
[asset-manifest.md](./asset-manifest.md) for the florist demo, which
proposes 5 image candidates against a 4-image demo cap) is not itself a
request to exceed the limit — anything above the cap stays unapproved and
ungenerated until asked for by name.

## Non-negotiable rules

- Never generate assets automatically during planning.
- Never generate multiple variants of an asset without explicit approval.
- Never retry a failed generation indefinitely — one retry per asset, then
  stop and report the failure.
- If a planned generation batch would exceed the demo budget: **stop and
  ask for approval** before generating anything.

## Required workflow

The only allowed sequence is:

```
PLAN
  → SHOW ASSET PLAN
  → SHOW MAXIMUM GENERATION BUDGET
  → WAIT FOR APPROVAL
  → GENERATE
```

Never:

```
PLAN
  → GENERATE
```

Planning an asset (adding it to an `AssetManifest` with `status: "planned"`)
never itself triggers generation. An entry only moves toward `generating`
after a human has seen the full plan, seen the budget it consumes, and
explicitly approved it.

## What "showing the asset plan" means in practice

Before any Higgsfield call, present:

1. Every asset to be generated: `asset_id`, `purpose`, `type`, `prompt`,
   `aspect_ratio`, `section`.
2. The running total against the demo budget (e.g. "3 of 4 image
   generations used after this batch").
3. Explicit confirmation that no automatic retries beyond the 1-retry limit
   will occur.

Only after the human approves does any entry in the manifest move from
`planned`/`approved` to `generating`.

## Current status

No Higgsfield connection has been established in this phase. No prompts
have been written. No credits have been spent. The asset manifest for the
florist vertical is empty — see
[src/config/verticals/florist/asset-manifest.ts](../src/config/verticals/florist/asset-manifest.ts).
