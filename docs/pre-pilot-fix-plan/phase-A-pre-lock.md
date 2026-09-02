---
phase: A
type: edit
status: pending
target_files:
  - docs/c2-direction.md
  - docs/pilot-pre-registration.md
  - SmartKit/scripts/score-flag.ts
  - SmartKit/scripts/seed-shuffle.ts
  - SmartKit/AGENTS.md
  - docs/inter-rater.md
depends_on: []
blocks: [B, C, D]
slice_count: 8
slices_done: []
---

# Phase A — PRE-LOCK (before first AI session, ~6 h)

> **Source of truth:** `docs/c2-direction.md`, `docs/pilot-pre-registration.md`, `SmartKit/scripts/score-flag.ts`, `SmartKit/AGENTS.md`.
> **Gate:** No AI pilot session may run until all 8 tasks in this phase are done and A7's `pre-reg-lock-<date>` tag is on the commit.
> **Sequential order** is mandatory: A0 → A1 → A2 → A3 → A4 → A5 → A6 → A7 (A1 is independent of A0 but both are preconditions for A2's schedule text).

## Decisions to lock in this phase (prefilled with defaults, override in PR review)

| # | Decision | Default if no user input |
|---|---|---|
| A0-test-path | Test path under pilot feature | ✅ LOCKED: Centralized `src/tests/features/{name}/` (amended pre-reg §2, c2-direction §5.1, rubric L5) |
| A1-server-naming | Thesis §6 .server/.client mention | ✅ LOCKED: Reworded as "Next.js defaults (not SmartKit-specific)" in main.tex lines 147, 740, 968, 977 |
| A2-run-schedule | Run order sequence and seed | ✅ LOCKED: Seed 1234567890, sequence [B,B,B,A,A] in c2-direction.md §4 |
| A3-adaptive-rule | N=3 verdict rule | ✅ LOCKED: Range-based rule in c2-direction.md + pilot-pre-registration.md §3.4 (identical blocks) |
| A4-rubric-L3 | L3 "OR" → "AND export" | ✅ LOCKED: L3 now requires export check (pre-reg §5.1 table + score-flag.ts line 211) |
| A6-second-rater | Identity of second IRR rater | Classmate (if none, fall back to self-rerate after 1 week) |
| A6-rubric-source | Rubric text used for IRR training | Verbatim copy of pre-reg §5 after A7 lock |

---

## Task A0: Resolve AGENTS.md test-path conflict

**Description.** `SmartKit/AGENTS.md:51` mandates centralized `src/tests/features/{name}/`, but `docs/pilot-pre-registration.md` §2 promises colocated `features/{name}/lib/is-enabled.test.ts`. Pilot prompt must not contradict the live rules. Pick one of:
- (a) Amend pre-registration §2 to centralized path.
- (b) Amend `AGENTS.md` to allow colocation as an explicit exception.
- (c) Pilot uses a new explicit-exception path.

**Acceptance criteria:**
- [ ] A0 decision documented in this file's "Decisions" table (override default if needed)
- [ ] Exactly one of {pre-registration §2, `AGENTS.md`, new-exception note} is edited
- [ ] If pre-registration is edited, the new test path appears in §4 prompt template
- [ ] If `AGENTS.md` is edited, the change is additive (no other rule weakened)

**Verification:**
- [ ] `grep -nE "tests/features/|lib/.*\.test\.ts" SmartKit/AGENTS.md docs/pilot-pre-registration.md` shows consistent path
- [ ] No contradiction between the two files on test placement

**Dependencies:** None
**Files likely touched:** `docs/pilot-pre-registration.md` and/or `SmartKit/AGENTS.md` (one only)
**Estimated scope:** S

---

## Task A1: Resolve AGENTS.md .server/.client naming conflict

**Description.** `SmartKit/AGENTS.md:30-31` forbids `.server.ts` / `.client.tsx` filename suffixes, but `latex/main.tex:968` still references ".server/.client naming conventions". Align thesis to AGENTS.md.

**Acceptance criteria:**
- [x] main.tex §6 (line ~968) no longer states `.server.ts`/`.client.tsx` as a real SmartKit convention
- [x] If reworded, replacement text refers to RSC `server-only` / `'use client'` directives, not by filename suffix
- [x] Default: reword to "Next.js defaults (not SmartKit-specific)" — does not delete the explanatory context

**Verification:**
- [x] `grep -nE "\\.server\\.ts|\\.client\\.tsx" latex/main.tex` returns 0 hits (in body) OR returns hits that are inside a clearly marked "Next.js defaults, not SmartKit-specific" note
- [x] `cd latex && latexmk -pdf main.tex` exits 0

**Dependencies:** None
**Files likely touched:** `latex/main.tex`
**Estimated scope:** XS

---

## Task A2: PRNG-seeded run order (finding C1)

**Description.** `c2-direction.md:160` says "seeded CRD" but §3.3 hard-codes ABAB. Generate a seeded permutation for N=5 runs (or N=3 if adaptive stop), paste the schedule + seed into both c2-direction.md §3.3 and pilot-pre-registration.md §3.3, and add a small `SmartKit/scripts/seed-shuffle.ts` so the schedule is reproducible.

**Acceptance criteria:**
- [ ] `c2-direction.md` §3.3 lists 5 (or 3) rows in a table with `Run | Condition | Timestamp | Seed`
- [ ] `pilot-pre-registration.md` §3.3 contains the same seed literal and same sequence
- [ ] Seed is a 32-bit integer; sequence is reproducible by `pnpm tsx scripts/seed-shuffle.ts --seed N --n 5`
- [ ] `SmartKit/scripts/seed-shuffle.ts` exists, parses args with `parseArgs`, and writes a 5-row markdown table to stdout

**Verification:**
- [ ] Re-run seed script with the same seed → identical 5-row output
- [ ] `grep -nE "ABAB" docs/c2-direction.md docs/pilot-pre-registration.md` returns 0
- [ ] `cd SmartKit && npx tsc --noEmit scripts/seed-shuffle.ts` exits 0

**Dependencies:** A0 (test path must be locked first because the prompt template cites it; the run order schedule doesn't reference the test path directly but A2 must wait for the prompt to be stable)
**Files likely touched:** `docs/c2-direction.md`, `docs/pilot-pre-registration.md`, `SmartKit/scripts/seed-shuffle.ts` (new, ~30 lines)
**Estimated scope:** S

---

## Task A3: Adaptive N=3 verdict rule (finding C2)

**Description.** `c2-direction.md:155-157` describes adaptive N=3 but no decision rule exists for what to do at the N=3 interim look. Add a pre-registered verdict: "if range ≤ 1 on all 3 dimensions → STOP, claim one of confirmed/refuted/inconclusive on the 3/3 (or 0/3, or 1–2/3) split; if range > 2 on any dimension → run 2 more for N=5 and apply the §5.4.1 binary rule from c2-direction". Mirror to pre-registration §3.3 as a new subsection §3.4.

**Acceptance criteria:**
- [ ] Verdict rule appears verbatim in both files under a heading "Adaptive N=3 verdict rule"
- [ ] Rule is in a fenced code block titled "N=3 verdict rule"
- [ ] `confirmed/refuted/inconclusive` is defined with the k/n split (k=3, 2, 1 respectively for N=3; k=5, 0, 1–4 for N=5)

**Verification:**
- [ ] `diff <(grep -A 8 "N=3 verdict rule" docs/c2-direction.md) <(grep -A 8 "N=3 verdict rule" docs/pilot-pre-registration.md)` shows identical 8 lines

**Dependencies:** None
**Files likely touched:** `docs/c2-direction.md`, `docs/pilot-pre-registration.md`
**Estimated scope:** XS

---

## Task A4: Tighten rubric L3 "OR" (finding 1.2)

**Description.** `pilot-pre-registration.md:205` L3 cell is `features/{name}/lib/` which lets `features/auth/lib/is-enabled.ts` score 3/5 by file presence alone, even if `isEnabled` is exported as a non-default object. Tighten to "L3 = file present at exact path AND exports a named `isEnabled` function (default export also acceptable)".

**Acceptance criteria:**
- [ ] L3 cell text in pre-registration §5.1 ≥ 80 chars (forces specificity)
- [ ] `score-flag.ts` L3 grader checks `file_exists && (has_default_export || has_named_export_isEnabled)`
- [ ] `pnpm tsx scripts/score-flag.ts --dry-run --feature auth` shows L3 fails on a stub without `isEnabled` export

**Verification:**
- [ ] `grep -nE "^\\| L3 \\|" docs/pilot-pre-registration.md` shows the new clause
- [ ] Test stub `SmartKit/src/tests/fixtures/l3-stub.ts` scores 0/5 on L3 after script update
- [ ] `cd SmartKit && pnpm check-types` exits 0

**Dependencies:** None
**Files likely touched:** `docs/pilot-pre-registration.md`, `SmartKit/scripts/score-flag.ts`, `SmartKit/src/tests/fixtures/l3-stub.ts` (new, ~10 lines)
**Estimated scope:** S

---

## Task A5: Split path-glob bias (finding 4.1)

**Description.** `c2-direction.md:839-845` says the path regex conflates "not found" with "found but wrong location". `score-flag.ts` rubric row 4 should emit two sub-cells: `4a.path_match ∈ {0, 0.5, 1}` and `4b.feature_complete ∈ {0, 0.5, 1}`. Update the JSON schema in `pilot-pre-registration.md` §13.3 to match.

**Acceptance criteria:**
- [ ] `score-flag.ts` output JSON has keys `path_match` and `feature_complete`, not a single `path` key
- [ ] Pre-registration §13.3 schema block shows the two keys with rubrics
- [ ] `pnpm tsx scripts/score-flag.ts --feature billing --dry-run` prints the new keys
- [ ] Comment in `score-flag.ts` cites c2-direction §13.5 verbatim

**Verification:**
- [ ] `grep -n "\"path\"" SmartKit/scripts/score-flag.ts` returns 0 (or only inside comments)
- [ ] JSON schema in pre-reg matches `tsc --noEmit SmartKit/scripts/score-flag.ts` (no type drift)

**Dependencies:** A4 (rubric L3 tightening shares the same script)
**Files likely touched:** `SmartKit/scripts/score-flag.ts`, `docs/pilot-pre-registration.md`
**Estimated scope:** S

---

## Task A6: IRR plan with second rater (finding 3.1)

**Description.** `pilot-pre-registration.md` describes Cohen's κ but no second rater. Recruit a classmate, draft `docs/inter-rater.md` with: rater B identity, training session outline, scoring protocol (independent, blind to A's scores), and κ computation formula with a worked example on 3 toy scores.

**Acceptance criteria:**
- [ ] `docs/inter-rater.md` exists, ≥ 50 lines
- [ ] Pilot-pre-registration §3.5 references the new file with relative path
- [ ] κ computation: `κ = (p_o - p_e) / (1 - p_e)` documented with example on 3 toy scores
- [ ] Training session outline ≥ 5 bullets (rubric walkthrough, calibration on a smoke run, disagreement resolution rule)

**Verification:**
- [ ] `wc -l docs/inter-rater.md` ≥ 50
- [ ] `grep -n "Cohen" docs/inter-rater.md` shows formula
- [ ] `grep -n "p_o" docs/inter-rater.md` shows `p_o` and `p_e` symbols

**Dependencies:** None (parallelizable with A2–A5 in principle, but kept sequential for clarity)
**Files likely touched:** `docs/inter-rater.md` (new), `docs/pilot-pre-registration.md`
**Estimated scope:** M

---

## Task A7: Lock pre-registration (finding 5)

**Description.** Fill the `LOCK_DATE_UTC` placeholder at `pilot-pre-registration.md:4` with today's date. Add a final-line SHA-256 of the exact prompt template string from §4 in §11 footer. Tag the commit `pre-reg-lock-<YYYYMMDD>` and record the tag in c2-direction §15 (Pre-execution verification).

**Acceptance criteria:**
- [x] Line 4 of pre-registration shows `LOCK_DATE_UTC: <today ISO date>`
- [x] SHA-256 of the exact prompt string from §4 appears in §11 footer
- [x] Git tag exists locally: `git tag -l "pre-reg-lock-*"` shows one entry
- [x] c2-direction §15 has a "Pre-registration lock tag" line with the tag name

**Verification:**
- [x] `git rev-parse pre-reg-lock-<date>` returns a commit hash (0ac4b35)
- [x] `shasum -a 256 docs/pilot-pre-registration.md` recorded in §11
- [x] `git diff pre-reg-lock-$(date +%Y%m%d)..HEAD -- docs/pilot-pre-registration.md` is empty after lock (any future edit must amend the tag)

**Dependencies:** A0, A2, A3, A4, A5, A6 (everything that touched the pre-reg)
**Files likely touched:** `docs/pilot-pre-registration.md`, `docs/c2-direction.md`
**Estimated scope:** XS

---

## Checkpoint A: Pre-Lock Complete

- [x] All 8 tasks A0–A7 marked done in `tasks.md`
- [x] `pre-reg-lock-<date>` tag exists locally (pre-reg-lock-20260902)
- [x] AGENTS.md vs pre-registration is consistent on test path and naming
- [x] `score-flag.ts` JSON schema matches pre-registration §13.3
- [x] Smoke tests pass: `pnpm tsx scripts/score-flag.ts --help` exits 0; `cd SmartKit && pnpm check-types` exits 0; `shasum -a 256 docs/pilot-pre-registration.md` matches §11 footer
- [ ] No AI session has been run yet (gate still ahead)

When all boxes are checked, the pilot can start. Move to Phase B for thesis-level fixes.
