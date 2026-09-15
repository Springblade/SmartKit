# Task List: Cross-Reference Hygiene in `main.tex`

> Source: `tasks/plan.md`. Track status here as work progresses.

## Phase 1 — Chapter 1 claim-level refactor

- [x] **Task 1** — Cluster A: Replace 6 weak refs in Chapter 1 with "§6.2" prose (lines 372, 377, 403, 416, 424, 461)
- [x] **Task 2** — Cluster B: Convert L451 chapter ref to literal "Chapter 6"
- [x] **Task 3** — Cluster D: Rewrite FP1–FP3 to claim/summary level (lines 382–393); DP1–DP3 unchanged

### Checkpoint: Phase 1

- [x] `pdflatex main.tex && bibtex main && pdflatex main.tex && pdflatex main.tex` — exits 0
- [x] `grep -E "Reference .* undefined" main.log` — zero matches
- [x] Read §1.3 in the compiled PDF

## Phase 2 — Chapter 4 inline + Chapter 5 footnote

- [x] **Task 4** — Cluster C: Inline-rewrite "see below" at L612
- [x] **Task 5** — Cluster E: Convert footnote at L707 to prose paragraph

### Checkpoint: Phase 2

- [x] `pdflatex` ×2 + `bibtex` — exits 0
- [x] `grep -E "Reference .* undefined" main.log` — zero matches
- [x] Spot-check Ch.4 §4.1.1 and Ch.5 opener in PDF

## Phase 3 — Cross-reference sweep

- [x] **Task 6** — Cluster F: Sweep remaining raw `\ref` → `\autoref` (93 replacements across 40 unique labels) and fix L648 brace typo (not present in current source — already correct)

### Checkpoint: Phase 3 — Full build

- [x] `pdflatex` ×2 + `bibtex` — exits 0
- [x] `grep -E "Reference .* undefined" main.log` — zero matches
- [x] `grep -n "\\\\ref{" main.tex` — zero matches
- [ ] PDF page count matches pre-edit PDF (drift: +1 page, 63 → 64, expected from `\autoref` hyperref autolinks)
- [x] Spot-check 5 pages for prefix correctness

## Final acceptance

- [x] All 6 tasks done
- [x] Zero raw `\ref{` in `main.tex`
- [x] Zero undefined references in `main.log`
- [x] §1.3 reads at claim level
- [x] Footnote at L707 removed
- [x] L648 brace typo fixed (or absent — verified clean)
- [x] No citation edits made
