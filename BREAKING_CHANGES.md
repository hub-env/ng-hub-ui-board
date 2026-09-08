# Breaking Changes in `ng-hub-ui-board`

This document details the breaking changes introduced in major versions of `ng-hub-ui-board` and how to migrate your codebase.

## [22.6.0] - 2026-09-08

### The module and the seven template directives are renamed with the `Hub` prefix

- **Change**: `BoardModule` is now `HubBoardModule`, and `CardTemplateDirective`,
  `BoardColumnHeaderDirective`, `BoardColumnFooterDirective`, `CardPlaceholderDirective`,
  `ColumnPlaceholderDirective`, `CardDragPreviewDirective` and `ColumnDragPreviewDirective` are
  `HubCardTemplateDirective`, `HubBoardColumnHeaderDirective`, `HubBoardColumnFooterDirective`,
  `HubCardPlaceholderDirective`, `HubColumnPlaceholderDirective`, `HubCardDragPreviewDirective` and
  `HubColumnDragPreviewDirective`. Only the exported names move: the classes are the same objects,
  and the selectors — `cardTpt`, `columnHeaderTpt`, `columnFooterTpt`, `cardPlaceholder`,
  `columnPlaceholder`, `cardDragPreview`, `columnDragPreview` — are untouched.

- **Why**: `CardTemplateDirective` is a name any application with cards in it will want, and an
  unprefixed export claims it inside the consumer's namespace rather than the library's. The file
  that imports ours and declares one of its own then has two bindings on a single identifier and has
  to alias its way out of a collision it did not create. `HubBoardComponent` already carried the
  prefix, so the component and the directives that only exist to feed it were spelled by two
  different conventions in the same import list.

- **What happens if you do nothing**: today, nothing. All eight old names are still exported as
  `@deprecated` aliases resolving to the very same classes, so imports keep compiling, `imports:
  [...]` arrays keep matching and the templates keep being picked up by `contentChild`. They are
  removed in **23.0.0**, the release that moves this family to Angular 23, and that is the version
  where the import stops compiling.

- **Migration**: rename the import and its uses. The markup does not change.

    ```ts
    // Before
    import { HubBoardComponent, CardTemplateDirective, BoardColumnHeaderDirective } from 'ng-hub-ui-board';

    // After
    import {
    	HubBoardComponent,
    	HubCardTemplateDirective,
    	HubBoardColumnHeaderDirective
    } from 'ng-hub-ui-board';
    ```

    ```html
    <!-- unchanged, in both versions -->
    <ng-template cardTpt let-card="item">…</ng-template>
    ```

### The colour pipe is `HubBoardInvertColorPipe`, and its template name is `hubBoardInvertColor`

- **Change**: `InvertColorPipe` is now `HubBoardInvertColorPipe` and the name it answers to in a
  template goes from `invertColor` to `hubBoardInvertColor`. Behaviour is unchanged.

- **Why**: a pipe's template name is the part a consumer cannot rename around. `invertColor`, with
  no prefix at all, sits squarely in the application's own template namespace, and two pipes
  registered under one name in the same component is a compile error the consumer has no way to
  settle — neither name is theirs to change. The prefix alone was not enough either:
  `ng-hub-ui-forms` already publishes a `HubInvertColorPipe` answering to `hubInvertColor`, so the
  library's own name has to go in the middle. That other pipe is the better one to reach for if the
  application already depends on `ng-hub-ui-forms` — it resolves any CSS colour and never throws,
  where this one is hex-only and raises on anything else.

- **What happens if you do nothing**: today, nothing. `InvertColorPipe` is still exported, still
  answers to `invertColor`, and is now a deprecated subclass of the renamed pipe rather than an
  alias for it — a pipe's template name travels with its class, so keeping the old name working
  needs a second class rather than a second export. It is removed in **23.0.0**.

- **Migration**: this one is two edits, not one. Change the import *and* the template, because a
  file that imports `HubBoardInvertColorPipe` and still writes `| invertColor` has no pipe under
  that name and fails to compile.

    ```ts
    // Before
    import { InvertColorPipe } from 'ng-hub-ui-board';

    // After
    import { HubBoardInvertColorPipe } from 'ng-hub-ui-board';
    ```

    ```html
    <!-- Before -->
    <span [style.color]="column.color | invertColor">…</span>

    <!-- After -->
    <span [style.color]="column.color | hubBoardInvertColor">…</span>
    ```

## [22.3.0] - 2026-07-07

### SCSS ships at `ng-hub-ui-board/styles` (packaging path)

- **Change**: the theming mixin now builds to `dist/board/styles/...` instead of `dist/board/src/lib/styles/...`, and a `styles/index.scss` root entry forwards it.
- **Impact**: a `@use` that reached into the old `src/lib/styles/...` path no longer resolves.
- **Migration**: `@use 'ng-hub-ui-board/styles' as *;`

## Version 21.1.0

### Removal of Public SCSS Entry Point

The standalone file `src/lib/styles/board.scss` has been removed. Styles are now strictly encapsulated within the `HubBoardComponent` via `board.component.scss`.

**Migration Steps:**

1.  **Remove manual style imports:** If you were importing the stylesheet manually in your global `styles.scss`, remove the following line:

    ```scss
    @use 'ng-hub-ui-board/src/lib/styles/board.scss';
    ```

2.  **Automatic Styling:** The component now handles its own styles. Ensure your build pipeline correctly processes component-level SCSS.

3.  **Global Overrides:** If you need to override component styles globally, you should now use CSS custom properties (variables) or target the `.hub-board` class directly (using `:deep` or global selectors if necessary, though CSS variables are the recommended approach).

## Version 21.0.0

### CSS Variables Prefix Standardization

To maintain consistency across the entire `ng-hub-ui` ecosystem, all CSS variables for the board component have been refactored.
The legacy `--hub-` prefix for component variables has been updated to include the component namespace: `--hub-board-`.

**Migration Steps:**
Find and replace usages of the old CSS variables with the new ones. For example:

- Replace `--hub-column-bg` with `--hub-board-column-bg`
- Replace `--hub-card-bg` with `--hub-board-card-bg`
- Replace `--hub-card-border-radius` with `--hub-board-card-border-radius`

For a complete and up-to-date token catalog, please refer to the main CSS Variables Reference document.

### Stylesheet Import Renamed

The base stylesheet import has been renamed to better reflect its association with the component.

**Migration Steps:**
Update your global `styles.scss` (or component specific SCSS files) depending on this component:

**Before:**

```scss
@use 'ng-hub-ui-board/src/lib/styles/base.scss';
```

**After:**

```scss
@use 'ng-hub-ui-board/src/lib/styles/board.scss';
```
