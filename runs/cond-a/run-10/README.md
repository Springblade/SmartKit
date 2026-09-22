# Run 8 (Condition A) — pending execution

**Status:** PENDING — to be executed per `docs/pilot-pre-registration.md`
§11 amendment 2026-09-06 (extend Cond A from n=2 to n=5 per adaptive
PROCEED rule and §A.5.4.1 verdict rule).

## Procedure

See `runs/cond-a/run-06/README.md` for the full procedure. Use
**seed `1234567901`** for this run.

## Step-by-step

1. Fresh Cursor AI session, model snapshot `cursor-ai/auto/2026-09-05`.
2. Paste Prompt B verbatim from `docs/pilot-pre-registration.md` §4.
3. Wait for the AI to finish; record wall-clock start and TTC.
4. Snapshot `features/flags/`, `src/tests/features/flags/`, and any
   other AI-created files into `runs/cond-a/run-08/`.
5. Run `pnpm tsx scripts/score-flag.ts --run-dir ../runs/cond-a/run-08 --out ../runs/cond-a/run-08/score.json`.
6. Fill in primary-rater `manual` section + `naming_quality` +
   `notes` + `time_to_correct_minutes` + `edit_list` +
   `did_not_converge`.
7. Commit: `pilot: run-08 (cond-a) completed, score=Str/Type/Cov`.
8. After this run, re-run `pnpm tsx scripts/aggregate-dp.ts --runs-dir ../runs --out ../runs/dp-summary.json` to regenerate the verdict summary.
