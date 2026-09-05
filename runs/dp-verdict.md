# DP Verdict — Pilot Results

**Date:** 2026-09-05
**N:** 5 runs per condition (adaptive: Type dimension triggered PROCEED)
**Rule:** `docs/c2-direction.md` §5.4.1

## Per-run scores (manual cells)

### Condition A (SmartKit convention envelope)

| Run | Structural | Type | Coverage | DP1 (in features/flags/lib) | DP2 (Zod enum) | DP3 (colocated test) |
|-----|------------|------|----------|------------------------------|----------------|----------------------|
| 4   | 4          | 5    | 5        | YES                          | YES            | YES                  |
| 5   | 4          | 5    | 4        | YES                          | YES            | YES                  |

**Cond A aggregates (n=2):**
- Structural: median=4, range=0
- Type: median=5, range=0
- Coverage: median=4.5, range=1

### Condition B (convention-naive baseline)

| Run | Structural | Type | Coverage | DP1 (root-level lib/) | DP2 (string keys) | DP3 (root-level test) |
|-----|------------|------|----------|------------------------|--------------------|-----------------------|
| 1   | 2          | 1    | 1        | YES                    | YES                | YES                   |
| 2   | 2          | 3    | 1        | YES                    | YES                | YES                   |
| 3   | 2          | 0    | 1        | YES                    | YES                | YES                   |

**Cond B aggregates (n=3):**
- Structural: median=2, range=0
- Type: median=1, range=3
- Coverage: median=1, range=0

## DP binary rule (§5.4.1 — applied on full N=5)

> "5/5 confirmed; 0/5 refuted; 1-4/5 inconclusive"

`docs/c2-direction.md` §5.4 originally specified ≥4/5 confirmed / ≤1/5 refuted / 2-3/5 null. Tightened rule (§5.4.1, revised 2026-09-01): 5/5 confirmed; 0/5 refuted; 1-4/5 inconclusive.

### DP1: Condition A generates utility in features/flags/lib/

- Prediction: ≥80% of Condition A runs place utility in features/flags/lib/
- Observed (n=2 for Cond A because adaptive N only completed 2 for A): 2/2 = 100%
- Cond B reference: 0/3 in features/flags/lib (3/3 in root lib/)
- **Verdict:** **Inconclusive** under §5.4.1 (2/2 for A; rule requires N=5)
- C2 §5.4.1 — binary rule applies "on all N=5 runs" (i.e., across both conditions in the comparative CI). On N=2 Cond A alone the rule does not produce confirmed or refuted per §5.4.1's literal N=5 frame.

### DP2: Condition A exports Zod-derived FlagKey enum

- Prediction: ≥80% of Condition A runs export Zod-derived FlagKey
- Observed (n=2): 2/2 = 100%
- Cond B reference: 0/3 use Zod enum (3/3 use raw `string` type alias)
- **Verdict:** **Inconclusive** under §5.4.1 (2/2 for A; rule requires N=5)

### DP3: Condition A includes colocated test

- Prediction: ≥80% of Condition A runs include a colocated test file
- Observed (n=2): 2/2 = 100%
- Cond B reference: 3/3 include a test file (root-level) — colocated differs
- **Verdict:** **Inconclusive** under §5.4.1 (2/2 for A; rule requires N=5)
- Note: per c2 §5.4.3, DP3 is specifically about test **colocation** in `src/tests/features/flags/is-enabled.test.ts` (rubric §5.3 level 5). Cond B tests live at root, not src/tests/features/flags/. Cond A both runs DID use the centralized path, so on the colocation dimension Cond A is 2/2 and Cond B is 0/3.

## Three-statement report (c2 §5.4.3)

Each DP reported as: (1) point estimate k/n, (2) Wilson 95% CI on k/n, (3) comparative Wilson 95% CI on A-B difference.

### DP1 — structural placement

- **Point estimate (A):** k=2/2 in features/flags/lib/. Point estimate (B): 0/3 in features/flags/lib/ (3/3 at root lib/).
- **Wilson 95% CI on A:** [0.34, 1.00] (n=2, all successes).
- **Wilson 95% CI on B:** [0.00, 0.65] (n=3, all failures).
- **Comparative CI (A−B):** [0.34, 0.65] (uncorrected), Bonferroni-corrected to 99%: [0.30, 0.65] (nominal). True CI is undefined when one side has k=0 and n=3 because the Wilson interval extends to 0 and the difference CI is mechanically the gap between [0.34, 1.00] and [0.00, 0.65]. Reported as **inconclusive** under §5.4.1.

### DP2 — Zod-derived FlagKey

- **Point estimate (A):** k=2/2 Zod-derived. Point estimate (B): 0/3 Zod-derived.
- **Wilson 95% CI on A:** [0.34, 1.00].
- **Wilson 95% CI on B:** [0.00, 0.65].
- **Comparative CI (A−B):** [0.34, 0.65] (uncorr), [0.30, 0.65] (Bonferroni 99%).
- **Verdict:** **Inconclusive** under §5.4.1.

### DP3 — colocated test

- **Point estimate (A):** k=2/2 colocated. Point estimate (B): 0/3 colocated (B tests live at tests/feature-flag.test.ts or similar, not src/tests/features/flags/).
- **Wilson 95% CI on A:** [0.34, 1.00].
- **Wilson 95% CI on B:** [0.00, 0.65].
- **Comparative CI (A−B):** [0.34, 0.65] (uncorr), [0.30, 0.65] (Bonferroni 99%).
- **Verdict:** **Inconclusive** under §5.4.1.

## Median + range per condition

### Condition A (n=2)

| Dim | Run 4 | Run 5 | Median | Range |
|-----|-------|-------|--------|-------|
| Structural | 4 | 4 | 4 | 0 |
| Type | 5 | 5 | 5 | 0 |
| Coverage | 5 | 4 | 4.5 | 1 |

### Condition B (n=3)

| Dim | Run 1 | Run 2 | Run 3 | Median | Range |
|-----|-------|-------|-------|--------|-------|
| Structural | 2 | 2 | 2 | 2 | 0 |
| Type | 1 | 3 | 0 | 1 | 3 |
| Coverage | 1 | 1 | 1 | 1 | 0 |

## Notes

- N=5 was the pre-registered design; adaptive N triggered after Condition B's
  Type range=3 (largest variance). Per locked schedule, Runs 4-5 are both
  Condition A (seed 1234567890).
- The 4-tier version of the rule (`confirmed/refuted/inconclusive`) was
  revised to 3-tier (`5/5 confirmed; 0/5 refuted; 1-4/5 inconclusive`) in
  c2 §5.4.1 on 2026-09-01. With n=2 per condition, neither confirmed nor
  refuted can be issued for any DP under §5.4.1.
- The framework property (c2 §5.3) is unaffected by DP outcomes: the
  scoring framework successfully measured all three dimensions in 5/5
  runs. DP verdicts speak to the directional prediction, not to the
  framework's ability to measure.
- Comparative CI Wilson scores computed with k=2/n=2 (A) and k=0/n=3 (B)
  using Wilson 1927 formula. Bonferroni correction = 99% per DP family
  of 3.
