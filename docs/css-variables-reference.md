# ng-hub-ui-board - CSS Variables Reference

Complete reference of all CSS custom properties exposed by `ng-hub-ui-board`.
Use these variables to customize visual behavior without editing component source code.

---

## Table of Contents

- [How it Works](#how-it-works)
- [Importing Styles](#importing-styles)
- [Base System Fallbacks](#base-system-fallbacks)
- [Board Variables](#board-variables)
- [Customization Examples](#customization-examples)
- [Best Practices](#best-practices)

---

## How it Works

The board styles are encapsulated within the component using canonical tokens (`--hub-board-*`).

This allows:

- Easy customization via CSS variables on the component's host or parent.
- Clean separation of concerns with component-level styles.
- Runtime theming via CSS custom properties.

---

## Importing Styles

Starting from version 21.1.0, you don't need to import a global stylesheet. The styles are now strictly encapsulated within `HubBoardComponent`.

If you were previously using:

```scss
@use 'ng-hub-ui-board/src/lib/styles/board.scss';
```

You can now remove this import. The component handles its own styling automatically.

---

## Base System Fallbacks

`ng-hub-ui-board` defines and/or consumes these base tokens:

| Variable | Default |
|---|---|
| `--hub-ref-color-white` | `#fff` |
| `--hub-ref-space-2` | `0.5rem` |
| `--hub-ref-space-3` | `1rem` |
| `--hub-ref-radius-md` | `0.375rem` |
| `--hub-ref-border-width` | `1px` |
| `--hub-sys-text-body` | `#212529` |
| `--hub-sys-text-muted` | `#6c757d` |
| `--hub-sys-surface-page` | `#fff` |
| `--hub-sys-surface-elevated` | `rgba(0, 0, 0, 0.03)` |
| `--hub-sys-border-color-default` | `#dee2e6` |
| `--hub-sys-color-primary` | `#0d6efd` |
| `--hub-sys-color-primary-subtle` | `rgba(13, 110, 253, 0.05)` |

---

## Board Variables

These variables are defined in the component's `:host` and can be overridden.

### Core

| Variable | Default |
|---|---|
| `--hub-board-container-color` | `var(--hub-sys-text-body, #212529)` |
| `--hub-board-container-bg` | `var(--hub-sys-surface-page, #fff)` |
| `--hub-board-border-width` | `var(--hub-ref-border-width, 1px)` |
| `--hub-board-border-color` | `var(--hub-sys-border-color-default, #dee2e6)` |
| `--hub-board-border-radius` | `var(--hub-ref-radius-md, 0.375rem)` |
| `--hub-board-columns-gap` | `var(--hub-ref-space-3, 1rem)` |

### Column

| Variable | Default |
|---|---|
| `--hub-board-column-width` | `256px` |
| `--hub-board-column-min-height` | `200px` |
| `--hub-board-column-body-min-height` | `128px` |
| `--hub-board-column-body-gap` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-board-column-spacer-y` | `0.75rem` |
| `--hub-board-column-spacer-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-board-column-border-width` | `var(--hub-board-border-width)` |
| `--hub-board-column-border-color` | `var(--hub-board-border-color)` |
| `--hub-board-column-border-radius` | `var(--hub-board-border-radius)` |
| `--hub-board-column-box-shadow` | `none` |
| `--hub-board-column-inner-border-radius` | `var(--hub-board-border-radius)` |
| `--hub-board-column-cap-padding-y` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-board-column-cap-padding-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-board-column-cap-bg` | `var(--hub-sys-surface-elevated, #f8f9fa)` |
| `--hub-board-column-cap-color` | `inherit` |
| `--hub-board-column-header-title-color` | `inherit` |
| `--hub-board-column-header-title-spacer-y` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-board-column-header-subtitle-color` | `var(--hub-sys-text-muted, #6c757d)` |
| `--hub-board-column-height` | `100%` |
| `--hub-board-column-color` | `var(--hub-board-container-color)` |
| `--hub-board-column-bg` | `var(--hub-board-container-bg)` |

### Card

| Variable | Default |
|---|---|
| `--hub-board-card-spacer-y` | `0.75rem` |
| `--hub-board-card-spacer-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-board-card-title-spacer-y` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-board-card-title-color` | `inherit` |
| `--hub-board-card-subtitle-color` | `var(--hub-sys-text-muted, #6c757d)` |
| `--hub-board-card-border-width` | `var(--hub-board-border-width)` |
| `--hub-board-card-border-color` | `var(--hub-board-border-color)` |
| `--hub-board-card-border-radius` | `var(--hub-board-border-radius)` |
| `--hub-board-card-box-shadow` | `none` |
| `--hub-board-card-inner-border-radius` | `calc(var(--hub-board-card-border-radius) - var(--hub-board-card-border-width))` |
| `--hub-board-card-cap-padding-y` | `var(--hub-ref-space-2, 0.5rem)` |
| `--hub-board-card-cap-padding-x` | `var(--hub-ref-space-3, 1rem)` |
| `--hub-board-card-cap-bg` | `var(--hub-sys-surface-elevated, #f8f9fa)` |
| `--hub-board-card-cap-color` | `inherit` |
| `--hub-board-card-height` | `auto` |
| `--hub-board-card-color` | `var(--hub-board-container-color)` |
| `--hub-board-card-bg` | `var(--hub-board-container-bg)` |

### Drag and Placeholder

| Variable | Default |
|---|---|
| `--hub-board-drag-transition` | `transform 250ms cubic-bezier(0, 0, 0.2, 1)` |
| `--hub-board-placeholder-border-color` | `var(--hub-board-accent)` |
| `--hub-board-placeholder-border-width` | `2px` |
| `--hub-board-placeholder-border-style" | `dashed` |
| `--hub-board-placeholder-bg` | `var(--hub-board-accent-subtle)` |
| `--hub-board-placeholder-min-height` | `60px` |


---

## Customization Examples

### Framework-Agnostic

```scss
.hub-board {
  --hub-board-columns-gap: 1.25rem;
  --hub-board-column-bg: #f8f9fa;
  --hub-board-card-bg: #ffffff;
  --hub-board-card-border-color: #d0d7de;
  --hub-board-placeholder-border-color: #0d6efd;
}
```

### Bootstrap Integration (Optional)

```scss
.hub-board {
  --hub-board-column-bg: var(--bs-light);
  --hub-board-card-bg: var(--bs-body-bg);
  --hub-board-card-border-color: var(--bs-border-color);
  --hub-board-placeholder-border-color: var(--bs-primary);
}
```

### Dense Board Layout

```scss
.hub-board {
  --hub-board-columns-gap: 0.75rem;
  --hub-board-column-width: 220px;
  --hub-board-card-spacer-y: 0.5rem;
  --hub-board-card-spacer-x: 0.75rem;
}
```

---

## Best Practices

- Prefer canonical `--hub-board-*` tokens for customizations.
- Keep tokens on the component's host element or a parent container.
- Override `--hub-sys-*` tokens for consistent cross-component theming.
- Prefer token overrides over direct selector overrides for maintainability.
