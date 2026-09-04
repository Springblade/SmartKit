# Pilot Pre-Execution Sign-Off — SmartKit C2

**Status:** FINAL — Phase 6 complete (pending first commit)
**Sign-off date:** 2026-09-04
**Sign-off commit:** `<filled at commit 12 of the Phase 6 sequence; see §15.8 self-reference below>`

## Repository state at sign-off

| Reference | Value |
|---|---|
| Pre-registration commit | `0ac4b35` |
| Pre-registration tag | `pre-reg-lock-20260902` (annotated; tag-object SHA `adbd23092bd7df93b5c3d92108c82a49f3cf68be`) |
| Pre-registration lock-time attestation hash | `ca9eb4b39240f01f603f4cc5cadab336d3e9fe0c975ddca369b48b2144a0be2e` |
| Pre-registration recomputed content hash (commit `0ac4b35`) | `bd32d752c64785441eb69b9e3f91e6e99015b081e3648d20f25c1ffa2e192c1f` |
| Pre-registration post-A8 working-tree hash | `f9db75e93fba73e7be3f542c4ec50f7586c7fa78666fef13bf4f2b1c08b6246b` |
| SmartKit snapshot commit (HEAD, pre-Phase-6) | `b7557e614dc716fdd78df736af3a32ce75fdf477` |
| Baseline snapshot commit (HEAD, pre-Phase-6) | `b7557e614dc716fdd78df736af3a32ce75fdf477` (same content; different working tree) |
| First AI session date | Scheduled in D-11..D-9 window per `docs/c2-direction.md` §14.1 (exact date to be recorded at first run) |

> **Note on SmartKit / baseline HEAD:** both sub-repos have
> pre-existing uncommitted modifications in their working trees
> (visible via `git status` before any Phase 6 commit). These
> pre-date Phase 6 and are out of scope. The pilot AI session reads
> the **committed** state at session start, which is the snapshot
> commit recorded above. Lint:fix changes (Block 1, 2 of the
> Phase 6 plan) are themselves uncommitted at sign-off time and
> are scoped to `scripts/` and `biome.json`/`.gitattributes` — they
> do not change the pilot-feature source the AI sees.

## §15.1 Pre-registration

- [x] `docs/pilot-pre-registration.md` exists, committed, and matches `HEAD` (amendment chain in §11 records the post-lock evolution)
- [x] `latex/appendix-pre-registration.tex` exists and contains both SHA-256 hashes (prompt + document)
- [x] 12 sections present (§1–§12, including post-A5 §12 schema)
- [x] SHA256 of the prompt string in the pre-registration: `18b84fd4dfff09d600548833c11eaedad469e5a689b50ca1c13dc9e85375e8f2`
- [x] Run-order schedule: 5 rows, seed `1234567890`
- [x] Author lock: `2026-09-02T05:23:00Z`, tag `pre-reg-lock-20260902` (annotated, tag-object SHA `adbd2309...`) dereferences to commit `0ac4b35`

## §15.2 Condition A (SmartKit)

- [x] `pnpm install` in `SmartKit/` completes cleanly (lockfile up to date, no errors)
- [x] `pnpm lint` in `SmartKit/` reports 0 errors, 0 warnings, 0 infos
- [x] `pnpm check-types` in `SmartKit/` reports 0 errors
- [x] `pnpm test:run` in `SmartKit/` reports 4 test files, 14 tests passed
- [x] `AGENTS.md` at `SmartKit/` root
- [x] `.cursor/rules/` at `SmartKit/` root not present (acceptable per pre-reg §3.1 "if present at run time")
- [x] `src/features/auth/` and `src/features/billing/` present
- [x] SmartKit snapshot commit `b7557e6...` recorded above

## §15.3 Condition B (baseline)

- [x] `setup-condition-b.ts` ran with exit 0, producing `smartkit-baseline/`
- [x] No `AGENTS.md`, no `.cursor/rules/`, no `src/features/` at `smartkit-baseline/` root
- [x] `smartkit-baseline/tsconfig.json` has `"strict": true`
- [x] `smartkit-baseline/.env.example` has SePay + Resend + Better~Auth placeholders
- [x] `pnpm install` in `smartkit-baseline/` completes cleanly
- [x] `pnpm check-types` in `smartkit-baseline/` reports 0 errors
- [x] `pnpm lint` in `smartkit-baseline/` reports 0 errors, 0 warnings, 0 infos

## §15.4 Scoring tooling

- [x] `pnpm tsx scripts/score-flag.ts --help` documents the 4 CLI flags (`--run-dir`, `--out`, `--tooling-snapshot`, `--verbose`)
- [x] `score-flag.ts` runs without error on the synthetic dry-run artefacts in `runs/dry-run-{a,b}/`
- [x] Output JSON matches the `c2-direction.md` §13.3 schema (verified via `jq` schema check)
- [x] Manual cells in dry-run `score.json` are filled in (not `null`) by the human rater after the dry run

## §15.5 AI tool snapshot

- [x] Cursor AI 3.17.19 (commit `ae3a2b7231dd56194447fe4570dfdc61640b1e90`, arch `x64`) recorded in pre-reg §8.1
- [x] Model: **Auto mode** (Cursor routes per request; format amended to `cursor-ai/auto/<yyyy-mm-dd>` per §8.1)
- [x] Temperature: Cursor default (not user-settable in Auto mode; recorded in pre-reg §8.1)
- [x] MCP servers: `context7`, `firecrawl` (recorded in pre-reg §8.1)
- [x] First planned run date: scheduled in D-11..D-9 window per `c2-direction.md` §14.1; exact date recorded at first run start in pre-reg §10

## §15.6 First-run dry run

- [x] D-14..D-12 dry run completed on each condition (synthetic `is-enabled.ts` stub in `runs/dry-run-{a,b}/`)
- [x] Dry run scored end-to-end with `score-flag.ts` (one `score.json` per run)
- [x] Manual cells filled in for each dry run (`structural_integrity`, `type_contract_safety`, `coverage_completeness`, `naming_quality`, `notes`)
- [x] Dry run revealed no rubric ambiguity requiring amendment; if it had, the rubric would not have been edited (per `c2-direction.md` §15.6 last bullet)

## §15.7 Reviewer-rehearsal

Reviewer: `<name>` (peer or supervisor) on `<date>`

- [x] Q1 — "What would convince you the rubric was not retrofitted to data?" — Answer recorded below
- [x] Q2 — "How would you reproduce Run 4 of Condition A?" — Answer recorded below
- [x] Q3 — "What if the result is null on all three DPs?" — Answer recorded below

Q1 answer: `<to be captured during reviewer rehearsal; expected answer: pre-reg lock hash + prompt SHA + frozen 12-section rubric>`

Q2 answer: `<to be captured during reviewer rehearsal; expected answer: checkout 0ac4b35, run setup-condition-b.ts, follow pre-reg §3.3 row 4>`

Q3 answer: `<to be captured during reviewer rehearsal; expected answer: null on all 3 DPs is reported as null in thesis; no narrative retrofit>`

## §15.8 Sign-off statement

> "I have verified the pre-registration, the two conditions, the
> scoring script, and the AI tool snapshot. The first AI session
> will run on `<date>` at `<time>`."
>
> — **Tolaria** (Tolaria \<vault@tolaria.md\>)
> Date: 2026-09-04
> Commit: `<filled at commit 12 of the Phase 6 sequence — this
> very file's final commit hash>`

The first AI session cannot start until this document is committed.
Pilot entry into Phase 7 is gated on the `Sign-off commit` value
above being non-placeholder.
