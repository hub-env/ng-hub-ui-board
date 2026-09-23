# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [22.6.3] - 2026-09-23

### Changed

- **The Angular peer range now says what the code needs, not a number somebody picked.** It asked
  for `>=18.0.0`, which nothing in this package justified. The newest Angular API the source uses is
  the signal queries, which shipped in 17.2, and the partial-Ivy output the Angular linker checks carries no
  marker above it. The range is `>=17.2.0`, so applications on those versions can install this
  library instead of being turned away by a range that was never measured.
- **The floor is derived and checked from now on.** `npm run peers:floors` works it out from three
  things that can be verified — the Angular APIs the source calls, the `minVersion` markers in the
  compiled output, and the Angular types that reach the published `.d.ts` — and CI fails when a
  declaration drifts away from it again.

## [22.6.2] - 2026-09-21

### Changed

- **The README says what the board is before it warns about anything.** The page opened on the
  21.1.0 breaking-change notice, so a reader arriving from npm was handed a migration step before a
  description. The header now carries the one-line description and the licence and Angular badges
  the rest of the family shows, and the notice moved to an `Upgrading from 21.0.x` section below
  the installation instructions. `README.es.md` follows the same shape. Documentation only: no
  code, types or styles change.

## [22.6.1] - 2026-09-16

### Changed

- The repository moved to the `hub-env` organization. Issues for every Hub UI package are now
  gathered in [hub-env/hub-ui](https://github.com/hub-env/hub-ui/issues), and the `repository`, `bugs`
  and README links point at the new addresses. GitHub redirects the old ones.

## [22.6.0] - 2026-09-08

### Changed

- **BREAKING — the module and the seven template directives are renamed with the `Hub` prefix.**
  `BoardModule` becomes `HubBoardModule`, and `CardTemplateDirective`,
  `BoardColumnHeaderDirective`, `BoardColumnFooterDirective`, `CardPlaceholderDirective`,
  `ColumnPlaceholderDirective`, `CardDragPreviewDirective` and `ColumnDragPreviewDirective` gain the
  same prefix. `CardTemplateDirective` is a name any application with cards in it will want, and an
  unprefixed export claims it inside the consumer's namespace rather than the library's: the file
  that imports ours and declares its own is left aliasing its way out of a collision it did not
  create. `HubBoardComponent` already carried the prefix, so the component and the directives that
  exist only to feed it were spelled two ways in one import list. The selectors — `cardTpt`,
  `columnHeaderTpt`, `columnFooterTpt`, `cardPlaceholder`, `columnPlaceholder`, `cardDragPreview`,
  `columnDragPreview` — are untouched, so no markup changes. All eight old names stay exported as
  deprecated aliases resolving to the same classes and are removed in 23.0.0. See
  `BREAKING_CHANGES.md`.

- **BREAKING — the colour pipe is `HubBoardInvertColorPipe`, and answers to `hubBoardInvertColor` in
  a template.** A pipe's template name is the one part a consumer cannot rename around, and
  `invertColor` took an unprefixed name in the application's own template namespace; two pipes
  registered under one name in a component is a compile error neither side can settle. The prefix
  alone would not have been enough, since `ng-hub-ui-forms` already publishes `HubInvertColorPipe`
  under `hubInvertColor`, so the library's name goes in the middle. `InvertColorPipe` survives as a
  deprecated subclass still answering to `invertColor` — a pipe's name travels with its class, so
  compatibility here needs a second class rather than a second export — and is removed in 23.0.0.
  Migrating means changing the template as well as the import. See `BREAKING_CHANGES.md`.

- **`ng-hub-ui-ds` is declared as an optional peer dependency, `>=22.0.0`.** The stylesheet has
  themed against `--hub-sys-*` for several releases, every read already carrying its own fallback,
  and the manifest never said so: nothing warned that a `ng-hub-ui-ds` older than the `--hub-ref-*` /
  `--hub-sys-*` architecture would leave the board on those fallbacks, and a reader of the manifest
  had no way to learn that the token package is what turns the theme on. `peerDependenciesMeta`
  marks it optional, so an installation without it stays clean. No code, types or styles change.

### Fixed

- **Both READMEs name the classes that ship.** Every import block, every section heading and the
  legacy-module snippet still used the old names, so a reader copying the documented import wrote
  code that compiles only against the deprecated aliases — precisely the audience this rename exists
  to move.

## [22.5.2] - 2026-09-06

### Changed

- **`HubBoardComponent` now declares `ChangeDetectionStrategy.OnPush`.** Every value the template
  reads is already a signal, and Angular 22 treats a component that names no strategy as OnPush, so
  an application on the current major sees no change. The declaration is what carries the strategy
  into the published package: this library is compiled in partial mode and its peer range still
  admits Angular 18, and a pre-22 linker resolves an unstated strategy to `Eager` — so the consumers
  furthest from the current major were the ones paying for a check on every tick. It also saves the
  reader from having to infer the contract from the framework default of the day.

### Fixed

- **The columns are now the items of the board's list.** `role="list"` sat on the host, but its
  children were two role-less wrappers, the hidden keyboard hint and the live region — never a
  `listitem` — so the required-owned-elements chain broke and a screen reader read the board as a
  list with no items. The list now lives on the columns track, each column container is its
  `listitem`, and the column's group semantics (`role="group"`, its `aria-label` and its stable id)
  moved onto the column itself, which leaves the hint and the announcer outside the list. The host
  keeps its `aria-label` and becomes a `region`, so `boardLabel` still names the board and a
  screen-reader user can reach it without the consumer adding a heading of their own.

- **`BoardModule` now exports `CardDragPreviewDirective` and `ColumnDragPreviewDirective`.** Both are
  public API and both are documented in the README with no caveat, but neither was in the module, so a
  consumer who took the documented "Module Import (Legacy)" route got a `<ng-template cardDragPreview>`
  that matched no directive. Nothing failed out loud — the template was simply ignored and the default
  preview rendered — which is the worst way for an option to not work.

- **The documentation now describes the component that ships.** Both READMEs promised things the
  code does not do and hid things it does: a CC BY 4.0 licence the `22.5.0` relicense had already
  replaced with MIT, a `@use 'ng-hub-ui-board/src/lib/styles/board.scss'` import of a file removed in
  `21.1.0`, a card template bound to `let-card="card"` when the context key is `item` (so the
  snippet rendered an empty card), `board` typed as `Signal<Board>` when the input takes a plain
  `Board`, a `primary` default on a `variant` that has none, `EventEmitter` where the outputs are
  `output()`, a `BoardColumn` block missing the very `predicate` the keyboard section relies on,
  and a "virtual scrolling" feature that is only end-of-column detection. Each one is a reader
  copying a line that fails to compile or silently renders nothing.

- **`FUNCTIONALITIES.md` no longer lists a configurable scroll-detection padding.** It is a private
  constant, not an input; the row promised an API that has never existed.

## [22.5.1] - 2026-09-01

### Changed

- **The `homepage` in the manifest points at this library's own documentation page** rather than at
  the site root. It is the link a registry shows beside the package and the one a reader clicks from
  it, and landing on a front page they then have to search is a worse answer than landing on the
  reference for the package they were already looking at. Metadata only — no code, no types, no
  styles change, and nothing a consumer imports is affected.

## [22.5.0] - 2026-08-17

### Changed

- **Relicensed from CC-BY-4.0 to MIT.** Creative Commons advises against its licences for software, and the reasons applied squarely here: no patent grant, no source-distribution terms, and an attribution requirement with no defined meaning for code that ends up inside a bundle — a consumer could not tell whether crediting was owed in their interface, in a third-party notices file, or nowhere. MIT grants strictly more than CC-BY-4.0, so nobody who took an earlier version loses anything; those versions keep the grant they were published under.

## [22.4.1] - 2026-08-08

### Fixed

- Documentation links now point at the canonical localized URLs. The README linked to `https://hubui.dev/<path>` with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.

## [22.4.0] - 2026-07-28

### Added

- **Keyboard accessibility — cards can now be reordered without a pointer.** Every enabled card is a tab stop (`tabindex="0"`; no roving tabindex — the simple, consistent model). With a card focused:
	- `Space` / `Enter` **grabs** the card (visual `hub-board__card--grabbed` state styled with the existing placeholder tokens, so it recolours per `variant`).
	- While grabbed, `ArrowUp` / `ArrowDown` move it within its column and `ArrowLeft` / `ArrowRight` move it to the adjacent column, honouring the **same rules as the drag path** (the target column's `predicate` and `cardSortingDisabled`). Each move is applied live and focus follows the card.
	- `Space` / `Enter` **drops** (commits) the move, emitting `onCardMoved` with the **exact same `CardDragDropEvent` payload shape as a pointer drop** (`previousIndex` / `currentIndex` refer to the grab origin and the final position; `previousContainer` / `container` are the origin and final columns). Dropping a card that was never moved releases the grab without emitting.
	- `Escape` **cancels**, restoring the card to its original position with no event emitted.
- **ARIA semantics.** The board host exposes `role="list"` with an `aria-label` driven by the new optional `boardLabel` input (defaults to `'Board'`); each column container is a `role="group"` labelled by its title with a stable, board-scoped id; each column body is a `role="list"` and each card a `role="listitem"`.
- **Screen-reader announcer.** A visually hidden `aria-live="polite"` region announces grab ("Card X grabbed. Position N of M in Y…"), every move ("moved to Y, position N of M"), drop, cancel, and rejected targets ("cannot be moved to Y"). Each focusable card also points (`aria-describedby`) to a hidden usage hint. `aria-grabbed` is intentionally not used (deprecated in ARIA 1.1).
- New optional `boardLabel` input on `<hub-board>` — the accessible name of the board container.
- Visible `:focus-visible` ring on cards, driven by the `--hub-board-accent` slot. No new CSS custom properties were introduced.

### Changed

- Internal: the `onCardMoved` payload construction was extracted into a single shared path used by both the pointer drop and the keyboard commit, guaranteeing identical events regardless of input modality.

### Known limitations / future work

- Announcer messages are hardcoded in English for now; i18n/customisation of the messages is tracked as future work.
- Column reordering by keyboard is out of scope for this release (pointer drag-and-drop only).

## [22.3.0] - 2026-07-07

### Changed

- **BREAKING (packaging) — SCSS ships at `ng-hub-ui-board/styles`.** The theme mixin now builds to `dist/board/styles/...` (was `dist/board/src/lib/styles/...`), so `@use 'ng-hub-ui-board/styles'` resolves. Update any `@use` that reached into `src/lib/styles`.

- **`<hub-board>` `variant` accepts ANY colour.** On top of the built-in semantic accents, the input now also accepts a **registered custom accent** and a **literal colour** (`#ff0000`, `rgb(...)`, `oklch(...)`, a CSS named colour), resolved through the shared `resolveHubAccent` helper (imported from `ng-hub-ui-utils`): a bareword becomes `var(--hub-sys-color-<name>, <name>)`; a literal is used as-is. The single `--hub-<comp>-accent` slot derives the rest of the family, so built-in colours are unchanged.
- **Internal — host bindings moved to the `host` metadata object.** `@HostBinding` / `@HostListener` decorators were replaced by the `host` object in the component/directive metadata (Angular style guide). No public API or behaviour change.

## [22.2.1] - 2026-07-02

### Fixed

- Docs: `docs/css-variables-reference.md` default values resynchronized with the actual code declarations (now guarded by the repo-level `tokens-parity` check F).

## [22.2.0] - 2026-06-26

### Changed

- **Accent system migrated to the open-set "local accent slot" pattern.** `<hub-board variant="…">` now re-bases a single `--hub-board-accent` slot, and the role family — `--hub-board-accent-emphasis`, `--hub-board-accent-subtle` and the new `--hub-board-accent-on` (contrast colour) — is derived **locally** from it with `color-mix(in oklch, …)` / relative color, mirroring the `ng-hub-ui-ds` engine. The built-in variant list grew from 5 to the **nine canonical accents** (`primary · secondary · success · danger · warning · info · neutral · light · dark`), and a bare `[data-variant]` block re-derives the family from the slot so **any custom accent** the host app adds to the ds `$hub-accents` map (e.g. `brand`) recolours the drag/drop placeholder at runtime with one CSS rule — no library recompilation.

### Added

- New tokens `--hub-board-accent-on` (grayscale contrast flip driven by the accent's own lightness) and `--hub-board-accent-emphasis`.

### Fixed

- Migrated the accent `color-mix()` derivation (`--hub-board-accent-subtle`) from the `srgb` colour space to `oklch` for perceptually uniform tints, matching `ng-hub-ui-ds`. The subtle tint is now derived at 12% (was 8%).

## [22.1.1] - 2026-06-25

### Fixed

- Design-token consistency pass: aligned inline fallback defaults with the canonical `ng-hub-ui-ds` values and routed hardcoded literals (z-index, font-weight, line-height, radii and theme-aware colours) through their `--hub-sys-*` / `--hub-ref-*` tokens, so they follow the active theme. No visual change when the ds tokens are loaded.

## [22.1.0] - 2026-06-24

### Changed

- **Drag-and-drop internals now consume the shared `ng-hub-ui-utils` native drag-and-drop core.** The board's `moveItemInArray` / `transferArrayItem` helpers (still re-exported from the public API with unchanged behaviour) and the custom drag-preview rendering now come from `ng-hub-ui-utils`, removing duplicated logic. **New peer dependency: `ng-hub-ui-utils` (>=22.1.0)** — previously the board carried no ng-hub-ui dependencies, so install `ng-hub-ui-utils` alongside `ng-hub-ui-board`.

### Added

- New `variant` input on `<hub-board>` selecting the **semantic accent** of the drag/drop placeholder: `<hub-board variant="success">` recolours the drop zone. The built-in variants (`primary` / `success` / `danger` / `warning` / `info`) use the exact design-system tints; **any other string is also accepted** — the board reads `--hub-sys-color-<variant>` from the host application. Defaults to `primary`. Mirrors the accent system in panels/nav.
- New tokens `--hub-board-accent` and `--hub-board-accent-subtle` (the placeholder's `--hub-board-placeholder-border-color` / `-bg` now resolve through them instead of being hard-wired to `--hub-sys-color-primary*`). No visual change with the default accent.
- New **`hub-board-theme()` Sass mixin** (`styles/mixins/board-theme`) — theme a `<hub-board>` in one call: accent, container/column/card colours, borders/radius, columns gap, card padding & shadow. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-board-*` overrides; the rest keep their defaults. Token-based, no Bootstrap dependency.

## [22.0.0] - 2026-06-17

### Changed

- Aligned with Angular 22.
- README documentation standardized.


## [21.1.2] - 2026-06-14

### Changed

- Replaced the deprecated `ngStyle` directive with the native `[style]` binding on board columns and cards (Angular soft-deprecated `ngStyle`/`ngClass` in November 2024 in favour of native bindings, for better performance and smaller bundles).

## [21.1.1] - 2026-04-14

### Fixed

- Corrected `mousedown` expression on disabled cards: replaced `card.disabled && $event.stopPropagation()` with `card.disabled ? $event.stopPropagation() : null` for correct template evaluation.

### Documentation

- Updated `README.md` with Hub UI live documentation links, language toggle, and complete `ng-hub-ui` family list.
- Added `README.es.md` (Spanish translation).

## [21.1.0] - 2026-03-17

### Changed

- **BREAKING CHANGE:** Removed `src/lib/styles/board.scss`. Styles are now encapsulated within `HubBoardComponent` via `board.component.scss`.
- Refactored internal styling structure for better component encapsulation.
- Improved test robustness and hardened directive specs.

## [21.0.0] - 2026-03-09

### Changed

- **BREAKING CHANGE:** Completely refactored the SCSS variable names to ensure they follow the `hub-board-` prefix standard. `base.scss` has been renamed to `board.scss`. Check `BREAKING_CHANGES.md` for migration guidelines.

## [19.4.0] - 2026-01-17

### Added

- Native drag-and-drop implementation without external dependencies (removed @angular/cdk dependency)
- Custom drag preview templates via `CardDragPreviewDirective` and `ColumnDragPreviewDirective`
- Custom placeholder templates via `CardPlaceholderDirective` and `ColumnPlaceholderDirective`
- New `dragBehavior` input to control dragged element visibility: `'ghost'`, `'hide'`, or `'collapse'`
- New `CardDragDropEvent` and `ColumnDragDropEvent` interfaces replacing CDK's CdkDragDrop
- Custom drag-and-drop event models with complete type safety
- Six new CSS custom properties for drag-and-drop customization (`--hub-drag-transition`, `--hub-placeholder-*`)

### Changed

- Replaced Angular CDK drag-and-drop with custom native implementation
- Updated all drag-and-drop event types from CDK to custom interfaces
- Refactored component to use signals for column tracking with versioning
- Enhanced board component with 621 new lines of drag-and-drop logic
- Updated README with comprehensive documentation of new features, templates, and CSS variables

### Removed

- Removed `@angular/cdk` peer dependency
- Removed `predicate` property from `BoardColumn` interface (CDK-specific)

## [19.3.9] - 2026-01-16

### Fixed

- Updated `publish:npm` and `pack` scripts in `package.json` to execute from the `dist/board` directory, ensuring published packages contain compiled artifacts instead of source code.

## [19.3.8] - 2026-01-16

### Fixed

- Ensured correct publication of compiled artifacts by refining the release process.
- Reverted `exports` configuration to maintain consistency with other libraries.

## [19.3.7] - 2026-01-16

### Fixed

- Removed incorrect `!src/**/*` exclusion from `package.json` that was preventing CSS files from being included in the published package.

## [19.3.6] - 2026-01-16

### Fixed

- Added `styles` export configuration in package.json to properly expose SCSS files.

## [19.3.5] - 2026-01-15

### Changed

- Complete refactoring of board styling to use CSS variables for enhanced customization.
- Documented all available CSS variables in README.
- Added `StylingBoardExampleComponent` to showcase custom styling capabilities.

## [19.3.4] - 2026-01-15

### Changed

- Complete refactoring of board styling to use CSS variables for enhanced customization.
- Documented all available CSS variables in README.
- Added `StylingBoardExampleComponent` to showcase custom styling capabilities.

## [19.3.3] - 2026-01-15

### Changed

- Complete refactoring of board styling to use CSS variables for enhanced customization.
- Documented all available CSS variables in README.
- Added `StylingBoardExampleComponent` to showcase custom styling capabilities.

## [19.3.2] - 2025-10-15

### Changed

- Improved `reachedEnd` event documentation in README with correct usage examples showing `event.data` as the complete `BoardColumn` object
- Updated `reachedEnd` event example to include proper container with fixed height requirement for scroll detection
- Enhanced license section in README with detailed explanation of CC BY 4.0 permissions, requirements, and attribution example

### Fixed

- Corrected misleading `reachedEnd` event documentation that incorrectly showed direct access to `event.data.title` instead of extracting the column first

## [19.3.1] - 2025-10-15

### Added

- Comprehensive JSDoc coverage across public models, directives, pipes, and the `HubBoardComponent` for improved API discoverability.
- New unit test ensuring the `reachedEnd` event is not emitted when column data is unavailable.

### Changed

- Refined infinite-scroll detection tolerance to ensure `reachedEnd` fires reliably at the bottom of each column.
- Hardened the document example logic to avoid duplicate lazy-load requests while columns are already loading.
- Typed the `invertColor` pipe output and improved error handling for invalid HEX values.

[19.3.1]: https://github.com/carlos-morcillo/ng-hub-ui-board/compare/19.3.0...19.3.1
