# Next-Action Plan — Phase 7: 3 Cond A runs (post-submission)

**Date:** 2026-09-06
**Status:** Pending execution (user has time per `AskUserQuestion` answer 2026-09-06)
**Tag at start of Phase 7:** `thesis-submission-v2` (commit `d829c5f`)

## Context

Thesis đã ở trạng thái submission-ready với tag `thesis-submission-v2` (56 pages,
594 KB). 3 directional predictions (DP1, DP2, DP3) đang ở verdict **inconclusive**
vì n=2 Cond A chưa đủ cho §A.5.4.1 binary rule (cần N=5). Phase 7 chạy 3 Cond A
sessions còn lại (run-06, run-07, run-08) để đạt n=5 và issue confirmed/refuted
verdicts.

**Trạng thái trước Phase 7:**
- `runs/cond-a/run-{04,05}` đã complete (n=2 Cond A).
- `runs/cond-b/run-{01,02,03}` đã complete (n=3 Cond B).
- `runs/cond-a/run-{06,07,08}` directory + README đã tồn tại (pending).
- 3 DPs đang inconclusive (n=2 Cond A insufficient cho §A.5.4.1).
- Git tag `thesis-submission-v2` ở commit `d829c5f`.

**Sau Phase 7:**
- Cond A n=5, Cond B n=3.
- §A.5.4.1 binary rule có thể issue confirmed (5/5) / refuted (0/5) / inconclusive (1-4/5).
- Wilson 95% CIs narrower, comparative Bonferroni 99% CI có thể issue (cả 2 bên n=5).
- Tag mới `thesis-submission-v3`.

## Phạm vi

### Step 7.1: Execute 3 Cond A runs (~3-6h, manual user work)

**Pre-conditions:**
- Có Cursor AI license và quyền truy cập `SmartKit/` repo.
- Đã đọc `docs/pilot-pre-registration.md` §4 (Prompt B) và §5 (rubric 0-5).
- Đã đọc `runs/cond-a/run-{04,05}/score.json` để hiểu format output.

**Procedure (lặp lại 3 lần cho run-06, run-07, run-08):**

1. **Fresh Cursor AI session** trong `SmartKit/`, no prior context.
2. **Paste Prompt B verbatim** từ `docs/pilot-pre-registration.md` §4 (KHÔNG paraphrase,
   KHÔNG thêm follow-up — đây là exclusion event E4).
3. **Snapshot artifacts** vào `runs/cond-a/run-NN/`:
   - `cp -r SmartKit/features/flags runs/cond-a/run-NN/features/flags`
   - `cp -r SmartKit/src/tests/features/flags runs/cond-a/run-NN/src/tests/features/flags`
   - Bất kỳ file nào khác AI tạo ra ngoài 2 paths trên.
4. **Run scoring script:**
   ```bash
   cd SmartKit && pnpm tsx scripts/score-flag.ts --run-dir ../runs/cond-a/run-NN --out ../runs/cond-a/run-NN/score.json
   ```
5. **Primary-rater manual scoring** (xem `runs/cond-a/run-05/score.json` làm example):
   - Fill `manual.structural_integrity`, `manual.type_contract_safety`,
     `manual.coverage_completeness` (mỗi cái 0-5)
   - Fill `manual.naming_quality` (0-5, captured but not in DP rule)
   - Fill `manual.notes` với primary-rater observations
   - Fill `time_to_correct_minutes`, `edit_list`, `did_not_converge`
6. **Commit** với message `pilot: run-NN (cond-a) completed, score=Str/Type/Cov`.

**Seeds (theo §3.3 locked sequence):**
- run-06: seed `1234567899`
- run-07: seed `1234567900`
- run-08: seed `1234567901`

### Step 7.2: Re-aggregate DP verdicts (~15min)

```bash
cd SmartKit && pnpm tsx scripts/aggregate-dp.ts --runs-dir ../runs --out ../runs/dp-summary.json
```

**Verification:**
- `jq .condition_n runs/dp-summary.json` → `{A: 5, B: 3}` (n=5 mỗi bên)
- DP verdicts không còn "inconclusive (n=2 insufficient)" mà là confirmed (5/5) hoặc refuted (0/5)
  hoặc inconclusive (1-4/5) theo §A.5.4.1 rule.

### Step 7.3: Update thesis body với data mới (~1-2h)

**File cần edit: `latex/main.tex`**

**§6.7 Table 6.3 (line ~942):** Replace 3 "pending" rows (6, 7, 8) với actual scores.
- Re-compute per-condition aggregates (medians, ranges).
- Update §6.7 narrative: "Condition A medians..." paragraph.

**§6.7 DP verdicts (line ~952-956):** Update binary counts.
- DP1: Cond A `k/5 in features/flags/lib/` — k thay đổi từ `2/2` thành `?/5` sau 3 runs mới.
- DP2: Cond A `k/5 in Zod-derived FlagKey enum` — tương tự.
- DP3: Cond A `k/5 in src/tests/features/flags/` — tương tự.
- Wilson 95% CIs narrower (n=5 thay vì n=2).
- Comparative Bonferroni 99% CI có thể issue vì cả 2 bên đều n=5 (c2 §5.4.3).

**§A.10 Run log table (`latex/appendix-pre-registration.tex` line ~395):** Same updates.

**§10 markdown pre-reg table (`docs/pilot-pre-registration.md` line ~389):** Mirror same updates.

### Step 7.4: Update §A.11 amendment log với kết quả thật (~30min)

**File: `latex/appendix-pre-registration.tex` + `docs/pilot-pre-registration.md` §11**

Add 1 row documenting post-extension verdict:

| Date | Section | Old | New | Reason |
|---|---|---|---|---|
| 2026-09-XX | §6.7 DP verdicts | inconclusive × 3 (n=2) | confirmed/refuted/inconclusive per §A.5.4.1 | Cond A extended to n=5; binary rule now determinate |

**Mirror to markdown pre-reg §11.**

### Step 7.5: Rebuild PDF + final tag (~30min)

1. `cd latex && pdflatex -interaction=nonstopmode main.tex` (3 passes).
2. Verify `main.pdf` 57-58 pages (was 56; +1-2 from real scores in pending rows + verdict updates).
3. Commit: `thesis(phase 7): apply real Cond A run-06/07/08 data + DP verdict updates`.
4. Tag: `thesis-submission-v3` (increment from v2).

## Verification (end-to-end)

- [ ] 3 score.json files có manual cells + ttc + notes đầy đủ
- [ ] `dp-summary.json` shows `condition_n: {A: 5, B: 3}`
- [ ] DP verdicts không còn "n=2 insufficient" language
- [ ] Wilson 95% CIs trong §6.7 khớp với `dp-summary.json` (4 decimal places)
- [ ] §A.10 + §10 markdown + Table 6.3 tất cả show 8 runs với data thật
- [ ] §A.11 có row documenting the post-extension verdict
- [ ] `main.pdf` compiles 0 errors
- [ ] Tag `thesis-submission-v3` exists

## Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Cond A n=5 vẫn inconclusive (e.g., 4/5) | Medium | Low | §A.5.4.1 rule báo inconclusive trung thực — vẫn tốt hơn n=2 |
| 3 runs mới có 1 run bị exclusion (E1-E5) | Low | Medium | Document exclusion event, run lại 1 session mới |
| Manual scoring inconsistency giữa runs mới và runs cũ | Medium | Low | Same primary rater, same rubric, same 0-5 anchor examples (`docs/pilot-pre-registration.md` §5) |
| Time-to-correct variance lớn (AI non-determinism) | Low | None | Document variance, không dùng làm DV chính |
| Aggregate script (`aggregate-dp.ts`) cần fix khi n=5 | Low | Medium | Test với dry-run data trước khi chạy thật |

## Critical files

| File | Action | Notes |
|---|---|---|
| `docs/pilot-pre-registration.md` §4 | Read-only (paste Prompt B) | Nguồn Prompt B chính thức |
| `runs/cond-a/run-{06,07,08}/score.json` | Create (3 files) | Output của `score-flag.ts` + manual |
| `runs/cond-a/run-{06,07,08}/features/flags/` | Create (3 dirs) | AI-generated code snapshot |
| `runs/cond-a/run-{06,07,08}/src/tests/features/flags/` | Create (3 dirs) | AI-generated test snapshot |
| `runs/dp-summary.json` | Re-generate | Output của `aggregate-dp.ts` |
| `latex/main.tex` | Edit | Table 6.3, §6.7 narrative, DP verdicts |
| `latex/appendix-pre-registration.tex` | Edit | §A.10 (run log), §A.11 (amendment row) |
| `docs/pilot-pre-registration.md` | Edit | §10 (mirror Table 6.3), §11 (mirror amendment) |
| `latex/main.pdf` | Re-build | 3 passes pdflatex |
| Git tag | Create | `thesis-submission-v3` |

## Effort estimate

- **Step 7.1** (3 Cursor AI sessions): ~3-6h (depends on AI speed; per-run ~1-2h including manual scoring)
- **Step 7.2** (re-aggregate): ~15min
- **Step 7.3** (thesis body updates): ~1-2h
- **Step 7.4** (amendment log): ~30min
- **Step 7.5** (rebuild + tag): ~30min
- **Total Phase 7**: ~5-8h

## Out of scope (Phase 7 defer)

- Cross-tool replication (Cursor vs Copilot, Claude Code) — post-submission
- Cross-framework (Nuxt, Remix) — post-submission
- Developer-participant study — post-submission
- Empirical orthogonality validation (n≥30) — post-submission
- Re-do IRR with second rater — post-submission
- Vibestack 2025 citation verification (review finding #9) — post-submission

## Cross-references

- Main plan: `C:\Users\wayad\.claude\plans\effervescent-questing-lemon.md` (Phases 0-6 done, Phase 7 this)
- Source pre-registration: `docs/pilot-pre-registration.md` (Prompt B §4, rubric §5, schedule §3.3, verdict rule §A.5.4.1)
- C2 design document: `docs/c2-direction.md` (verdict rule §5.4.1, schedule §4, comparative CI §5.4.3)
- Pilot data: `runs/cond-{a,b}/run-NN/score.json` (source of truth for all numbers)
- Adaptive decision: `runs/adaptive-decision.md` (extension rationale, recorded 2026-09-06)
- DP summary: `runs/dp-summary.json` (regenerated after Step 7.2)
- Thesis: `latex/main.tex` (body), `latex/appendix-pre-registration.tex` (Appendix A)
