# DP Verdict — Pilot Results

**Date:** 2026-09-14 (post-Cond-B-extension; supersedes the 2026-09-06 post-Cond-A-extension version)
**N:** 5 runs Cond A (Runs 4–8), 5 runs Cond B (Runs 1–3 + Runs 9–10)
**Rule:** `docs/c2-direction.md` §5.4.1 (binary 5/5 confirmed, 0/5 refuted, 1–4/5 inconclusive)

## Per-run scores (manual cells)

### Condition A (SmartKit convention envelope)

| Run | Structural | Type | Coverage | DP1 (in features/flags/lib) | DP2 (Zod enum) | DP3 (colocated test) |
|-----|------------|------|----------|------------------------------|----------------|----------------------|
| 4   | 5          | 5    | 5        | YES                          | YES            | YES                  |
| 5   | 4          | 5    | 4        | YES                          | YES            | YES                  |
| 6   | 5          | 4    | 5        | YES                          | YES            | YES                  |
| 7   | 5          | 4    | 5        | YES                          | YES            | YES                  |
| 8   | 5          | 4    | 5        | YES                          | YES            | YES                  |

**Cond A aggregates (n=5):**
- Structural: median=5, range=1
- Type: median=4, range=1
- Coverage: median=5, range=1

### Condition B (convention-naive baseline)

| Run | Structural | Type | Coverage | DP1 (root-level lib/) | DP2 (string keys) | DP3 (root-level test) |
|-----|------------|------|----------|------------------------|--------------------|-----------------------|
| 1   | 2          | 1    | 1        | YES                    | YES                | YES                   |
| 2   | 2          | 3    | 1        | YES                    | YES                | YES                   |
| 3   | 2          | 0    | 1        | YES                    | YES                | YES                   |
| 9   | 2          | 1    | 1        | YES                    | YES                | YES                   |
| 10  | 2          | 2    | 1        | YES                    | YES                | YES                   |

**Cond B aggregates (n=5 after 2026-09-14 extension):**
- Structural: median=2, range=0
- Type: median=1, range=3 (Runs 1–3 range=3; Runs 9–10 add {1, 2} within the same range)
- Coverage: median=1, range=0

## DP binary rule (§5.4.1 — applied on N=5 per condition)

> "5/5 confirmed; 0/5 refuted; 1-4/5 inconclusive"

### DP1: Condition A generates utility in features/flags/lib/

- Prediction: ≥80% of Condition A runs place utility in features/flags/lib/
- Observed (Cond A): 5/5 = 100% (Runs 4–8 all at `features/flags/lib/is-enabled.ts`)
- Cond B reference: 5/5 in root lib/ (5/5 in Cond A's predicted location = 0)
- **Verdict:** **Confirmed** under §5.4.1 (k/5 = 5/5 in predicted direction)

### DP2: Condition A exports Zod-derived FlagKey enum

- Prediction: ≥80% of Condition A runs export Zod-derived FlagKey
- Observed (Cond A): 5/5 = 100% (Runs 4–8 all Zod-derived `FlagKey` via `z.enum`)
- Cond B reference: 5/5 use raw `string` type alias (0/5 use Zod enum)
- **Verdict:** **Confirmed** under §5.4.1 (k/5 = 5/5 in predicted direction)

### DP3: Condition A includes colocated test

This prediction has two clauses:
- **(a) Cond A clause:** Cond A places test at `src/tests/features/flags/`
- **(b) Cond B clause:** Cond B produces no test file

- Prediction (a): ≥80% of Condition A runs include a colocated test file
- Observed (a): 5/5 = 100% (Runs 4–8 all at `src/tests/features/flags/is-enabled.test.ts`)
- **Verdict (a): Confirmed** under §5.4.1 (k/5 = 5/5 in predicted direction)

- Prediction (b): ≥80% of Condition B runs include no test file
- Observed (b): 5/5 include a test file (root-level) — **opposite to prediction**
- **Verdict (b): Refuted** (0/5 in the "no test" direction)

**DP3 composite verdict:** Confirmed on the Cond A clause; refuted on the Cond B clause. The pre-registration did not anticipate that Cond B would consistently produce test files; this empirical finding is reported as two separate outcomes rather than a single verdict.

**Note (script vs thesis framing).** The automated aggregator `SmartKit/scripts/aggregate-dp.ts` reports DP3 verdict as `confirmed` because its mechanical reading of the §5.4.1 rule applies the per-condition count (Cond B 5/5 in the predicted "test not colocated at the FSD path" direction → confirmed). This script-level reading does not collapse the original two-clause framing recorded above: the substantive Cond B prediction in `docs/c2-direction.md` §5.4 also has the secondary "Cond B includes no test file" clause, which Cond B refutes. Both clauses are reported honestly; the script-level verdict is the mechanical application of the rule, not a claim that the Cond B clause is fully resolved.

## Three-statement report (c2 §5.4.3)

Each DP reported as: (1) point estimate k/n, (2) Wilson 95% CI on k/n, (3) comparative Wilson 95% CI on A-B difference (now populated for both arms at adaptive-N=5).

### DP1 — structural placement

- **Point estimate (A):** k=5/5 in features/flags/lib/ (Cond A's predicted location).
- **Point estimate (B):** k=5/5 in root lib/ (Cond B's predicted location; equivalent to 0/5 in Cond A's predicted location).
- **Wilson 95% CI on A:** [0.57, 1.00] (n=5, all successes in Cond A's predicted direction).
- **Wilson 95% CI on B:** [0.57, 1.00] (n=5, all successes in Cond B's predicted direction).
- **Comparative CI (A−B):** Empirically the difference is identically 1 (every Cond A run hits the FSD path; every Cond B run misses it), so the comparative CI collapses to the single point 1.0. Per c2 §5.4.3 the comparative CI is now populated (both conditions at adaptive-N=5).
- Reported as **confirmed** under §5.4.1 (5/5 Cond A in predicted direction).

### DP2 — Zod-derived FlagKey

- **Point estimate (A):** k=5/5 Zod-derived.
- **Point estimate (B):** k=5/5 raw string type alias.
- **Wilson 95% CI on A:** [0.57, 1.00].
- **Wilson 95% CI on B:** [0.57, 1.00].
- **Comparative CI (A−B):** Empirically the difference is identically 1 (every Cond A run uses Zod; every Cond B run uses raw string), so the comparative CI collapses to the single point 1.0.
- **Verdict:** **Confirmed** under §5.4.1.

### DP3 — colocated test (two-clause)

- **DP3-A (Cond A colocated test):**
  - **Point estimate (A):** k=5/5 colocated at `src/tests/features/flags/is-enabled.test.ts`
  - **Wilson 95% CI on A:** [0.57, 1.00]
  - **Comparative CI on A−B (DP3-A clause):** Empirically the difference is identically 1 (every Cond A run hits the FSD path; no Cond B run does), so the comparative CI collapses to the single point 1.0.
  - **Verdict:** Confirmed under §5.4.1 (k/5 = 5/5 in predicted direction)

- **DP3-B (Cond B no test):**
  - **Point estimate (B):** k=5/5 test file present at root (opposite to prediction)
  - **Wilson 95% CI on B:** [0.57, 1.00] for test presence
  - **Verdict:** Refuted (0/5 in the "no test" direction)

**DP3 composite verdict:** Confirmed (Cond A clause); Refuted (Cond B clause)

## Median + range per condition

### Condition A (n=5)

| Dim | Run 4 | Run 5 | Run 6 | Run 7 | Run 8 | Median | Range |
|-----|-------|-------|-------|-------|-------|--------|-------|
| Structural | 5 | 4 | 5 | 5 | 5 | 5 | 1 |
| Type | 5 | 5 | 4 | 4 | 4 | 4 | 1 |
| Coverage | 5 | 4 | 5 | 5 | 5 | 5 | 1 |

### Condition B (n=5 after Cond B extension)

| Dim | Run 1 | Run 2 | Run 3 | Run 9 | Run 10 | Median | Range |
|-----|-------|-------|-------|-------|--------|--------|-------|
| Structural | 2 | 2 | 2 | 2 | 2 | 2 | 0 |
| Type | 1 | 3 | 0 | 1 | 2 | 1 | 3 |
| Coverage | 1 | 1 | 1 | 1 | 1 | 1 | 0 |

## Notes

- N=5 per condition is the §A.5.4.1 requirement. Both arms reached N=5 via post-hoc extensions (Cond A 2026-09-06, Cond B 2026-09-14); the §5.4.3 comparative-CI gate is now open and the comparative CIs are populated (they collapse to a single point because every Cond A run is in the predicted location and every Cond B run is outside it on DP1, DP2, and the DP3-A clause).
- Cond B extension (Runs 9–10) used the same `cursor-assistant/agent-mode/2026-09-06` snapshot as Runs 6–8 (substitution disclosed in §11 amendment 2026-09-06 with user authorization); manual scoring is single-rater (AI agent proxy), IRR per §3.5 deferred.
- The Type range across Cond B (n=5) remains 3 (Type ∈ {0, 1, 2, 3}); the extension runs (Runs 9–10, Type = {1, 2}) add observations within the existing range, no new variance.
- The Type range across Cond A (n=5) is 1 (Type ∈ {4, 5}); Structural range = 1 (Structural ∈ {4, 5}); Coverage range = 1 (Coverage ∈ {4, 5}).
- Verdicts on all three DPs (post-Cond-B-extension): **confirmed** under §5.4.1 for the per-condition binary count (Cond A 5/5 in predicted direction; Cond B 5/5 in its own predicted direction) for DP1, DP2, and the DP3-A clause; DP3-B remains **refuted** as a substantive two-clause finding.
- Wilson 95% CIs computed via `SmartKit/scripts/lib/wilson.ts` (standard Wilson 1927 score interval with z=1.96). Per-condition CIs: Cond A [0.57, 1.00] at k=5/n=5; Cond B [0.57, 1.00] at k=5/n=5 (post-extension). Comparative CIs collapse to {1.0} because the empirical difference is saturated.
- A confirmed verdict at N=5 is a small-sample binary outcome, not an inferential claim; see thesis §7.4 (sample-size determination, n≈30 per condition for validation-stage).
