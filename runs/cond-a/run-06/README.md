# Run 6 (Condition A) — pending execution

**Status:** PENDING — to be executed per `docs/pilot-pre-registration.md`
§11 amendment 2026-09-06 (extend Cond A from n=2 to n=5 per adaptive
PROCEED rule and §A.5.4.1 verdict rule).

## Procedure (to follow in order)

1. **Fresh Cursor AI session.** Open Cursor AI in
   `c:\Users\wayad\Documents\Thesis\SmartKit` with no prior context
   (clear chat history, no open files from previous runs). Use the
   same model snapshot as Runs 1-5: `cursor-ai/auto/2026-09-05`.
2. **Paste Prompt B verbatim** from
   `docs/pilot-pre-registration.md` §4. Do not rephrase, add
   follow-up clarifications, or omit bullets. Any deviation is an
   exclusion event (E4, §6).
3. **Wait for the AI to finish** generating code. Note the wall-clock
   start time and the time-to-correct (TTC) in minutes.
4. **Snapshot the artifacts** into this directory:
   ```bash
   cd c:\Users\wayad\Documents\Thesis
   cp -r SmartKit/features/flags runs/cond-a/run-06/features/flags
   cp -r SmartKit/src/tests/features/flags runs/cond-a/run-06/src/tests/features/flags
   ```
   Also copy any other files the AI created outside `features/flags/`
   or `src/tests/features/flags/` (e.g., if the AI created a top-level
   `lib/` helper).
5. **Run the scoring script** (after any human edits the AI session
   required):
   ```bash
   cd c:\Users\wayad\Documents\Thesis\SmartKit
   pnpm tsx scripts/score-flag.ts --run-dir ../runs/cond-a/run-06 --out ../runs/cond-a/run-06/score.json
   ```
   This populates the `automated` and `automated_scores` sections
   of `score.json`.
6. **Primary-rater manual scoring.** Open `score.json` and fill in the
   `manual` section with primary-rater scores (0-5 per dimension)
   plus a `naming_quality` 0-5 score and free-text `notes`. Also
   record `time_to_correct_minutes`, `edit_list`, and
   `did_not_converge` in the file.
7. **Commit** with a message of the form
   `pilot: run-06 (cond-a) completed, score=Str/Type/Cov`.
8. **After all 3 runs done**, re-aggregate:
   ```bash
   pnpm tsx scripts/aggregate-dp.ts --runs-dir ../runs --out ../runs/dp-summary.json
   ```
   Update `runs/dp-verdict.md` and §6.7 in the thesis body with the
   new n=5 numbers.

## Seed (per §3.3)

This run uses seed `1234567899` (the next unused seed after the
locked schedule's `1234567890`-`1234567894`). The seed is recorded
for **reproducibility** (proof that no human reordering was applied
after lock); it does not control the AI's nondeterministic output.
