# SUTH Design System Audit

## Summary

This repository is a static, no-build design-system library for Suranaree University of Technology Hospital. The deliverables are `suth-ds.css`, `suth-ds.min.css`, `suth-ds.js`, and `suth-ds.min.js`; `index.html` and `icons.html` are documentation/showcase pages.

The audit found backup/legacy files, a duplicate JavaScript build, an orphaned theme stylesheet, missing webfont assets, a documented utility that was not defined in the source CSS, and a stale production CSS build.

## Dead / Unused

- `index.html.backup` - backup artifact; near-identical to `index.html` and not linked.
- `index_old.html` - previous showcase version and not linked from current docs.
- `image/c1.png`, `image/c3.png`, `image/c4.png`, `image/c5.png` - referenced only by `index_old.html`; become unused with that legacy page removed.
- `suth-ds-theme.css` - standalone older theme stylesheet; not referenced by current HTML/CSS/JS. Its tokens and theme behavior are superseded by `suth-ds.css`.

## Outdated / Out Of Sync

- `suth-ds.min.css` - stale production build. It must be regenerated from `suth-ds.css` so the live docs and downloads include the semantic theme tokens and current component/state coverage.
- `suth-ds.v2.min.js` - duplicate of `suth-ds.min.js` and published as an alternative download. User confirmed removal from both files and documentation.

## Missing / Broken

- `Fonts/SUT Light ver 1.00.woff2`, `Fonts/SUT Regular ver 1.00.woff2`, and `Fonts/SUT Bold ver 1.00.woff2` were referenced by `@font-face` but missing from `Fonts/`.
- `.sr-only` was documented in `index.html` but missing from `suth-ds.css`.

## Confirmed Decisions

- Remove `suth-ds.v2.min.js` and all docs references to it.
- Keep the `.otf` files as alternate-format brand assets.
- Generate real `.woff2` files from the existing `.ttf` font files.
- Preserve the existing visual design and avoid restyling.

## Completion Checklist

- [x] Delete dead files and duplicate JS artifact.
- [x] Remove the duplicate JS download button and file-table row from `index.html`.
- [x] Add `.sr-only` to `suth-ds.css`.
- [x] Generate missing `.woff2` fonts from `.ttf` files.
- [x] Regenerate `suth-ds.min.css` from `suth-ds.css`.
- [x] Verify no references remain to deleted files.
- [x] Verify custom property parity between `suth-ds.css` and `suth-ds.min.css` (187 unique vars each).
- [x] Browser verification: `index.html` and `icons.html` load with 0 failed requests; dark-mode toggle works.
