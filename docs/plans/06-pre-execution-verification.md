---
phase: 6
type: edit
status: complete
target_files: [docs/pilot-pre-execution-signoff.md]
depends_on: [4, 5]
blocks: [7, 8]
---

# Phase 6 — Pre-execution verification + sign-off

## Source of truth
`docs/c2-direction.md` §15 (Pre-execution verification checklist)

## Goal
Run through the §15.1–§15.8 checklist and commit `docs/pilot-pre-execution-signoff.md`
BEFORE the first AI session runs. This is the gate for Phase 7.

## Checklist items

### §15.1 Pre-registration
- [ ] `docs/pilot-pre-registration.md` exists, committed, and matches `HEAD`
- [ ] `latex/appendix-pre-registration.tex` exists and matches the markdown
- [ ] All 11 required sections (§11.2) are present
- [ ] SHA256 of the prompt string is in the pre-registration
- [ ] Run-order schedule has a documented seed and 5 rows
- [ ] Author lock is signed and dated

### §15.2 Condition A (SmartKit)
- [ ] `pnpm install` completes cleanly in SmartKit/
- [ ] `pnpm lint` reports 0 errors
- [ ] `pnpm check-types` reports 0 errors
- [ ] `pnpm test:run` reports all green
- [ ] `AGENTS.md` at SmartKit root
- [ ] `.cursor/rules/` at SmartKit root
- [ ] `src/features/auth/` and `src/features/billing/` present
- [ ] Git commit hash of SmartKit snapshot recorded in pre-registration §8

### §15.3 Condition B (baseline)
- [ ] `pnpm tsx scripts/setup-condition-b.ts --out ../smartkit-baseline` exits 0
- [ ] All 6 self-check rows print true
- [ ] No `AGENTS.md` at baseline root
- [ ] No `.cursor/rules/` at baseline root
- [ ] No `src/features/` directory
- [ ] `tsconfig.json` has `"strict": true`
- [ ] `.env.example` has SePay/Resend/Better~Auth placeholders
- [ ] `pnpm install` in baseline completes
- [ ] `pnpm check-types` and `pnpm lint` in baseline report 0 errors

### §15.4 Scoring tooling
- [ ] `pnpm tsx scripts/score-flag.ts --help` documents the CLI flags
- [ ] Script runs without error on a synthetic smoke run
- [ ] Output JSON has the §13.3 schema
- [ ] Manual cells are null after script run

### §15.5 AI tool snapshot
- [ ] Cursor AI version recorded
- [ ] Model name recorded
- [ ] Temperature setting recorded
- [ ] MCP servers list recorded
- [ ] Date of first planned run recorded

### §15.6 First-run dry run
- [ ] D-14..D-12 dry run on each condition completed
- [ ] Dry run scored end-to-end with `score-flag.ts`
- [ ] Manual cells filled in for dry run

### §15.7 Reviewer-rehearsal
Ask one peer (classmate or supervisor):
- [ ] "What would convince you the rubric was not retrofitted to data?" → answer from pre-registration
- [ ] "How would you reproduce Run 4 of Condition A?" → pre-registration commit + schedule
- [ ] "What if the result is null on all three DPs?" → thesis reports null

### §15.8 Sign-off
Sign and commit `docs/pilot-pre-execution-signoff.md`:
> "I have verified the pre-registration, the two conditions, the scoring script, and the AI tool snapshot. The first AI session will run on `<date>` at `<time>`."

## Acceptance criteria
- [ ] `docs/pilot-pre-execution-signoff.md` exists with signed statement
- [ ] Git commit hash of sign-off document recorded
- [ ] Pilot cannot start until this document is committed

## File scope
- `docs/pilot-pre-execution-signoff.md` (new file)

## Estimated effort
~2–4 hours (verify all checklist items + peer review + sign-off commit)
