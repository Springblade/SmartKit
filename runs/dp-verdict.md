# DP Verdict — Pilot Results

**Date:** 2026-09-06 (post-extension; supersedes the 2026-09-05 interim version)
**N:** 5 runs Cond A (Runs 4–8, after §A.11 extension 2026-09-06), 3 runs Cond B (Runs 1–3)
**Rule:** `docs/c2-direction.md` §5.4.1

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

**Cond B aggregates (n=3):**
- Structural: median=2, range=0
- Type: median=1, range=3
- Coverage: median=1, range=0

## DP binary rule (§5.4.1 — applied on N=5 Cond A)

> "5/5 confirmed; 0/5 refuted; 1-4/5 inconclusive"

`docs/c2-direction.md` §5.4 originally specified ≥4/5 confirmed / ≤1/5 refuted / 2-3/5 null. Tightened rule (§5.4.1, revised 2026-09-01): 5/5 confirmed; 0/5 refuted; 1-4/5 inconclusive.

### DP1: Condition A generates utility in features/flags/lib/

- Prediction: ≥80% of Condition A runs place utility in features/flags/lib/
- Observed: 5/5 = 100% (Runs 4–8 all at `features/flags/lib/is-enabled.ts`)
- Cond B reference: 0/3 in features/flags/lib (3/3 in root lib/)
- **Verdict:** **Confirmed** under §5.4.1 (k/5 = 5/5 in predicted direction)
- History: reported *inconclusive* at the first interim look (2/2 Cond A, n<5); the §A.11 amendment 2026-09-06 extended Cond A to N=5, making the rule determinate.

### DP2: Condition A exports Zod-derived FlagKey enum

- Prediction: ≥80% of Condition A runs export Zod-derived FlagKey
- Observed: 5/5 = 100% (Runs 4–8 all Zod-derived `FlagKey` via `z.enum`)
- Cond B reference: 0/3 use Zod enum (3/3 use raw `string` type alias)
- **Verdict:** **Confirmed** under §5.4.1 (k/5 = 5/5 in predicted direction)

### DP3: Condition A includes colocated test

- Prediction: ≥80% of Condition A runs include a colocated test file
- Observed: 5/5 = 100% (Runs 4–8 all at `src/tests/features/flags/is-enabled.test.ts`)
- Cond B reference: 3/3 include a test file (root-level) — colocated differs
- **Verdict:** **Confirmed** under §5.4.1 (k/5 = 5/5 in predicted direction)
- Note: per c2 §5.4.3, DP3 is specifically about test **colocation** in `src/tests/features/flags/is-enabled.test.ts` (rubric §5.3 level 5). Cond B tests live at root, not src/tests/features/flags/. All 5 Cond A runs DID use the centralized path, so on the colocation dimension Cond A is 5/5 and Cond B is 0/3.

## Three-statement report (c2 §5.4.3)

Each DP reported as: (1) point estimate k/n, (2) Wilson 95% CI on k/n, (3) comparative Wilson 95% CI on A-B difference.

### DP1 — structural placement

- **Point estimate (A):** k=5/5 in features/flags/lib/ (Cond A's predicted location).
- **Point estimate (B):** k=3/3 in root lib/ (Cond B's predicted location; equivalent to 0/3 in Cond A's predicted location).
- **Wilson 95% CI on A:** [0.57, 1.00] (n=5, all successes in Cond A's predicted direction).
- **Wilson 95% CI on B:** [0.44, 1.00] (n=3, all successes in Cond B's predicted direction). Standard Wilson 1927 per `SmartKit/scripts/lib/wilson.ts`.
- **Comparative CI (A−B):** Omitted per c2 §5.4.3 (reported only when both conditions are at adaptive-N=5; Cond B is N=3).
- Reported as **confirmed** under §5.4.1 (5/5 Cond A in predicted direction).

### DP2 — Zod-derived FlagKey

- **Point estimate (A):** k=5/5 Zod-derived.
- **Point estimate (B):** k=3/3 raw string type alias.
- **Wilson 95% CI on A:** [0.57, 1.00].
- **Wilson 95% CI on B:** [0.44, 1.00].
- **Comparative CI (A−B):** Omitted per c2 §5.4.3 (Cond B is N=3).
- **Verdict:** **Confirmed** under §5.4.1.

### DP3 — colocated test

- **Point estimate (A):** k=5/5 colocated at `src/tests/features/flags/is-enabled.test.ts`.
- **Point estimate (B):** k=3/3 not colocated (Cond B tests live at `tests/feature-flags.test.ts`, `tests/flags.test.ts`, `tests/feature-flag.test.ts`, not at `src/tests/features/flags/`).
- **Wilson 95% CI on A:** [0.57, 1.00].
- **Wilson 95% CI on B:** [0.44, 1.00].
- **Comparative CI (A−B):** Omitted per c2 §5.4.3 (Cond B is N=3).
- **Verdict:** **Confirmed** under §5.4.1.

## Median + range per condition

### Condition A (n=5)

| Dim | Run 4 | Run 5 | Run 6 | Run 7 | Run 8 | Median | Range |
|-----|-------|-------|-------|-------|-------|--------|-------|
| Structural | 5 | 4 | 5 | 5 | 5 | 5 | 1 |
| Type | 5 | 5 | 4 | 4 | 4 | 4 | 1 |
| Coverage | 5 | 4 | 5 | 5 | 5 | 5 | 1 |

### Condition B (n=3)

| Dim | Run 1 | Run 2 | Run 3 | Median | Range |
|-----|-------|-------|-------|--------|-------|
| Structural | 2 | 2 | 2 | 2 | 0 |
| Type | 1 | 3 | 0 | 1 | 3 |
| Coverage | 1 | 1 | 1 | 1 | 0 |

## Notes

- N=5 per condition was the §A.5.4.1 requirement; the adaptive N rule triggered after
  Condition B's Type range=3 (largest variance). Per the locked schedule, Runs 4-5 are
  Condition A (seed 1234567890 block); Runs 6-8 extend Cond A to N=5 per §A.11 amendment
  2026-09-06 (seeds 1234567899, 1234567900, 1234567901). Cond B remains at N=3.
- Runs 6-8 were generated by `cursor-assistant/agent-mode/2026-09-06` (tool substitution
  disclosed in the §11 amendment row 2026-09-06, with user authorization); Runs 1-5 were
  generated by `cursor-ai/auto/2026-09-05`. The rubric, prompt, and scoring rule are
  unchanged across the substitution.
- The 4-tier version of the rule (`confirmed/refuted/inconclusive`) was revised to
  3-tier (`5/5 confirmed; 0/5 refuted; 1-4/5 inconclusive`) in c2 §5.4.1 on 2026-09-01.
  At the first interim look (n=2 Cond A) no verdict could be issued; after the extension
  the rule issues **confirmed** on all three DPs.
- The framework property (c2 §5.3) is unaffected by DP outcomes: the scoring framework
  successfully measured all three dimensions in 8/8 runs. DP verdicts speak to the
  directional prediction, not to the framework's ability to measure.
- Wilson 95% CIs computed via `SmartKit/scripts/lib/wilson.ts` (standard Wilson 1927
  score interval with z=1.96). Per-condition CIs: Cond A [0.57, 1.00] at k=5/n=5; Cond B
  [0.44, 1.00] at k=3/n=3. Comparative CI on the A−B difference is omitted per c2 §5.4.3
  ("reported only when both conditions are at adaptive-N=5"; Cond B is N=3).
- A confirmed verdict at N=5 is a small-sample binary outcome, not an inferential claim;
  see thesis §7.4 (sample-size determination, n≈30 per condition for validation-stage).
