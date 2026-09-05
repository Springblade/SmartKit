# Thesis Direction C2 — Discussion Notes

> Working notes from the reframe discussion. Captures the agreed direction, the
> reasoning behind it, and the open questions that were settled along the way.
> Read this before touching `latex/main.tex` again.

---

## 1. Direction chosen — C2

C2 means **the evaluation framework and SmartKit are shipped as one unified
contribution**: the framework is the measurement instrument, SmartKit is the
target codebase that makes the instrument measurable, and the pilot wires the
two together on a real AI-generated feature.

The three layers that C2 keeps distinct (and which the thesis must keep
distinct in prose):

1. **Next.js official conventions** — Server/Client boundary, file-system
   routing, RSC rules, TypeScript strict mode. Source of truth, extracted from
   Next.js docs and community patterns.
2. **Framework** — three dimensions (Structural Integrity, Type & Contract
   Safety, Coverage & Completeness), 0–5 rubric, automated measurements
   (Biome, `tsc --noEmit`, file enumeration). Generalisable, not locked to
   SmartKit.
3. **SmartKit** — instantiation of conventions in a real, buildable Next.js
   SaaS boilerplate. FSD feature folders, Server Actions colocated in
   `features/{name}/actions/`, Zod schemas in `features/{name}/types/`,
   `revalidatePath` after mutations, `server-only` boundary imports.

The pilot measures **AI-generated code inside SmartKit** using the framework —
it does not measure SmartKit code itself. This is the distinction that keeps
C2 from collapsing into circularity.

### Why C2 over A and B

- **A (thesis describes the real artifact):** drops "novelty" (RHF + TanStack)
  in exchange for 1:1 reproducibility. Low ambition.
- **B (artifact matches thesis):** keeps the original narrative but requires
  re-engineering SmartKit to add RHF + TanStack Query, working against the
  RSC-first spirit of the codebase. High effort, questionable value.
- **C2:** keeps the framework + artifact pair, drops the unbuilt libraries,
  treats SmartKit as instantiation not as a "best boilerplate" claim.
  Defensible, realistic for a Bachelor's timeline.

---

## 2. What was settled

| Decision | Value | Why |
|---|---|---|
| Artifact name in thesis | **SmartKit** (was SmartKit-React) | Matches the repo, no abstract-vs-code gap |
| Stack listed in thesis | Next.js 16 + Drizzle + Biome + Better Auth + Resend + Zod | Mirrors `package.json` exactly |
| Dropped from thesis | React Hook Form, TanStack Query | Boilerplate does not use them — no justification needed beyond "not in stack" |
| **Starter comparison table scope** | **SmartKit vs `create-next-app` baseline only** (revised 2026-09-01) | Original 5-starter comparison (create-t3-app, Vercel, shadcn/ui, bulletproof-react) made unverifiable cell-level claims. Scoping to one baseline (Condition B) makes every cell auditable via the bootstrap script and aligns with §3.1 / §12. The thesis Table 3.1 is retitled "SmartKit vs create-next-app: convention-encoding comparison." |
| **Footnotes per cell** | Each cell carries a one-line audit anchor | (1) SmartKit cells: `git rev-parse HEAD` of the snapshot. (2) create-next-app cells: pinned `create-next-app@<version>` + `npx create-next-app@<version> ...` invocation recorded in `scripts/setup-condition-b.ts` so any reader can reproduce the baseline exactly. |
| Baseline design | Condition A (SmartKit + full context) vs Condition B (convention-naive scaffold) | Only way to attribute score difference to SmartKit conventions |
| Pilot type | **B2** — run both conditions for real, with comparison | Pilot strength comes from real data, not just a documented protocol |
| Rewrite depth | **Light** — only strip RHF/TanStack mentions, do not reframe narrative | C2 keeps the existing structure; surgical edits only |
| Hypothesis framing | **(c1) framework properties** (descriptive, §5.3) + **(c2) directional predictions DP1–DP3** (falsifiable, §5.4) | "Hypothesis" misleading when the pilot is worked-example. Distinguish: framework property = "framework can measure X on this artifact" (descriptive claim about the framework itself, not refutable by pilot data); directional prediction = "Condition A scores ≥X% in Y runs" (refutable by pilot data, but reported as confirmed/refuted/null, not as p-value) |
| Contribution #3 | Expand to "pilot protocol + baseline comparison design" | Baseline is now a first-class deliverable, not future work |
| Future work | Cross-tool, cross-framework, developer-participant study | Listed exactly as given |
| N runs | **N=5, adaptive** | Run 3 first; if variance range > 2, run 2 more. Robust without committing upfront |
| Pilot feature | **Feature flag check** (`isEnabled(flagKey, userId?)` + Zod enum + 5-min cache) | Updated from SePay webhook after confounding analysis (§5.5); no service SmartKit integrates, no mirror-able code path in Condition A, ~60 LOC scope |
| Sample feature | Forgot password excluded | Already exists in SmartKit — AI would just recall, not generate from scratch |

---

## 3. Baseline design

### 3.1 Conditions

**Condition A (treatment)** — SmartKit at full setup:

- AGENTS.md + `.cursor/rules/` present
- FSD feature folders, Better Auth, Resend templates, SePay billing module
  fully implemented
- AI sees: existing `features/billing/actions/`, `features/billing/lib/signature.ts`,
  and similar patterns to mirror

**Condition B (control)** — convention-naive scaffold:

- `create-next-app` default as base
- **Config only** for Better Auth / Resend / SePay (env vars, minimal Drizzle
  schema for the pilot feature) — no UI, no templates, no webhook handler
- Tailwind default, **no shadcn/ui**
- No AGENTS.md, no `.cursor/rules/` folder

### 3.2 What gets generated

One feature only: the **feature flag check utility**. The same prompt
verbatim, the same AI tool (Cursor AI), the same N runs per condition.

The feature is deliberately chosen to use **no service that SmartKit already
integrates** (no Resend, no Better Auth, no SePay, no Drizzle). See §5.5
for the confounding analysis that drives this choice.

Expected output shape:

- **Condition A:** utility colocated in `features/flags/lib/`, Zod-typed
  `FlagKey` enum, env + DB override with 5-minute cache, server-only
  boundary, test file co-located. No direct Resend/Better Auth/SePay/Drizzle
  dependency.
- **Condition B:** utility at `lib/feature-flags.ts` or root, inline `any`
  types or string-keyed map, no Zod schema, no cache, no test file.

### 3.3 Scoring

Same framework rubric applied to both. Absolute threshold (≥3/5 = pass) for
each dimension. Comparative analysis reports median Condition A vs median
Condition B across N=5 runs each.

### 3.4 Confounds handled

| Confound | Mitigation |
|---|---|
| AI non-determinism | N=5 runs per condition, use median + range |
| Prompt phrasing | Identical prompt verbatim across all runs |
| Codebase familiarity bias | AI sees Condition A's `AGENTS.md` + `.cursor/rules/` at root, and `features/billing/`, `features/auth/` etc., which encode FSD convention. AI therefore *is not* blind to the convention envelope; it can pattern-match existing folders. We accept this as part of what Condition A encodes, and we mitigate the resulting confound via the feature choice (§5.2: flag check uses no service SmartKit integrates) — but the convention-envelope leakage is a real limitation, not a solved confound. |
| Author bias in scoring | Automated measurement (Biome + `tsc` + file enumeration); manual score only for subjective items |
| **Integration pattern advantage** (see §5.5) | Pilot feature uses **no** service that SmartKit integrates (no Resend, Better Auth, SePay, Drizzle) — only TypeScript + Node stdlib |

---

## 4. N-runs discussion

### Why N=3 was initially proposed

Conservative estimate: 1 run ≈ 1.5 hours (AI session + review + score).
N=3 keeps the pilot under 5 days while producing median + range.

### Why N=3 is too thin

- Ouyang et al. (2025) document 47–76% task-level variance in LLM code
  generation; with N=3 a single outlier swings the median.
- No confidence interval possible.
- Reviewer will challenge any statistical claim made on N=3.

### Why N=5 instead

- 4 extra runs ≈ 6 hours — marginal cost.
- Trimmed mean becomes available (drop 1 high + 1 low).
- Variance estimate is robust enough to claim "directional effect, not yet
  statistically conclusive".
- **Reporting plan.** With N≤5/condition, no inferential test is powered.
  Wilcoxon / Fisher-exact / permutation would be exploratory only and any
  p-value reported must carry an explicit "underpowered, descriptive" caveat.
  Pilot results are reported as **median + range per condition** and as
  **per-run rubric score with the JSON artefact** (§6.5). Statistical claims
  are explicitly future work. This is consistent with §7 ("The pilot is
  worked-example, not empirical validation").

### Adaptive pattern

Run 3 first. If range across runs ≤ 1 point → variance is acceptable, stop at
N=3. If range > 2 points → run 2 more for N=5. This is **adaptive N** —
evidence-gated, not over-committed.

**Run-order schedule.** Randomize the order of the 5 (or 3) runs across
conditions to avoid time-trend confounds (e.g. Condition A first then
Condition B could be confounded with model drift or session memory). Use a
seeded schedule (e.g. CRD — completely randomized design) with the seed
documented in the pre-registration (§11). Without this, a reviewer cannot
distinguish a real Condition effect from a session-order effect.

The locked run sequence (seed `1234567890`):

| Run | Condition | Timestamp | Seed       |
|-----|-----------|-----------|------------|
| 1   | B         | TBD       | 1234567890 |
| 2   | B         | TBD       | 1234567890 |
| 3   | B         | TBD       | 1234567890 |
| 4   | A         | TBD       | 1234567890 |
| 5   | A         | TBD       | 1234567890 |

This is the **initial 3+2 adaptive sequence** (first 3 runs in Condition B,
then 2 in Condition A). If variance after Run 3 triggers the adaptive rule
(range > 2), Runs 4–5 proceed as shown. The seed and sequence are frozen in
this document; any deviation requires a new pre-registration.

**Adaptive N caveat.** "Look after 3, decide" is a planned interim look. No
formal α-spending is applied because no hypothesis test is pre-registered.
The decision is to gather more descriptive data, not to test a hypothesis
at the interim look. This must be stated explicitly to prevent the interim
look from being read post-hoc as a significance test.

**Adaptive N=3 verdict rule.** After completing the first 3 runs (all in
Condition B per the locked sequence), compute the range (max − min) across
the 3 scores for each dimension (Structural Integrity, Type Safety, Coverage).

```
N=3 verdict rule:
  IF range ≤ 1 on all three dimensions:
    STOP at N=3.
    Apply k/n split on the 3 runs:
      - k=3 (all 3 pass ≥3/5) → DP confirmed
      - k=0 (all 3 fail <3/5) → DP refuted
      - k=1 or k=2 → DP inconclusive
  ELSE (range > 2 on any dimension):
    RUN Runs 4–5 (both Condition A per locked sequence).
    Apply §5.4.1 binary rule on all N=5 runs:
      - k=5 (all pass) → DP confirmed
      - k=0 (all fail) → DP refuted
      - k=1,2,3,4 → DP inconclusive
```

This rule is pre-registered and frozen. Any deviation requires a new
pre-registration document with a new commit hash.

Stratified design (3 verbatim + 2 prompt paraphrase) was considered and
dropped — adds complexity without proportional value at this sample size.

---

## 5. Pilot feature — feature flag check

### 5.1 What it is

A `isEnabled(flagKey, userId?)` utility that resolves a feature flag with
three override layers:

1. Per-user DB override (optional, only if `userId` is passed)
2. Per-flag env var (`FLAG_<KEY>=true|false`)
3. Default value (passed in)

The function returns a `boolean` and caches the result in-memory for 5
minutes keyed by flag + userId.

The pilot code that AI must generate (one file + one test + one Zod
schema, ~60 LOC total):

```
features/flags/lib/is-enabled.ts           # main utility
src/tests/features/flags/is-enabled.test.ts # unit test
features/flags/types/flags.ts              # Zod schema + FlagKey enum
features/flags/index.ts                    # public API barrel
```

### 5.2 Why this feature

| Reason | Detail |
|---|---|
| Confounding A — already in SmartKit | No. The only flag-related code in SmartKit is a single ad-hoc `process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true'` check in `google-button.tsx`. There is no flag abstraction, no cache, no schema. AI will not find a pattern to mirror. |
| Confounding B — uses services SmartKit integrates | No. The feature uses only TypeScript and Node stdlib (`process.env`, `Map` for cache). No Resend, Better Auth, SePay, or Drizzle dependency. See §5.5 for the analysis. |
| Convention density | Zod-typed `FlagKey` enum + `server-only` boundary + colocated test + `features/flags/` folder structure — all three dimensions get coverage in one small feature |
| External ground truth | OpenFeature spec is industry standard (openfeature.dev), cited in CNCF landscape. Rubric can reference the spec. |
| Real SaaS relevance | Feature flags are core to Stripe, Linear, Notion, GitHub. Every production SaaS uses them. |
| Output scope | Pure function + types + test ≈ 60 LOC. Small enough that scoring is tractable, large enough that AI has room to deviate. |
| Demo ease | One function call → one boolean. Trivial to demo in a thesis presentation: show the function, show Condition A implementation, show Condition B implementation, show the score diff. |

### 5.3 What gets scored

Same three dimensions as the framework, applied to the generated flag
check. **Generalisation note:** these scores reflect one AI tool (Cursor AI)
at one model snapshot. They are not stable measurements across model
versions or across AI tools. §7 makes this limitation explicit.

- **Structural Integrity:** file lives in `features/flags/lib/`, not
  `app/`, not root `lib/`; `server-only` import present if the file
  reads DB; no `'use client'`; no event handlers across the
  server/client boundary.
- **Type & Contract Safety:** `FlagKey` exported as a Zod-derived enum
  (or branded type), no `any` in public API, no `// @ts-ignore`,
  `tsc --noEmit` clean.
- **Coverage & Completeness:** test file exists with at least 3 cases
  (env override, default value, cache hit), 5-minute cache implemented,
  per-user override handled (even if stubbed), no console.log left in
  production path.

### 5.4 Directional predictions (replaces H1/H2/H3)

> **Framework property vs DP verdict — read this first.** A
> directional prediction (DP) is a falsifiable claim about whether
> Condition A's measurement will land above a threshold (e.g. ≥ 80%
> of runs in `features/flags/lib/`). A **framework property** (FP)
> is a descriptive claim that the framework could measure X at all
> (e.g. "the framework measured file placement in 5/5 runs"). If a
> DP is refuted, **the framework property is unaffected** — the
> framework still produced the measurement; the prediction just
> did not hold. This distinction is load-bearing: a reader who
> reads "DP1 refuted" as "the framework failed" is misreading the
> design.

- **DP1 (Structural).** We predict Condition A generates the utility
  colocated inside `features/flags/lib/` in ≥ 80% of runs; Condition B
  generates it at `lib/feature-flags.ts` (root) in ≥ 80% of runs.
- **DP2 (Type & Contract).** We predict Condition A exports a
  Zod-derived `FlagKey` type in ≥ 80% of runs; Condition B uses raw
  `string` keys in ≥ 80% of runs.
- **DP3 (Coverage).** We predict Condition A includes a co-located
  test file in ≥ 80% of runs; Condition B includes no test file in
  ≥ 80% of runs.

Each DP is reported as **confirmed / refuted / inconclusive** (inconclusive
= variance too high to call). DPs are **directional predictions** (§2 c2),
distinct from **framework properties** (§2 c1, §5.3): a framework property
is a descriptive claim about whether the framework can measure X; a
directional prediction is a falsifiable claim about whether Condition A's
measurement will land above a threshold. If a DP is refuted, the
framework property is unaffected.

#### 5.4.1 Decision rule for confirmed / refuted / inconclusive (revised 2026-09-01)

**Why the rule was tightened.** The original rule (`≥4/5 confirmed;
≤1/5 refuted; 2–3/5 null`) carries Wilson 95% CI for 4/5 ≈ [0.30, 0.99] —
the "confirmed" label is honest but its uncertainty range overlaps the
"null" range, so a reviewer cannot distinguish a confirmed DP from a
high-variance one. The tighter rule below raises the confirmed bar to
5/5 and demotes the 1–4 band to "inconclusive," which keeps the labels
honest.

| Outcome | Definition | Wilson 95% CI (approx) | Notes |
|---|---|---|---|
| **Confirmed** | 5/5 runs in predicted direction | [0.48, 1.00] | Tighter than [0.30, 0.99] but still wide. A confirmed DP is a *consistent* signal, not a *strong* one. |
| **Refuted** | 0/5 runs in predicted direction | [0.00, 0.52] | The "0/5" lower bound is also wide. A refuted DP is a *consistent* absence, not necessarily a *true absence* in the population. |
| **Inconclusive** | 1, 2, 3, or 4/5 runs in predicted direction | various | Variance is too high to call. Reported as "inconclusive" without a directional verdict. |

**Three-statement rule (alternative framing).** To avoid forcing
`confirmed/refuted/inconclusive` as if they were equally informative
endpoints, each DP can be reported with three statements at once:

1. **Point estimate:** k/5 runs in predicted direction.
2. **Wilson 95% CI:** computed from k and n=5.
3. **Comparative CI (Bonferroni-corrected 99% CI on the difference A − B):**
   reported only when both conditions are at adaptive-N=5.

The three-statement report does not collapse variance into a single label
and is the recommended default for thesis prose. The
`confirmed/refuted/inconclusive` table above remains in the pre-registration
(§11.2 item 8) as the binary decision rule, but the *thesis* reports
both the binary verdict *and* the three-statement report.

#### 5.4.2 Alternative: Bayesian decision rule (rejected for Bachelor's scope)

An alternative framing is Bayesian: declare a Beta(1,1) prior on the
success probability, observe k successes in n=5, and label
`confirmed` iff posterior probability of success ≥ 0.9,
`refuted` iff posterior probability of success ≤ 0.1,
`inconclusive` otherwise. This is more statistically defensible than the
frequentist 5/5 rule but requires the reviewer to trust a prior choice
that the author has full control over. **Decision:** rejected for this
thesis. A Bachelor's thesis should report what was observed
(`k/5` + Wilson CI) and let the reader form their own posterior. Adopting
the Bayesian framing would invite a reviewer objection about prior
manipulation that the simpler rule does not invite.

#### 5.4.3 Reporting template (for the thesis Pilot chapter)

Each DP is reported in the thesis as:

> **DP1 (Structural).** Observation: 4/5 Condition A runs placed the
> utility in `features/flags/lib/`. Wilson 95% CI: [0.30, 0.99].
> Comparative Wilson 95% CI on the A−B difference: [0.45, 0.95] (after
> Bonferroni correction to 99%, [0.32, 0.97]). Verdict:
> **inconclusive** under the §5.4.1 rule. Framework property FP1 is
> unaffected: the framework successfully measured placement in 5/5 runs.

This format keeps the binary verdict honest *and* surfaces the raw
numbers for any reader who wants to apply a different rule.

### 5.5 Confounding analysis (why not SePay webhook, etc.)

Originally the pilot feature was the **SePay webhook handler**. It was
rejected after the user surfaced two confounding problems:

**Confounding A — feature already in SmartKit.** SmartKit has
`features/billing/signature.ts`, `process-sepay-payload.ts`,
`payment-transactions.ts`, and `cancel-expired-orders.ts`. The webhook
flow is already implemented. AI in Condition A would "recall" rather
than "generate", making the comparison trivial.

**Confounding B — integration pattern advantage.** Even if the feature
were new, SmartKit already integrates Resend, Better Auth, SePay, and
Drizzle. AI in Condition A sees the integration patterns
(`features/billing/lib/email.ts`, `lib/auth.ts`, `sepay.ts`,
`payment-transactions.ts`) and can copy them. AI in Condition B has
only `.env` placeholders and must invent the integration. The score
gap would conflate **convention encoding** with **integration
availability** — two different things.

The feature flag check has neither confounding. It uses **no
service** that SmartKit integrates, and **no code path** that AI in
Condition A can mirror. Both conditions generate the same primitive
utility from scratch; the only difference is the convention envelope
around it (FSD folder, Zod, test, cache).

This is the cleanest comparison C2 can support. Any other feature
candidate must be screened against both confounding A and B before
being accepted.

### 5.6 Candidates that were rejected

| Feature | Why rejected |
|---|---|
| SePay webhook handler | Confounding A (already in `process-sepay-payload.ts`) + Confounding B (uses SePay + Drizzle) |
| Webhook idempotency store | Confounding A (already implemented via `onConflictDoNothing` in `payment-transactions.ts`) + Confounding B (uses Drizzle) |
| Stripe-style signature helper | Confounding A (already in `signature.ts`) + Confounding B (uses SePay) |
| Password reset email template | Confounding A (already in `emails/ResetPasswordEmail.tsx`) + Confounding B (uses Resend + Better Auth) |
| OAuth account linking | Confounding A (no equivalent yet, OK) but Confounding B (uses Better Auth heavily) |
| Email verification guard | Confounding A (no equivalent yet, OK) but Confounding B (uses Resend + Better Auth) |
| Audit log action | Confounding A (no equivalent yet, OK) but Confounding B (uses Drizzle) |
| Rate limit middleware | Confounding A: no. Confounding B: no. Acceptable candidate, kept as backup. |

---

## 6. Improvements over the baseline C2

Five changes make C2 more defensible against the most likely reviewer
challenges. They are listed in descending order of impact.

### 6.1 Pre-registration document (impact: very high)

**Problem.** The pilot protocol currently lives only in discussion. The
feature, conditions, prompt, rubric, and N are all decided before the run,
but nothing in the repo proves that they were fixed before seeing data.
Reviewers familiar with empirical research will ask what stops the author
from tuning the rubric to match the observed outcome.

**Fix.** Write a `docs/pilot-pre-registration.md` (or
`latex/appendix-pre-registration.tex`) and commit it to the repo **before
the first AI session runs**. It must contain, verbatim:

- Feature chosen: **`isEnabled(flagKey, userId?)` utility with 3-layer
  override** (per-user DB / per-flag env / default) + 5-minute in-memory
  cache, generated as 3 files (`features/flags/lib/is-enabled.ts`,
  `src/tests/features/flags/is-enabled.test.ts`, `features/flags/types/flags.ts`,
  `features/flags/index.ts` — ~60 LOC). Reasons per §5.2.
- Condition A and Condition B definitions, word-for-word (§3.1)
- Prompt template, word-for-word (§3.2)
- N runs per condition: adaptive 3 → 5 (§4)
- Scoring rubric: 15 cells (5 levels × 3 dimensions), word-for-word
  (§5.3), with the decision rule for DP1–DP3 (§5.4)
- Decision rule per DP: 5/5 confirmed; 0/5 refuted; 1–4/5 inconclusive (§5.4.1, revised 2026-09-01)
- Exclusion criteria: AI session crash, network failure, rate-limit
  mid-generation, generated artefact fails to satisfy minimum scope
  (missing all three of: `isEnabled` function, FlagKey type, test file).
  Pre-declare which exclusion code applies to which failure mode.

Once data is collected, scoring must follow the pre-registered rubric
without edits. If a run is excluded, the pre-registered criterion must be
satisfied. Full §11 below specifies the section structure.

| Effort | Defensibility gain |
|---|---|
| 3–4 hours | Very high |

### 6.2 Time-to-correct as secondary metric (impact: high)

**Problem.** The 0–5 score is partly manual. Variance between runs can come
from two sources that the rubric cannot separate: (a) genuine LLM variance,
(b) the rubric not being precise enough. A reviewer can argue "your score
is just noise".

**Fix.** Add **time-to-correct** as an objective secondary metric:

- After each AI session, count minutes and file edits required to bring
  the generated flag-check from its raw state to a state where
  `pnpm lint && pnpm check-types && pnpm vitest run features/flags` all
  pass and all pre-registered criteria (§5.3) are satisfied. Capped at 60
  minutes per run; if not converged, record "did not converge" and stop,
  do not patch further.
- Log the edit list per run as a separate JSON field next to the rubric
  score.

Two runs scoring the same 4/5 in Condition A vs Condition B can still be
separated by time-to-correct: e.g. 5 minutes vs 30 minutes. This makes the
comparison more resistant to "rubric noise" objections.

| Effort | Defensibility gain |
|---|---|
| ~30 minutes per run (≈ 5 hours for 10 runs) | High |

### 6.3 Directional predictions (impact: medium-high)

**Problem.** Earlier we agreed to reframe H1/H2/H3 as "framework
properties" (option c). "Framework properties" is vague — it leaves
unclear what we expect to observe. Directional predictions are sharper.

**Fix.** Replace H1/H2/H3 wording with three concrete directional
predictions:

- **DP1 (Structural).** We predict Condition A generates the utility
  inside `features/flags/lib/is-enabled.ts` in ≥ 4/5 runs; Condition B
  generates it at `lib/feature-flags.ts` or root in ≥ 4/5 runs.
- **DP2 (Type & Contract).** We predict Condition A exports a Zod-derived
  `FlagKey` enum (or branded type) in ≥ 4/5 runs; Condition B uses raw
  `string` keys in ≥ 4/5 runs.
- **DP3 (Coverage).** We predict Condition A includes a colocated
  `is-enabled.test.ts` in ≥ 4/5 runs; Condition B includes no test file in
  ≥ 4/5 runs.

Each prediction is a **direction**, not a magnitude. After the pilot, each
DP is reported as **confirmed / refuted / inconclusive** under the §5.4.1
rule (5/5 → confirmed, 0/5 → refuted, 1–4/5 → inconclusive). For the
*thesis prose*, also report the three-statement format (point estimate +
Wilson 95% CI + Bonferroni-corrected comparative CI) per §5.4.3 so the
raw numbers are visible to the reader. This is more honest than presenting
H1/H2/H3 as testable hypotheses when the pilot is not statistically powered.

| Effort | Defensibility gain |
|---|---|
| 1 hour | Medium-high |

### 6.4 Bootstrap Condition B with full env surface (impact: medium)

**Problem.** "Convention-naive" must mean **naive in encoding**, not
**incomplete in dependencies**. If Condition B is missing `.env`
placeholders for SePay, or has no Drizzle schema, or lacks `zod` in
`package.json`, the AI will fail not because of bad convention adherence
but because the codebase is incomplete. That conflates two different
failure modes.

**Fix.** `scripts/setup-condition-b.ts` (or `.sh`) must produce a
Condition B that includes:

- `.env.example` with all SePay placeholders (`SEPAY_API_KEY`,
  `SEPAY_WEBHOOK_SECRET`, `SEPAY_BANK_ACCOUNT`, `SEPAY_BANK_NAME`)
- `package.json` with `drizzle-orm`, `pg`, `zod` installed
- A minimal Drizzle schema for the `orders` table (so the flag check
  has a table to read for per-user override)
- `tsconfig.json` with `"strict": true`
- Tailwind default, **no shadcn/ui**
- No `AGENTS.md`, no `.cursor/rules/` folder

The two conditions then differ **only** in convention encoding (FSD
folders, server actions colocated, Zod in `features/{name}/types/`,
`server-only` boundaries, `revalidatePath`), not in raw tooling.
**Consistency with §3.1**: §3.1 described Condition B as "config only"
for Better Auth / Resend / SePay; §6.4 spells out the minimal config
required (env placeholders, drizzle schema, zod + strict TS) so the two
conditions differ only in convention encoding, not in raw tooling
completeness.

| Effort | Defensibility gain |
|---|---|
| 2–3 hours | Medium |

### 6.5 Public scoring script (impact: high)

**Problem.** Currently scoring is manual + described in the thesis prose.
A reviewer who wants to verify a score has to re-read the rubric, re-derive
the rule, and re-check the generated file. There is no executable artefact
they can run.

**Fix.** Write `scripts/score-flag.ts` (detailed spec in §13) that
automates the **objective** parts of the rubric and emits a JSON score
per file:

- `tsc --noEmit` exit code → contributes to Structural Integrity
- Grep `'use client'` in non-page files → contributes to Structural Integrity
- Grep `import "server-only"` or `server-only` import → contributes to Structural Integrity
- File location check (`features/flags/**` vs `lib/feature-flags.ts` or root) → contributes to Structural Integrity
- Grep for `: any` and `as any` → counts, deducts from Type & Contract Safety
- Grep for `// @ts-ignore` → counts, deducts from Type & Contract Safety
- File enumeration: presence of `is-enabled.ts` in `features/flags/lib/`, presence of `is-enabled.test.ts`, presence of `flags.ts` schema → contributes to Coverage & Completeness

Manual scoring remains for the subjective items (cache correctness,
naming quality, Zod enum design). The script outputs a JSON file per
run; the manual additions are appended to that JSON.

A reviewer can `pnpm tsx scripts/score-flag.ts path/to/run-dir` and
get a score without trusting the thesis author.

| Effort | Defensibility gain |
|---|---|
| 4–5 hours | High |

### Improvements summary

| # | Improvement | Effort | Gain |
|---|---|---|---|
| 1 | Pre-registration document | 3–4 h | Very high |
| 2 | Time-to-correct metric | 5 h | High |
| 3 | Directional predictions (DP1–3) | 1 h | Medium-high |
| 4 | Bootstrap Condition B with env surface | 2–3 h | Medium |
| 5 | Public scoring script | 4–5 h | High |
| **Total** | | **~15–18 h** | |

If only two can be done: pick **#1 pre-registration** and **#5 public
scoring script**. Together they cover the two biggest reviewer objections
("you could have rigged the rubric" + "how do I trust your manual scores")
at ~7–9 hours total.

### Improvements explicitly rejected

- Running more features (admin user list, plan CRUD) — timeline does not
  allow it; explicitly future work.
- Cross-tool comparison (Cursor vs Copilot vs Claude Code) — already in
  future work; running it during the Bachelor's window would dilute
  effort.
- Developer-participant study — already in future work; not feasible
  without IRB-equivalent process.
- Refactoring Ch.2 or Ch.3 prose — no defensibility gain; light edits only.
- Reintroducing TanStack Query / React Hook Form to match the original
  thesis wording — explicitly rejected earlier.

---

## 7. What the thesis claims vs what it does

### Claims (defensible)

- A 3-dimension evaluation framework for AI-generated Next.js boilerplate
  exists, is operationalisable, and produces per-feature scores on a 0–5
  rubric.
- SmartKit instantiates the conventions that the framework measures.
- A baseline comparison design (Condition A vs B) is documented and
  executable; the pilot illustrates it on one feature with N=5 runs per
  condition.
- Replication artefacts (scripts, scoring rulebook, prompt templates,
  condition-bootstrap scripts) are released publicly.

### Does NOT claim

- That SmartKit is the best Next.js SaaS boilerplate.
- That the framework statistically distinguishes good vs bad AI tools.
- That SmartKit conventions are the only valid way to structure Next.js
  SaaS apps.
- That a single pilot feature is sufficient for hypothesis testing.

The pilot is **worked-example**, not empirical validation. Statistical claims
are explicitly future work.

**Snapshot limitation.** The pilot is one AI tool (Cursor AI) at one model
snapshot. Scores are not a stable measurement across AI tools or model
versions. Cross-tool / cross-version is future work (§9).

---

## 8. Open items still pending

These were settled in discussion but not yet executed:

- [ ] Actually generate the Condition A and Condition B runs (N=5 each)
- [ ] Score all 10 generated files with the framework rubric
- [ ] Update `latex/main.tex`:
  - [ ] Abstract — drop RHF, TanStack, "SmartKit-React" → "SmartKit"
  - [ ] Tech-stack enumeration in Ch.1 and Ch.2 — strip RHF, TanStack
  - [ ] H1/H2/H3 wording — reframe as framework properties
  - [ ] Contribution list — expand #3 to include baseline comparison design
  - [ ] Future Work section — list cross-tool, cross-framework,
        developer-participant study
- [ ] Add Condition A vs Condition B table to Pilot chapter
- [ ] Rebuild `main.pdf` and verify no broken `\parencite` keys
- [ ] Decide whether Condition B gets implemented as a sibling directory
      (e.g. `smartkit-baseline/`) or as a temporary branch

### ADR-1: Sibling directory for baseline

**Context.** Condition B (baseline) requires a separate Next.js project structure without AGENTS.md or `.cursor/rules/` present. Three options were considered: (1) subfolder inside SmartKit, (2) git worktree, (3) sibling directory at thesis root.

**Decision.** Implement Condition B as a sibling directory `smartkit-baseline/` at the same level as `SmartKit/`.

**Consequences.** This prevents AGENTS.md and `.cursor/rules/` from leaking into the baseline environment, allows independent `pnpm install` for each condition, and keeps git histories separate. Trade-off: requires explicit path handling in scripts that reference both conditions.

- [ ] Write `docs/pilot-pre-registration.md` (§11) and commit before first run
- [ ] Build `scripts/setup-condition-b.ts` (§12) and verify
- [ ] Build `scripts/score-flag.ts` (§13) and verify against synthetic run
- [ ] Execute N=5 per condition pilot per §14 timeline
- [ ] Run pre-execution verification checklist (§15) before first AI session

---

## 9. References cited in this discussion

- Peng et al. (2023) — 55.8% completion-time improvement with Copilot
- Yetistiren et al. (2022) — AI strength on boilerplate generation
- Chen et al. (2021) — HumanEval (algorithmic correctness benchmark)
- Jimenez et al. (2024) — SWE-bench (real-world bug fixing benchmark)
- Ouyang et al. (2025) — LLM non-determinism in code generation
- Barke et al. (2022) — grounded prompting (used to justify AGENTS.md context)
- Vibestack (2025) — community catalogue of Next.js-specific AI hallucinations
- RigorBench (2026) — engineering process discipline metric

Full bibliography lives in `latex/main.bbl`.

---

## 10. Pilot artefacts (extensions §11–§15)

Sections 11–15 are the **execution-grade** expansion of the five
"Improvements" in §6. They spell out what each artefact must contain
before the first AI session runs, so that nothing in §6.1–§6.5 is left
implicit. These sections do not change the §6 design — they are
fill-in-the-blank specifications that turn the design into deliverables.

---

## 11. Pre-registration document

### 11.1 File location

Write `docs/pilot-pre-registration.md` (sibling to this file, also
working memory, **not** part of the thesis). Mirror to
`latex/appendix-pre-registration.tex` for the official record. Commit
both before the first AI session starts. The git commit hash of the
pre-registration must appear in §5.5 of the thesis as the audit anchor.

### 11.2 Required sections (verbatim headings)

1. **Feature chosen** — `isEnabled(flagKey, userId?)` utility, §5.1.
2. **Condition A definition** — copy §3.1 "Condition A (treatment)"
   verbatim, with `git rev-parse HEAD` of the SmartKit snapshot used.
3. **Condition B definition** — copy §3.1 "Condition B (control)" and
   §6.4 bootstrap spec verbatim, with the output path of
   `scripts/setup-condition-b.ts`.
4. **Prompt template** — copy §3.2 prompt verbatim, with SHA256 of the
   prompt string embedded in the pre-registration.
5. **Run-order schedule** — the seeded CRD schedule (see §4 amendment
   below) listing run N (1..5) → condition → which condition runs first.
   Document the seed.
6. **N per condition** — adaptive 3 → 5 (§4), with the variance threshold
   ("range > 2 → run 2 more") frozen.
7. **Scoring rubric (15 cells)** — the 5 levels × 3 dimensions grid
   (§5.3), with the per-cell rule written out (e.g. "Level 2 Structural
   Integrity: file lives in `features/flags/lib/` but uses `any` in
   public API → 2/5").
8. **DP1–DP3 decision rule** — copy §5.4 binary rule verbatim.
9. **Exclusion criteria** — list of exclusion codes and the failure
   mode each maps to:
   - E1: AI session crash mid-generation → exclude run, replace.
   - E2: network failure / rate-limit mid-generation → exclude run,
     replace.
   - E3: generated artefact missing all three of (`isEnabled` function,
     `FlagKey` type, test file) → exclude run, replace. (Minimum-scope
     gate; if the AI did not understand the task, the run is not
     comparable.)
   - E4: time-to-correct budget (60 min) exceeded → record run with
     "did not converge" flag, **do not** patch further. Excluded from
     DP confirmation but kept in the appendix for transparency.
10. **Tooling snapshot** — record Cursor AI version, model name,
    temperature setting, MCP servers enabled, and the date of the run.
    Do not edit after first run.
11. **Author lock** — signed by author with date. The lock statement
    reads: "I commit to scoring each run per this rubric without
    modification. Any deviation requires a new pre-registration
    document."

### 11.3 Pre-registration vs thesis wording

The pre-registration is **not** the thesis. The thesis Ch.5 references
the pre-registration by git commit hash and summarises the rubric, but
the operational rubric (the 15-cell grid) lives in
`docs/pilot-pre-registration.md`. This separation is intentional: it
keeps the thesis readable while preserving the operational record.

---

## 12. `scripts/setup-condition-b.ts`

### 12.1 Purpose

Produce a deterministic, repeatable Condition B baseline repository.
Without it, "convention-naive" is a moving target across runs and the
comparison is contaminated.

### 12.2 Inputs

- A target directory (default: `../smartkit-baseline/`).
- A path to the SmartKit snapshot to strip conventions from (default:
  `../SmartKit/`).

### 12.3 Outputs

A directory that **keeps** the SmartKit tooling surface but **removes**
the convention envelope:

**Kept (so the two conditions differ only in conventions):**

- All dependencies from `package.json` (Next.js, Drizzle, Biome, Zod,
  Vitest, Better Auth, Resend, etc.)
- `tsconfig.json` with `"strict": true`
- Tailwind CSS 4.x setup (default config, not SmartKit's custom theme)
- `biome.json` (default SmartKit config is fine; rules alone are not
  "conventions")
- `drizzle.config.ts` and `drizzle-orm` packages
- A minimal `src/database/schema/orders.ts` (just enough for the
  flag check / cache use case to type-check; no auth tables)
- `.env.example` with all required env placeholders

**Removed (the actual convention envelope):**

- `AGENTS.md`
- `.cursor/rules/` directory (and any `CLAUDE.md` manifest)
- `src/features/{auth,billing}/` (and any other SmartKit features)
- `src/lib/email.ts`, `src/lib/auth.ts`, `src/lib/sepay.ts` and other
  SmartKit-specific helpers
- Email templates, server actions, hooks specific to SmartKit features

**Replaced with convention-naive defaults:**

- `app/page.tsx` → `create-next-app` default landing
- `app/layout.tsx` → `create-next-app` default
- No `features/` directory; flat `lib/` allowed at root

### 12.4 Verification

The script must end with a self-check that prints:

```
Condition B built at <path>:
  - has 'AGENTS.md'        : <true/false>
  - has '.cursor/rules/'   : <true/false>
  - has 'features/'        : <true/false>
  - has 'tsconfig strict'  : <true/false>
  - has 'drizzle'          : <true/false>
  - has '.env.example'     : <true/false>
All 6 checks must pass before any Condition B run starts.
```

If any check fails, the script exits non-zero so the CI / manual run
fails loudly. This is the **first** check to run before each Condition
B pilot session.

### 12.5 Open implementation question

The script needs a `from-smartkit` flag (`--from-smartkit` or a config
file) so that it can be re-run deterministically from the same SmartKit
commit hash. Without this, two pilots separated by SmartKit changes
would not be comparable. **Decision:** add a `--from-commit <sha>`
argument that verifies the SmartKit working tree matches the pinned
commit before stripping.

---

## 13. `scripts/score-flag.ts`

### 13.1 Purpose

Automate the **objective** parts of §5.3 rubric. Manual scoring remains
for the subjective cells; this script produces a JSON per run with the
automated subscores and a placeholder for the manual addendum.

### 13.2 CLI

```
pnpm tsx scripts/score-flag.ts \
  --run-dir runs/cond-a/run-03 \
  --out runs/cond-a/run-03/score.json
```

### 13.3 Output schema

// Source of truth: SmartKit/scripts/score-flag.ts `scoreStructural()` lines 161–246.
// `path_match` ∈ {0, 0.5, 1} and `feature_complete` ∈ {0, 0.5, 0.7, 0.9, 1} per lines 197–236.
// `score` = round((path_match + feature_complete) * 2.5) per line 243.

```jsonc
{
  "run_id": "cond-a-run-03",
  "tooling_snapshot": { /* copied from pre-registration */ },
  "automated": {
    "structural_integrity": {
      "is_enabled_file": "features/flags/lib/is-enabled.ts",
      "has_is_enabled_export": true,
      "uses_server_only_import": true,
      "has_use_client_in_util": false,
      "path_match": 1,
      "feature_complete": 1,
      "score": 5
    },
    "type_contract_safety": {
      "tsc_error_count": 0,
      "any_count": 0,
      "ts_ignore_count": 0,
      "flag_key_is_zod_enum": true,
      "score": 5
    },
    "coverage_completeness": {
      "is_enabled_ts_present": true,
      "is_enabled_test_ts_present": true,
      "flags_ts_schema_present": true,
      "index_ts_barrel_present": true,
      "five_minute_cache_implemented": true,
      "score": 5
    }
  },
  "manual": {
    "structural_integrity": null,    // human fills in 0-5
    "type_contract_safety": null,
    "coverage_completeness": null,
    "naming_quality": null,
    "notes": ""
  },
  "time_to_correct_minutes": 12,
  "edit_list": [
    "renamed FlagKey to ZodEnum",
    "added 5-min cache invalidation on env change"
  ],
  "did_not_converge": false,
  "exclusion_code": null
}
```

### 13.4 What the script must NOT do

- It must not call the AI / LLM. Scoring is offline grep + tsc.
- It must not mutate the input `--run-dir`. The script reads; the
  run-dir is a frozen artefact.
- It must not invent a score. If a measurement is missing (e.g. test
  file deleted before scoring), the cell is `null`, not a default.

### 13.5 Open implementation question

The script depends on a stable file layout. If the AI in a given run
generates `is-enabled.ts` at a different path (e.g. `src/utils/flag.ts`),
the file-location check in §5.3 scores 0. The script must accept
arbitrary file paths via glob, not hardcode `features/flags/lib/`. **Decision:**
score by `git ls-files` enumeration at score time, against a regex
allowlist derived from §5.3 rules.

---

## 14. Pilot execution timeline

### 14.1 Calendar (1-month window, all times in user's local TZ)

| Day | Block | Deliverable |
|---|---|---|
| **D-21 to D-15** (1 wk) | Setup | `pilot-pre-registration.md` (§11) committed; `setup-condition-b.ts` (§12) + `score-flag.ts` (§13) built and self-tested on a synthetic run; Condition A and Condition B repos both ready; git commit hashes recorded. |
| **D-14 to D-12** (3 d) | Smoke | 1 N=1 dry run on each condition with a known-good prompt, scored end-to-end. Confirms tooling works. **Excluded** from the N=5 final tally. |
| **D-11 to D-9** (3 d) | Run 1–3 of each condition | N=3 per condition. **Adaptive N decision** applied here: if range across runs ≤ 1 point → stop at N=3; if > 2 → run 2 more. |
| **D-8 to D-6** (3 d, conditional) | Run 4–5 if needed | N=5 per condition, only if D-11..D-9 trigger. Time-to-correct clock starts at AI session start. |
| **D-5 to D-3** (3 d) | Scoring | All 10 (or 6) runs scored by `score-flag.ts` + manual addendum. JSON score files committed. |
| **D-2 to D-1** (2 d) | Analysis + writing | DP1/DP3/DP3 status (confirmed/refuted/null) written into thesis Ch.5; Limitations updated with snapshot limitation; pre-registration git hash referenced. |
| **D-0** | Submission | `main.pdf` rebuilt; `\parencite` keys verified; final commit tagged `thesis-submission`. |

### 14.2 Run-day checklist (apply each of 6 days)

1. Open `docs/pilot-pre-registration.md`. Verify the git hash recorded
   there matches `HEAD` (no edits since pre-registration).
2. For Condition A: pull latest SmartKit, `pnpm install`, verify
   `pnpm check-types` and `pnpm lint` clean on a clean tree.
3. For Condition B: run `pnpm tsx scripts/setup-condition-b.ts` and
   verify all 6 self-check rows pass.
4. Open Cursor AI in the run directory. Copy the prompt verbatim from
   the pre-registration. Start the session. **Start time-to-correct
   clock now.**
5. When AI finishes, snapshot the generated files into
   `runs/cond-{a|b}/run-NN/`. Do not edit the snapshot.
6. Apply `pnpm lint && pnpm check-types && pnpm vitest run features/flags`
   in the run-dir. Record each result. Run `scripts/score-flag.ts`.
7. If convergence < 60 min: stop. If > 60 min: mark `did_not_converge`.
8. Commit the run dir + score.json. Move to next run.

### 14.3 Cost envelope

10 AI sessions × 1.5 h each = 15 h pilot execution. Plus 10 scoring
sessions × 0.5 h = 5 h scoring. Plus 5 h setup. **Total pilot work: ~25 h.**
This is achievable in the 1-month window if no other thesis task
competes for the same hours.

### 14.4 Stop conditions

- If 2 consecutive runs are excluded (E1/E2/E3 in §11.2), pause and
  diagnose the AI tool before continuing. The pilot is unusable if the
  exclusion rate exceeds 20%.
- If at the adaptive N=3 decision point the median is identical for
  the two conditions (e.g. both 3/5 on all three dimensions), the
  directional predictions are null regardless of run order — stop at
  N=3 and document.

---

## 15. Pre-execution verification checklist

Run through this list **the day before the first AI session**. Any
unchecked box blocks the pilot from starting.

### 15.1 Pre-registration (anchors all else)

- [x] `docs/pilot-pre-registration.md` exists, committed, and matches `HEAD`.
- [x] `latex/appendix-pre-registration.tex` exists and matches the markdown.
- [x] The 11 required sections (§11.2) are all present.
- [x] SHA256 of the prompt string is in the pre-registration: `18b84fd4dfff09d600548833c11eaedad469e5a689b50ba1c13dc9e85375e8f2`
- [x] Run-order schedule has a documented seed and 5 rows (seed=1234567890, see §5 Table).
- [x] Author lock is signed and dated: `2026-09-02T05:23:00Z` (git tag `pre-reg-lock-20260902`, commit `0ac4b35`).
- [x] Tag-object SHA: `adbd23092bd7df93b5c3d92108c82a49f3cf68be` (annotated tag; dereferences to commit `0ac4b35`). The tag message body contains the document content hash, not the tag-object SHA — both are recorded in `pilot-pre-registration.md` §11 footer for cross-verification.

### 15.2 Condition A (SmartKit)

- [ ] `pnpm install` completes cleanly.
- [ ] `pnpm lint` reports 0 errors.
- [ ] `pnpm check-types` reports 0 errors.
- [ ] `pnpm test:run` reports all green.
- [ ] `AGENTS.md` is at the root of the run-dir.
- [ ] `.cursor/rules/` is at the root of the run-dir.
- [ ] `src/features/auth/` and `src/features/billing/` are present.
- [ ] The git commit hash of the SmartKit snapshot is recorded in
      the pre-registration.

### 15.3 Condition B (baseline)

- [ ] `pnpm tsx scripts/setup-condition-b.ts --out ../smartkit-baseline` exits 0.
- [ ] All 6 self-check rows print `true` for the expected pattern.
- [ ] No `AGENTS.md` at the baseline root.
- [ ] No `.cursor/rules/` at the baseline root.
- [ ] No `features/` directory.
- [ ] `tsconfig.json` has `"strict": true`.
- [ ] `.env.example` has SePay + Resend + Better~Auth placeholders (matches the broader env-var surface that Condition A exposes; Condition B must surface the same env vars even if it does not use them).
- [ ] `pnpm install` in the baseline completes.
- [ ] `pnpm check-types` and `pnpm lint` in the baseline report 0 errors
      on a clean tree.

### 15.4 Scoring tooling

- [ ] `scripts/score-flag.ts` runs without error on the smoke run from
      D-14..D-12.
- [ ] The output JSON has the schema in §13.3.
- [ ] Manual cells are `null` (not auto-filled) after script run.
- [ ] `pnpm tsx scripts/score-flag.ts --help` documents the CLI flags.

### 15.5 AI tool snapshot

- [ ] Cursor AI version recorded in the pre-registration.
- [ ] Model name recorded.
- [ ] Temperature setting recorded.
- [ ] MCP servers list recorded.
- [ ] Date of first planned run recorded.

### 15.6 First-run dry run

- [ ] D-14..D-12 dry run on each condition completed.
- [ ] Dry run scored end-to-end with `score-flag.ts`.
- [ ] Manual cells filled in for the dry run to confirm the rubric
      wording is unambiguous.
- [ ] If dry run revealed any rubric ambiguity, the pre-registration
      was **not** edited (the dry run is excluded; the rubric is
      frozen). Any new ambiguity is noted as a thesis-limitations
      issue, not a rubric fix.

### 15.7 Reviewer-rehearsal sanity check

Before starting, ask one peer (classmate or supervisor) to read the
pre-registration and answer:

- "What would convince you that the rubric was not retrofitted to the
  data?" (Answer: the git hash, the SHA256 prompt, the unchanged
  15-cell grid after the dry run.)
- "How would you reproduce Run 4 of Condition A?" (Answer: checkout
  the pre-registration commit, run setup-condition-b.ts, follow the
  run-order schedule row 4.)
- "What if the result is null on all three DPs?" (Answer: that is a
  valid outcome; thesis reports null, does not retrofit a narrative.)

If the peer cannot answer these from the pre-registration alone, the
pre-registration is incomplete.

### 15.8 Sign-off

After all 15.1–15.7 boxes are checked, the author signs:

> "I have verified the pre-registration, the two conditions, the
> scoring script, and the AI tool snapshot. The first AI session will
> run on <date> at <time>."

This sign-off is committed to the repo as `docs/pilot-pre-execution-signoff.md`
with the same pre-registration commit hash. The pilot starts only
after this commit lands.