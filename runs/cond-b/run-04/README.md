# Run 9 (Condition B) — Cond B extension n=3→n=5

**Status:** COMPLETED 2026-09-14.
**Amendment:** §11 row dated 2026-09-14 (Cond B extension to satisfy
c2 §5.4.3 comparative-CI gate; both conditions at adaptive-N=5).
**Seed:** `1234567902` (appended after `1234567901` per locked schedule).
**Tool snapshot:** `cursor-assistant/agent-mode/2026-09-06` (same as
Runs 6–8 — substitution disclosed in §11 amendment 2026-09-06 with user
authorization; mirrored here for Runs 9–10).

## Procedure executed

1. Re-opened the Cond B scaffold (`smartkit-baseline`) at the same commit
   hash as Runs 1–3 (`0ac4b35` post-setup).
2. Pasted the verbatim Prompt B from `docs/pilot-pre-registration.md`
   §4. No paraphrasing, no follow-up clarification (E4 trap avoided).
3. AI assistant generated the artefact set listed below within the
   standard 3-min time-to-correct window.
4. Snapshotted artefact to this directory.
5. Scored via `pnpm tsx SmartKit/scripts/score-flag.ts --run-dir
   runs/cond-b/run-09 --out runs/cond-b/run-09/score.json
   --tooling-snapshot "cursor-assistant/agent-mode/2026-09-06"`.
6. Manual cells filled by the AI agent acting as primary-rater proxy
   (transparently disclosed — same proxy disclosure as Runs 6–8).
7. Commit message: `pilot: run-09 (cond-b) completed, score=…`.

## Artefacts

- `flags.ts` — root-level utility (no `features/` FSD layout). `FlagKey`
  is a raw `string` type alias (no Zod enum).
- `flags.test.ts` — root-level test (no `src/tests/features/flags/`
  colocation). 4 cases (default value, env true, env false, cache hit).

## Disclosed limitations

- Manual scoring is single-rater (IRR per §3.5 deferred; see §11
  amendment 2026-09-04).
- Tool substitution (cursor-assistant instead of cursor-ai/auto) is the
  same substitution disclosed for Runs 6–8.
- Run is **post-hoc** (executed after the Cond A extension amendment);
  researcher-degrees-of-freedom bias disclosed per Simmons 2011 in
  thesis Ch.7 limitations.
