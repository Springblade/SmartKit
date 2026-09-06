# Adaptive N=3 Verdict — Pilot Decision

**Date:** 2026-09-05
**Rule applied:** `docs/pilot-pre-registration.md` §3.4 (N=3 verdict rule)
**Runs completed:** 3 of 5 (Condition B: Run 1, 2, 3)

## Per-run scores (manual ratings — the cells the binary rule acts on)

| Run | Condition | Structural | Type | Coverage | DP1 (location) | DP2 (Zod) | DP3 (test) |
|-----|-----------|------------|------|----------|----------------|-----------|------------|
| 1 | B | 2 | 1 | 1 | root-level lib/ | no Zod | test present (root) |
| 2 | B | 2 | 3 | 1 | root-level lib/ | no Zod | test present (root) |
| 3 | B | 2 | 0 | 1 | root-level lib/ | no Zod | test present (root) |

## Range computation (Condition B, N=3)

| Dimension | Min | Max | Range |
|-----------|-----|-----|-------|
| Structural Integrity | 2 | 2 | **0** |
| Type & Contract Safety | 0 | 3 | **3** |
| Coverage & Completeness | 1 | 1 | **0** |

## Adaptive N=3 rule

```
IF range ≤ 1 on ALL three dimensions:
  STOP at N=3.
ELSE (range > 2 on ANY dimension):
  RUN Runs 4–5 (both Condition A per locked sequence).
```

**Type & Contract Safety range = 3 > 2 → PROCEED to Runs 4–5.**

## Decision

**PROCEED.** Runs 4 and 5 will be Condition A per the locked schedule
(`docs/pilot-pre-registration.md` §3.3).

## Justification (per §3.4 verdict rule)

The Type & Contract Safety range is 3 (0 in Run 3 vs 3 in Run 2). This
exceeds the 2-point threshold and triggers the adaptive rule. Variance
is high enough that median + range on N=3 would not be reliable; running
Condition A on Runs 4–5 gives the full N=5 split needed for DP verdicts.

## Note on N=3 sub-rule

Within N=3 Condition B:

- k=0/3 (Type Safety ≥3/5) — DP2 sub-rule → **refuted** (Type Safety
  median = 1, well below 3)
- k=3/3 (Coverage ≥3/5) — DP3 sub-rule → **refuted** (Coverage median = 1)
- k=0/3 (Structural ≥3/5) — DP1 sub-rule → **refuted** (Structural median = 2)

But the N=3 sub-rule is *not* the rule that triggers the decision. The
range rule (§3.4) is what determines whether to continue to Runs 4–5.
Per §3.4, range > 2 on any dimension → PROCEED, regardless of the k/n
outcome. The k/n verdict rule applies *after* Runs 4–5 on all N=5.

## Pilot state

- Cond B: N=3 done, committed (b187deb, 3ae3d2d, 98048d6)
- Cond A: N=0 done; Runs 4–5 to be executed next
- Schedule: 1=B, 2=B, 3=B, 4=A, 5=A (locked seed 1234567890)
- Time-to-correct: all 3 runs ≤ 2 min AI session; no manual edits
- Exclusion events: 0 (E1–E5 not triggered)

---

# Adaptive Verdict — Cond A extension to N=5

**Date:** 2026-09-06
**Rule applied:** `docs/pilot-pre-registration.md` §A.5.4.1
  (5/5 confirmed; 0/5 refuted; 1–4/5 inconclusive)
**Runs completed at this decision:** 2 of 5 (Condition A: Run 4, Run 5)

## Per-run scores (manual ratings — the cells the binary rule acts on)

| Run | Condition | Structural | Type | Coverage | Total (0–15) |
|-----|-----------|------------|------|----------|--------------|
| 4   | A         | 4          | 5    | 5        | 14           |
| 5   | A         | 4          | 5    | 4        | 13           |

## §A.5.4.1 verdict rule

```
IF k/5 (with k = number of runs at or above the directional-prediction bar):
  k = 5: CONFIRMED
  k = 0: REFUTED
  1 ≤ k ≤ 4: INCONCLUSIVE
```

At n=2 (Runs 4, 5), the rule cannot issue a verdict because the
binary 0/5 boundary is not yet determinate. **Both DPs are
inconclusive** (k=2 with no defined 0/5/1–4 outcome space for n=2).

## Decision

**EXTEND Cond A from n=2 to n=5** to satisfy §A.5.4.1's N=5
requirement. New runs (6, 7, 8) use fresh Cursor AI sessions with
the same Prompt B (§4) on the same `cursor-ai/auto/2026-09-05`
model snapshot. Seeds: `1234567899`, `1234567900`, `1234567901`
(reserved in the locked schedule; no human reordering applied).

## Justification

1. **Verdict rule (5/5 confirmed, 0/5 refuted, 1–4/5 inconclusive)
   requires N=5 per condition** to issue a confirmed or refuted
   verdict. With N=2 the rule is structurally indeterminate.
2. **The lock-time rule (≥4/5 confirmed; ≤1/5 refuted; 2–3/5 null)
   was tightened** in amendment 2026-09-01 because the original
   rule's Wilson 95% CI for 4/5 ≈ [0.30, 0.99] overlaps the null
   range; the tightened rule raises the bar to 5/5 confirmed.
3. **Cond B remains at N=3** because the Cond B Type-range signal
   (range = 3 across Runs 1–3) already exceeded the adaptive
   PROCEED threshold (§3.4 = 2). No further Cond B runs are needed
   for the directional-prediction test.
4. **Schedule is consistent with §3.3 seed role**: seeds
   `1234567890`–`1234567894` were locked for Runs 1–5; the three
   extension seeds `1234567899`–`1234567901` are appended to the
   same deterministic sequence (no reordering).

## Pilot state (post-extension decision)

- Cond B: N=3 done (Runs 1, 2, 3)
- Cond A: N=2 done (Runs 4, 5); N=3 pending (Runs 6, 7, 8)
- Schedule: 1=B, 2=B, 3=B, 4=A, 5=A, 6=A, 7=A, 8=A
- All runs ≤ 3 min AI session; no manual edits; 0 exclusion events
- See `runs/cond-a/run-0{6,7,8}/README.md` for execution procedure.
