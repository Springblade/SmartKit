# Inter-Rater Reliability Protocol

**Document purpose:** Defines the inter-rater reliability (IRR) procedure for the pilot study, including rater B identity, training protocol, independent scoring workflow, and Cohen's κ computation.

**Version:** 1.0  
**Last updated:** 2026-09-02

---

## 1. Rater B Identity

**Primary plan:** Recruit a classmate from the same graduate program with:
- Familiarity with TypeScript and Next.js (intermediate level or higher)
- No prior exposure to the SmartKit boilerplate or this thesis
- Availability for a 60-minute training session and ~2 hours of independent scoring

**Fallback plan:** If no classmate is available by the lock date, the primary rater (Rater A) will re-rate all outputs after a 1-week washout period to minimize memory effects.

**Rater B contact:** [To be filled after recruitment]

---

## 2. Training Session Outline

**Duration:** 60 minutes  
**Mode:** In-person or video call with screen sharing  
**Materials:** `pilot-pre-registration.md` §5 (rubric), one smoke-run output from a practice trial (not part of the 10 pilot runs)

### 2.1 Session agenda

1. **Rubric walkthrough (20 min)**
   - Review the 15-cell rubric structure (§5.1–5.3 in pre-registration)
   - Explain scoring anchors for each dimension (0 = missing, 5 = exemplary)
   - Clarify edge cases: partial implementations, wrong locations, missing exports

2. **Calibration on smoke run (25 min)**
   - Rater B scores the practice output independently
   - Compare Rater B's scores with Rater A's reference scores for the same output
   - Discuss discrepancies cell by cell until agreement is reached
   - Re-score if necessary to confirm understanding

3. **Disagreement resolution rule (5 min)**
   - For the pilot study, disagreements are recorded as-is (no forced consensus)
   - Cohen's κ computed on raw scores to measure true agreement
   - If κ < 0.60 (moderate agreement threshold), flag for analysis in thesis discussion

4. **Scoring protocol reminder (5 min)**
   - Rater B must score all 10 outputs independently
   - No communication with Rater A until all scoring is complete
   - Outputs presented in randomized order (blind to condition A/B labels)

5. **Q&A (5 min)**
   - Address any remaining questions about rubric interpretation or process

---

## 3. Independent Scoring Protocol

### 3.1 Blinding procedure

- Rater B receives 10 anonymized output folders labeled `run-01` through `run-10` (randomized order)
- Each folder contains the agent's final submission: `src/features/flags/` directory structure
- No metadata about condition (A or B) or run sequence is disclosed
- Rater A's scores are not visible to Rater B during scoring

### 3.2 Scoring workflow

1. For each run, Rater B:
   - Opens the output folder in VS Code or similar editor
   - Reviews all files under `src/features/flags/`
   - Scores all 15 rubric cells in a separate spreadsheet (template provided)
   - Records notes for any ambiguous or borderline cases

2. Time limit: No strict limit, but Rater B should complete all 10 runs within 2 hours to maintain consistency

3. Submission: Rater B emails the completed scoring spreadsheet to Rater A after finishing all 10 runs

### 3.3 Score reconciliation

After Rater B submits scores:
- Rater A compares Rater B's scores with Rater A's scores (line by line)
- Compute Cohen's κ for each rubric dimension (structural, type safety, coverage)
- Record all discrepancies in `docs/irr-analysis.md` (to be created during analysis)
- No post-hoc score changes — disagreements remain as recorded

---

## 4. Cohen's Kappa Computation

### 4.1 Formula

Cohen's κ measures inter-rater agreement beyond chance:

```
κ = (p_o - p_e) / (1 - p_e)
```

Where:
- `p_o` = observed agreement proportion (number of matching scores / total scores)
- `p_e` = expected agreement by chance (sum of marginal probabilities)

### 4.2 Interpretation

| κ Range | Interpretation |
|---------|----------------|
| < 0.00  | Poor (worse than chance) |
| 0.00–0.20 | Slight |
| 0.21–0.40 | Fair |
| 0.41–0.60 | Moderate |
| 0.61–0.80 | Substantial |
| 0.81–1.00 | Almost perfect |

Target: κ ≥ 0.60 (moderate agreement or higher)

### 4.3 Worked example on toy data

**Scenario:** Three runs, one rubric cell (Structural Integrity, max 5 points)

| Run | Rater A | Rater B |
|-----|---------|---------|
| 1   | 3       | 3       |
| 2   | 4       | 5       |
| 3   | 2       | 2       |

**Step 1: Observed agreement**
- Matches: Run 1 (3=3) and Run 3 (2=2) → 2 matches out of 3
- `p_o = 2/3 = 0.667`

**Step 2: Expected agreement by chance**
- Count frequency of each score:
  - Rater A: {2: 1, 3: 1, 4: 1}
  - Rater B: {2: 1, 3: 1, 5: 1}
- Marginal probabilities:
  - P(both give 2) = (1/3) × (1/3) = 0.111
  - P(both give 3) = (1/3) × (1/3) = 0.111
  - P(both give 4) = (1/3) × 0 = 0.000
  - P(both give 5) = 0 × (1/3) = 0.000
- `p_e = 0.111 + 0.111 = 0.222`

**Step 3: Cohen's κ**
```
κ = (0.667 - 0.222) / (1 - 0.222)
  = 0.445 / 0.778
  = 0.572
```

**Interpretation:** Moderate agreement (κ = 0.572 falls in the 0.41–0.60 range)

---

## 5. Rubric Text for IRR Training

**Source document:** `pilot-pre-registration.md` §5 (after Task A7 lock)

**Training materials:**
- Rater B receives a verbatim copy of §5 (all three sub-rubrics: 5.1, 5.2, 5.3)
- No additional interpretation guidelines beyond what is written in §5
- If ambiguities arise during training, clarifications are documented in this section and shared with Rater B

**Amendments:** If the rubric text in §5 is amended after lock (via the amendment procedure in §7), Rater B will be notified and re-trained on the updated rubric before scoring resumes.

---

## 6. Post-Scoring Analysis

After both raters complete scoring:
1. Compute Cohen's κ for each of the three rubric dimensions (structural, type safety, coverage)
2. Compute overall κ across all 15 cells × 10 runs = 150 data points
3. Report κ values in thesis Chapter 3 (Results) with interpretation
4. If κ < 0.60 for any dimension, discuss potential sources of disagreement in Chapter 4 (Discussion)

**Data retention:** Raw scoring spreadsheets from both raters will be archived in `data/irr/` (not committed to git) and included as supplementary material in the thesis appendix.

---

## References

- Cohen, J. (1960). A coefficient of agreement for nominal scales. *Educational and Psychological Measurement*, 20(1), 37–46.
- Landis, J. R., & Koch, G. G. (1977). The measurement of observer agreement for categorical data. *Biometrics*, 33(1), 159–174.

