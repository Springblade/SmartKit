# Pilot runs directory

This directory holds pilot run artefacts. Each run is a self-contained
snapshot of the AI's output, scored by `SmartKit/scripts/score-flag.ts`.

## Layout

```
runs/
├── dry-run-a/                # D-14..D-12 dry run on Condition A (SmartKit)
│   ├── features/flags/       # synthetic AI output (FSD layout)
│   │   ├── lib/is-enabled.ts
│   │   ├── types/flags.ts
│   │   └── index.ts
│   ├── src/tests/features/flags/is-enabled.test.ts
│   └── score.json            # automated + manual scoring
├── dry-run-b/                # D-14..D-12 dry run on Condition B (baseline)
│   ├── lib/flag.ts           # synthetic AI output (no FSD)
│   ├── tests/flag.test.ts
│   └── score.json
├── cond-a/                   # real pilot runs 4-5 (Condition A) — empty until first run
└── cond-b/                   # real pilot runs 1-3 (Condition B) — empty until first run
```

## Dry runs (D-14..D-12, pre-pilot smoke)

The `dry-run-{a,b}/` directories contain **synthetic stubs** created
manually to exercise the scoring pipeline end-to-end. They are **not**
real AI output and are **excluded** from the N=5 pilot tally per
`docs/c2-direction.md` §14.1.

Their purpose is to verify that:

- `score-flag.ts` correctly identifies FSD vs non-FSD layout
  (dry-run-a → 3/5 structural, dry-run-b → 2/5 structural)
- `score-flag.ts` correctly detects Zod vs no-Zod
  (dry-run-a → 4/5 type, dry-run-b → 0/5 type)
- `score-flag.ts` correctly detects test-file presence and 5-min cache
  (dry-run-a → 5/5 coverage, dry-run-b → 0/5 coverage)
- Manual cells can be filled in by a human rater after the script run

## Real runs (D-11..D-0)

`cond-{a,b}/run-NN/` directories will be created at first pilot run
on D-11. Each contains the AI's output as committed by the run-day
checklist (`c2-direction.md` §14.2), plus a `score.json` produced by
`score-flag.ts`.
