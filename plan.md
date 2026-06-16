# Plan: Audit, clean up, and complete the SUTH Design System

## Context
`suth-ds` is a static (no-build) design-system library for Suranaree University of
Technology Hospital. Deliverables are the CSS/JS files; `index.html` is the
documentation/showcase site (with download links), `icons.html` is an icon gallery,
`THEME_GUIDE.md` documents the theming model. The repo has accumulated backups, an
old showcase version, a duplicate JS build, an orphaned theme stylesheet, and — most
importantly — a **stale production `suth-ds.min.css`** that the live showcase loads.
This is a cleanup + completion pass. The existing visual design must be preserved.

## Audit findings (full audit goes into `AUDIT.md` during execution)

### Dead / unused (safe to delete)
- `index.html.backup` — near-identical backup of `index.html` (only a whitespace diff). Backup artifact.
- `index_old.html` — previous showcase version (`<title>Design System</title>`, `<h1>Button Colors</h1>`), not linked from anywhere.
- `image/c1.png, c3.png, c4.png, c5.png` — referenced **only** by `index_old.html`; become dead when it is removed.
- `suth-ds-theme.css` — standalone older theme file, **not referenced by any HTML/CSS/JS**. Its tokens + light/dark theme are fully superseded by `suth-ds.css` (which defines all primitives, semantic vars, `@media dark` and `[data-theme="dark"]`).

### Outdated / out of sync (fix, don't delete)
- `suth-ds.min.css` — **stale build**. Missing 66 custom properties vs `suth-ds.css`, including the entire semantic theming layer (`--card-bg`, `--bg-surface`, `--btn-primary-*`, dark `[data-theme]` semantics). `index.html` + `icons.html` load this file, so the live site runs an old build lacking the documented semantic theme. Source `suth-ds.css` was edited after the min was generated.
- `suth-ds.v2.min.js` — **byte-identical** to `suth-ds.min.js` (only `×` vs `×` escaping + trailing newline). Pure duplicate, but published as a "Version 2 JS (Alternative)" download in `index.html` → see Needs confirmation.
- `suth-ds.min.js` — in sync with `suth-ds.js` (same modules, v2.3.0). No action.

### Missing / incomplete / broken references
- **Broken font refs**: both `suth-ds.css` and `suth-ds.min.css` `@font-face` reference `Fonts/SUT *.woff2` which **do not exist** (only `.otf`/`.ttf` present) → 404s (the `.ttf` fallback still loads).
- **`.sr-only` documented but not defined**: `index.html` Accessibility section documents an `.sr-only` utility + `:focus-visible`, but `suth-ds.css` never defines `.sr-only`.

### Design-system gaps (preserve current look)
- Production build must be regenerated so shipped min.css matches source (semantic tokens + dark theme).
- Add missing `.sr-only` utility (matches the documented code).
- State coverage is otherwise good and present in source: `.skeleton`, `.spinner*`, `.empty-state`/`.empty-*`, `:disabled`/`[disabled]` (41), `:focus`/`:focus-visible` (20), `.tooltip`. No new aesthetic needed.

### Decisions confirmed by user
- `suth-ds.v2.min.js` → **remove** the duplicate file + its download button + file-table row in `index.html`.
- 3 `.otf` fonts → **keep** as alternate-format brand assets (no deletion).
- woff2 → **generate** real `.woff2` from the `.ttf` (fonttools+brotli) so the existing `@font-face` resolves; keeps design intent.
- Remaining for me to surface only if new ambiguity arises during execution.

## Tooling
Node v25 + `npx` available → regenerate min.css reliably with `npx csso-cli` (or `clean-css-cli`). Python 3.14 available → `fonttools`+`brotli` can generate woff2 if that route is chosen.

## Execution outline (after approval)
1. **AUDIT.md** — write the categorized audit above with file paths + reasons + Needs-confirmation list.
2. **Phase B — remove dead code**: delete `index.html.backup`, `index_old.html`, `suth-ds-theme.css`, `image/c1,c3,c4,c5.png`, and `suth-ds.v2.min.js`; remove the v2.min.js download button + file-table row from `index.html`. Keep the 3 `.otf` fonts.
3. **Phase C — fill gaps**:
   - Generate `Fonts/SUT *.woff2` from the `.ttf` via Python `fonttools`+`brotli` so the existing `@font-face` woff2 src resolves (both source + min).
   - Regenerate `suth-ds.min.css` from `suth-ds.css` via `npx csso-cli` so production matches source (this also propagates the woff2/.sr-only fixes into the min build).
4. **Phase D — complete design system**:
   - Add `.sr-only` utility to `suth-ds.css` (and regenerate min) to match documented behavior.
   - Confirm state classes (loading/empty/error/disabled/hover/focus) are present and consistent; standardize any stragglers to existing tokens — no restyling.

## Verification
- Open `index.html` and `icons.html` in a browser (or webapp-testing/Playwright): confirm components render, dark-mode toggle works via semantic vars, no console 404s for fonts/CSS.
- Diff custom-property count: `suth-ds.min.css` var count == `suth-ds.css` var count after regen.
- `grep` confirms no remaining references to deleted files.
