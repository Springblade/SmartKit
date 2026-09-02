# Pilot Pre-Execution Sign-Off

**Date:** 2026-09-02  
**Verifier:** [Your Name]  
**Status:** BLOCKED

---

## Verification Status

### §15.1 Pre-registration

**Status:** ⚠️ BLOCKED

- [x] `docs/pilot-pre-registration.md` exists, committed, and matches `HEAD` (commit: `fb04156`)
- [ ] ⚠️ **BLOCKER:** `latex/appendix-pre-registration.tex` does NOT exist
- [ ] All 11 required sections (§11.2) present — pending LaTeX file creation
- [x] SHA256 of prompt string is in pre-registration: `18b84fd4dfff09d600548833c11eaedad469e5a689b50ba1c13dc9e85375e8f2`
- [x] Run-order schedule has documented seed (1234567890) and 5 rows
- [x] Author lock is signed and dated (2026-09-02T05:23:00Z)

### §15.2 Condition A (SmartKit)

**Status:** ⚠️ NOT YET VERIFIED — will verify after §15.1 blocker is resolved

- [ ] `pnpm install` completes cleanly in SmartKit/
- [ ] `pnpm lint` reports 0 errors
- [ ] `pnpm check-types` reports 0 errors
- [ ] `pnpm test:run` reports all green
- [ ] `AGENTS.md` at SmartKit root
- [ ] `.cursor/rules/` at SmartKit root
- [ ] `src/features/auth/` and `src/features/billing/` present
- [ ] Git commit hash of SmartKit snapshot recorded in pre-registration §8

### §15.3 Condition B (baseline)

**Status:** ⚠️ NOT YET VERIFIED

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

**Status:** ⚠️ NOT YET VERIFIED

- [ ] `pnpm tsx scripts/score-flag.ts --help` documents the CLI flags
- [ ] Script runs without error on a synthetic smoke run
- [ ] Output JSON has the §13.3 schema
- [ ] Manual cells are null after script run

### §15.5 AI tool snapshot

**Status:** ⚠️ NOT YET VERIFIED

- [ ] Cursor AI version recorded
- [ ] Model name recorded
- [ ] Temperature setting recorded
- [ ] MCP servers list recorded
- [ ] Date of first planned run recorded

### §15.6 First-run dry run

**Status:** ⚠️ NOT YET STARTED

- [ ] D-14..D-12 dry run on each condition completed
- [ ] Dry run scored end-to-end with `score-flag.ts`
- [ ] Manual cells filled in for dry run

### §15.7 Reviewer-rehearsal

**Status:** ⚠️ NOT YET STARTED

- [ ] "What would convince you the rubric was not retrofitted to data?"
- [ ] "How would you reproduce Run 4 of Condition A?"
- [ ] "What if the result is null on all three DPs?"

### §15.8 Sign-off

**Status:** ⚠️ BLOCKED — cannot sign until all preceding items are verified

---

## Critical Blocker

**§15.1 requires `latex/appendix-pre-registration.tex` to exist and match the markdown version.**

This file must be created before proceeding with the rest of the verification checklist.

Next step: Create `latex/appendix-pre-registration.tex` from `docs/pilot-pre-registration.md`.

---

## Sign-Off Statement (PENDING)

> "I have verified the pre-registration, the two conditions, the scoring script, and the AI tool snapshot. The first AI session will run on `<date>` at `<time>`."
>
> — [Verifier Name]  
> Date: ___________  
> Commit: ___________
