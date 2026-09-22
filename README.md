# ng-hub-ui-board

[Español](./README.es.md) | **English**

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-board.svg)](https://www.npmjs.com/package/ng-hub-ui-board)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-22-red.svg)](https://angular.dev)

> An Angular Kanban board component with Trello-like drag-and-drop, customizable columns, and straightforward event handling.

## Documentation and Live Examples

This package is part of [Hub UI](https://hubui.dev/en/), a collection of Angular component libraries for standalone apps.

- Docs: https://hubui.dev/en/board/overview/
- Live examples: https://hubui.dev/en/board/examples/
- Hub UI: https://hubui.dev/en/
- Hub UI on GitHub (issues, roadmap and contributing): https://github.com/hub-env/hub-ui

## 🧩 Library Family `ng-hub-ui`

This library is part of the **ng-hub-ui** ecosystem:

- [ng-hub-ui-accordion](https://www.npmjs.com/package/ng-hub-ui-accordion) (deprecated — use ng-hub-ui-panels)
- [ng-hub-ui-action-sheet](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [ng-hub-ui-avatar](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [ng-hub-ui-board](https://www.npmjs.com/package/ng-hub-ui-board) ← You are here
- [ng-hub-ui-breadcrumbs](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [ng-hub-ui-calendar](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [ng-hub-ui-dropdown](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [ng-hub-ui-ds](https://www.npmjs.com/package/ng-hub-ui-ds)
- [ng-hub-ui-forms](https://www.npmjs.com/package/ng-hub-ui-forms)
- [ng-hub-ui-history](https://www.npmjs.com/package/ng-hub-ui-history)
- [ng-hub-ui-milestones](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [ng-hub-ui-modal](https://www.npmjs.com/package/ng-hub-ui-modal)
- [ng-hub-ui-nav](https://www.npmjs.com/package/ng-hub-ui-nav)
- [ng-hub-ui-paginable](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [ng-hub-ui-panels](https://www.npmjs.com/package/ng-hub-ui-panels)
- [ng-hub-ui-portal](https://www.npmjs.com/package/ng-hub-ui-portal)
- [ng-hub-ui-skeleton](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [ng-hub-ui-sortable](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [ng-hub-ui-stepper](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [ng-hub-ui-utils](https://www.npmjs.com/package/ng-hub-ui-utils)

## Description

A flexible and powerful board component for Angular applications, perfect for implementing Kanban-style boards, task management systems, or any drag-and-drop card-based interface. Similar to Trello boards, this component allows you to create interactive columns with draggable cards.

## Features

- 🎯 **Standalone component** - Modern Angular approach with minimal setup
- 🔄 **Native drag and drop** - Built on the in-ecosystem `ng-hub-ui-utils` core, with no third-party UI or CDK dependencies
- 🎨 **Fully customizable drag visuals** - Custom templates for drag previews and drop placeholders
- ⚙️ **Configurable drag behavior** - Choose between ghost, hide, or collapse modes for dragged elements
- 📱 **Responsive design** - Works seamlessly across desktop, tablet, and mobile devices
- 🎭 **Highly customizable** - Custom templates for cards, headers, footers, and drag interactions
- 🔧 **Bootstrap compatible** - Integrates perfectly with Bootstrap 5 design system
- ♾️ **Infinite scroll** - End-of-column detection through the `reachedEnd` output, for lazy-loading more cards
- 🎨 **Custom styling** - CSS custom properties for easy theming and customization
- 🔒 **Granular control** - Enable/disable functionality at board, column, or card level
- 🏷️ **TypeScript support** - Full type safety with generic interfaces
- ♿ **Keyboard accessible** - Full keyboard card reorder with ARIA list semantics and screen-reader announcements
- 🪶 **Lightweight** - No third-party UI or CDK dependencies; relies only on the shared `ng-hub-ui-utils` core

## Installation

```bash
# Install the component and its required peer dependency
npm install ng-hub-ui-board ng-hub-ui-utils
```

Or using yarn:

```bash
yarn add ng-hub-ui-board ng-hub-ui-utils
```

**Note:** `@angular/cdk` is not required. The board uses the shared `ng-hub-ui-utils` native drag-and-drop core (a mandatory peer dependency since `22.1.0`) — there are no third-party UI or CDK dependencies.

`ng-hub-ui-ds` is an **optional** peer dependency (`>=22.0.0`). Install it to give the board the shared `--hub-sys-*` token palette and dark mode; without it every token read falls back to the built-in default and the board renders unchanged.

## Upgrading from 21.0.x

`21.1.0` removed the public stylesheet entry point: the styles now live inside the component. Read [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) before upgrading from an earlier version.

## Quick Start

Here’s a quick example to get you started with `ng-hub-ui-board` using the standalone component approach.

### 1. Setup your board model

```ts
import { signal } from '@angular/core';
import { Board } from 'ng-hub-ui-board';

export const board = signal<Board>({
	title: 'Project Sprint',
	columns: [
		{
			title: 'To Do',
			cards: [
				{ title: 'Login page', description: 'Build login form with validation' },
				{ title: 'Landing hero', description: 'Implement hero section' }
			]
		},
		{
			title: 'In Progress',
			cards: [{ title: 'Set up CI/CD', description: 'Add GitHub Actions' }]
		},
		{
			title: 'Done',
			cards: [{ title: 'Project scaffold', description: 'Initial Angular setup' }]
		}
	]
});
```

### 2. Create your component

```ts
import { Component } from '@angular/core';
import {
	HubBoardComponent,
	HubCardTemplateDirective,
	HubBoardColumnHeaderDirective,
	HubBoardColumnFooterDirective,
	BoardCard
} from 'ng-hub-ui-board';

@Component({
	selector: 'board-demo',
	standalone: true,
	imports: [HubBoardComponent, HubCardTemplateDirective, HubBoardColumnHeaderDirective, HubBoardColumnFooterDirective],
	templateUrl: './board-demo.component.html'
})
export class BoardDemoComponent {
	board = board;

	handleCardClick(card: BoardCard) {
		console.log('Card clicked:', card);
	}

	handleCardMoved(event: any) {
		console.log('Card moved:', event);
	}
}
```

### 3. Use in your template

```html
<hub-board [board]="board()" (onCardClick)="handleCardClick($event)" (onCardMoved)="handleCardMoved($event)">
	<ng-template cardTpt let-card="item">
		<strong>{{ card.title }}</strong>
		<p>{{ card.description }}</p>
	</ng-template>
</hub-board>
```

This code block provides a minimal and functional example for both beginners and intermediate users.

## Usage

The component can be used in two ways:

### 1. Standalone Component Import (Recommended)

```typescript
import { Component } from '@angular/core';
import {
	HubBoardComponent,
	HubCardTemplateDirective,
	HubBoardColumnHeaderDirective,
	HubBoardColumnFooterDirective
} from 'ng-hub-ui-board';

@Component({
	selector: 'app-my-component',
	standalone: true,
	imports: [HubBoardComponent, HubCardTemplateDirective, HubBoardColumnHeaderDirective, HubBoardColumnFooterDirective],
	template: `
		<hub-board [board]="board" (onCardClick)="handleCardClick($event)" (onCardMoved)="handleCardMoved($event)">
			<!-- Templates go here -->
		</hub-board>
	`
})
export class MyComponent {
	// ... component logic
}
```

### 2. Module Import (Legacy)

```typescript
import { NgModule } from '@angular/core';
import { HubBoardModule } from 'ng-hub-ui-board';

@NgModule({
	imports: [HubBoardModule]
	// ... rest of the module configuration
})
export class AppModule {}
```

## Templates

The component uses multiple templates for customization. If you're using the standalone approach, remember to import the corresponding directives for each template you plan to use.

### Standard Templates

### Card Template (HubCardTemplateDirective)

Used to customize how each card is rendered within the columns. This template gives you complete control over the card's appearance and structure.

```html
<ng-template cardTpt let-card="item">
	<div class="custom-card">
		<h3>{{ card.title }}</h3>
		<p>{{ card.description }}</p>
		<div class="card-metadata">
			<span class="priority">{{ card.data?.priority }}</span>
			<span class="due-date">{{ card.data?.dueDate | date }}</span>
		</div>
	</div>
</ng-template>
```

### Column Header Template (HubBoardColumnHeaderDirective)

Used to customize the header of each column. Perfect for adding column-specific actions, showing card counts, or adding filtering options.

```html
<ng-template columnHeaderTpt let-column="column">
	<div class="custom-header">
		<h2>{{ column.title }}</h2>
		<span class="card-count">{{ column.cards.length }} items</span>
		<div class="column-actions">
			<button (click)="addCard(column)">Add Card</button>
			<button (click)="filterColumn(column)">Filter</button>
		</div>
	</div>
</ng-template>
```

### Column Footer Template (HubBoardColumnFooterDirective)

Used to add a footer to each column. Useful for summary information, quick actions, or column-specific controls.

```html
<ng-template columnFooterTpt let-column="column">
	<div class="custom-footer">
		<div class="column-summary">
			<span>Total: {{ column.cards.length }}</span>
			<span>Priority Items: {{ getPriorityItems(column) }}</span>
		</div>
		<button (click)="quickAddCard(column)">Quick Add</button>
	</div>
</ng-template>
```

### Drag-and-Drop Templates

#### Card Drag Preview Template (HubCardDragPreviewDirective)

Customize the visual element that follows the cursor when dragging cards. The template receives the dragged card and its source column as context.

```html
<ng-template cardDragPreview let-card="card" let-column="column">
	<div class="custom-drag-preview">
		<div class="preview-header">
			<span class="badge">{{ column.title }}</span>
		</div>
		<h4>{{ card.title }}</h4>
		<p class="preview-description">{{ card.description }}</p>
	</div>
</ng-template>
```

**Context variables:**

- `card`: The card being dragged
- `column`: The source column of the card

#### Card Placeholder Template (HubCardPlaceholderDirective)

Customize the drop zone appearance when dragging cards between or within columns.

```html
<ng-template cardPlaceholder>
	<div class="custom-card-placeholder">
		<span class="placeholder-icon">📥</span>
		<p>Drop card here</p>
	</div>
</ng-template>
```

#### Column Drag Preview Template (HubColumnDragPreviewDirective)

Customize the visual element that follows the cursor when dragging columns. The template receives the dragged column as context.

```html
<ng-template columnDragPreview let-column="column">
	<div class="custom-column-preview">
		<h3>{{ column.title }}</h3>
		<span class="card-count">{{ column.cards.length }} cards</span>
	</div>
</ng-template>
```

**Context variable:**

- `column`: The column being dragged

#### Column Placeholder Template (HubColumnPlaceholderDirective)

Customize the drop zone appearance when reordering columns.

```html
<ng-template columnPlaceholder>
	<div class="custom-column-placeholder">
		<span class="placeholder-text">Drop column here</span>
	</div>
</ng-template>
```

## Events

The `HubBoardComponent` emits several events to help you interact with user actions such as clicking cards, moving items, or reaching scroll limits.

### onCardClick

Emitted when a card is clicked.

```html
<hub-board [board]="board" (onCardClick)="handleCardClick($event)"> </hub-board>
```

**Type:** `OutputEmitterRef<BoardCard>`

**Example:**

```ts
handleCardClick(card: BoardCard) {
  console.log('Card clicked:', card.title);
}
```

---

### onCardMoved

Emitted when a card is moved either within the same column or between columns.

```html
<hub-board [board]="board" (onCardMoved)="handleCardMoved($event)"> </hub-board>
```

**Type:** `OutputEmitterRef<CardDragDropEvent>`

**Example:**

```ts
import { CardDragDropEvent } from 'ng-hub-ui-board';

handleCardMoved(event: CardDragDropEvent) {
  const card = event.item.data;
  const from = event.previousContainer.data;
  const to = event.container.data;

  console.log(`Moved "${card.title}" from "${from.title}" to "${to.title}"`);
}
```

---

### onColumnMoved

Emitted when a column is reordered via drag and drop.

```html
<hub-board [board]="board" (onColumnMoved)="handleColumnMoved($event)"> </hub-board>
```

**Type:** `OutputEmitterRef<ColumnDragDropEvent>`

**Example:**

```ts
import { ColumnDragDropEvent } from 'ng-hub-ui-board';

handleColumnMoved(event: ColumnDragDropEvent) {
  console.log(`Column moved from ${event.previousIndex} to ${event.currentIndex}`);
}
```

---

### reachedEnd

Emitted when a user scrolls to the end of a column. Useful for triggering lazy-loading of additional cards.

```html
<div style="height: 512px;">
	<hub-board [board]="board" (reachedEnd)="loadMoreCards($event)"></hub-board>
</div>
```

**Type:** `OutputEmitterRef<ReachedEndEvent<BoardColumn>>`

**Event Structure:**

```typescript
interface ReachedEndEvent<T = any> {
	index: number; // Index of the column that reached the end
	data: T; // The BoardColumn object itself
}
```

**Example:**

```ts
loadMoreCards(event: ReachedEndEvent) {
  const columnIndex = event.index;
  const column = event.data;  // event.data is the BoardColumn object

  if (!column) {
    return;
  }

  console.log(`Loading more cards for column: ${column.title}`);

  // Simulate API call to load more cards
  setTimeout(() => {
    const newCards = this.generateCards(5);

    // Update the board with new cards
    this.board.update(currentBoard => ({
      ...currentBoard,
      columns: currentBoard.columns?.map((col, index) =>
        index === columnIndex
          ? { ...col, cards: [...col.cards, ...newCards] }
          : col
      ) || []
    }));
  }, 1000);
}
```

> ℹ️ **Important:** To enable scroll detection, the board must be placed inside a container with a fixed height constraint.

## Keyboard & accessibility

The board exposes ARIA list semantics: the host is a `role="region"` named by the `boardLabel` input (default `'Board'`), the columns track inside it is a `role="list"` whose items are the columns (`role="listitem"`), each column is a labelled `role="group"`, each column body is a `role="list"` and each card a `role="listitem"`.

Cards can be reordered without a pointer — every enabled card is a tab stop. With a card focused:

- `Space` / `Enter` — **grabs** the card.
- While grabbed, `ArrowUp` / `ArrowDown` move it within its column and `ArrowLeft` / `ArrowRight` move it to the adjacent column, honouring the same rules as dragging (the target column's `predicate` and `cardSortingDisabled`). Each move is applied live and focus follows the card.
- `Space` / `Enter` — **drops** (commits) the move, emitting `onCardMoved` with the exact same `CardDragDropEvent` payload as a pointer drop.
- `Escape` — **cancels**, restoring the card to its original position with no event emitted.

A visually hidden `aria-live="polite"` region announces grabs, moves, drops, cancels and rejected targets. Announcer messages are English-only for now; i18n/customisation is tracked as future work. Column reordering remains pointer-only.

## Inputs

The following inputs are available on the `HubBoardComponent`:

| Input                   | Type            | Description                                                                                            | Default      |
| ----------------------- | --------------- | ------------------------------------------------------------------------------------------------------ | ------------ |
| `board`                 | `Board`         | The board object containing columns and cards                                                          | `undefined`  |
| `boardLabel`            | `string`        | Accessible name (`aria-label`) of the board container                                             | `'Board'`    |
| `columnSortingDisabled` | `boolean`       | Disables drag-and-drop sorting of columns                                                              | `false`      |
| `dragBehavior`          | `DragBehavior`  | Controls how dragged elements behave visually: `'ghost'` (semi-transparent), `'hide'`, or `'collapse'` | `'collapse'` |
| `variant`               | `string`        | Semantic accent of the drag/drop placeholder. Built-in values (`'primary'` / `'success'` / `'danger'` / `'warning'` / `'info'`) use the exact design-system tints; any other bareword is read as `--hub-sys-color-<variant>` from the host application, and a literal colour (`#hex`, `rgb()`, `oklch()`, `var()`) is passed through unchanged | `undefined`  |

## Outputs

These outputs are emitted by the component during user interaction:

| Output          | Type                                    | Description                                                               |
| --------------- | --------------------------------------- | ------------------------------------------------------------------------- |
| `onCardClick`   | `OutputEmitterRef<BoardCard>`           | Triggered when a card is clicked                                          |
| `onCardMoved`   | `OutputEmitterRef<CardDragDropEvent>`   | Emitted when a card is moved (within or across columns)                   |
| `onColumnMoved` | `OutputEmitterRef<ColumnDragDropEvent>` | Emitted when a column is reordered via drag and drop                      |
| `reachedEnd`    | `OutputEmitterRef<ReachedEndEvent>`     | Triggered when the user scrolls to the bottom of a column (for lazy load) |

## Interfaces

### Board

Main container interface that represents the entire board structure. Used to define the overall board configuration including its columns and general styling.

```typescript
interface Board<T = any> {
	id?: number;
	title: string;
	description?: string;
	columns?: BoardColumn<T>[];
	classlist?: string[];
	style?: { [key: string]: any };
}
```

### BoardColumn

Represents a single column in the board. Used to configure individual columns, their cards, and column-specific behavior like drag-and-drop rules.

```typescript
interface BoardColumn<T = any> {
	id?: number;
	boardId?: number;
	title: string;
	description?: string;
	cards: BoardCard<T>[];
	style?: { [key: string]: any };
	classlist?: string[] | string;
	disabled?: boolean;
	data?: any;
	cardSortingDisabled?: boolean;
	predicate?: (item?: BoardDragItem<T>) => boolean;
}
```

### BoardCard

Represents individual cards within columns. Used to define card content and behavior, including custom data and styling.

```typescript
interface BoardCard<T = any> {
	id?: number;
	columnId?: number;
	title: string;
	description?: string;
	data?: T;
	classlist?: string[];
	style?: { [key: string]: any };
	disabled?: boolean;
}
```

### CardDragDropEvent

Event interface emitted when a card is moved. Provides all information about the drag-and-drop operation.

```typescript
interface CardDragDropEvent<T = any> {
	previousIndex: number;
	currentIndex: number;
	container: BoardDropContainer<BoardColumn>;
	previousContainer: BoardDropContainer<BoardColumn>;
	item: BoardDragItem<BoardCard>;
	isPointerOverContainer: boolean;
	distance?: { x: number; y: number };
	dropPoint?: { x: number; y: number };
}
```

### ColumnDragDropEvent

Event interface emitted when a column is moved. Provides all information about the column reordering operation.

```typescript
interface ColumnDragDropEvent {
	previousIndex: number;
	currentIndex: number;
	container: BoardDropContainer<BoardColumn[]>;
	previousContainer: BoardDropContainer<BoardColumn[]>;
	item: BoardDragItem<BoardColumn>;
	isPointerOverContainer: boolean;
	distance?: { x: number; y: number };
	dropPoint?: { x: number; y: number };
}
```

### DragBehavior

Type definition for controlling how dragged elements behave visually during drag operations.

```typescript
type DragBehavior = 'ghost' | 'hide' | 'collapse';
```

**Values:**

- `'ghost'`: Element becomes semi-transparent (50% opacity) but remains visible
- `'hide'`: Element is hidden but still occupies its space (invisible placeholder)
- `'collapse'`: Element is completely hidden and its space is collapsed (default)

## 🧩 Styling

`ng-hub-ui-board` is fully style-configurable through CSS custom properties.

For a complete and up-to-date token catalog, see [CSS Variables Reference](./docs/css-variables-reference.md).

There is no stylesheet to import: since `21.1.0` the styles are encapsulated in the component itself. If a global `styles.scss` still carries `@use 'ng-hub-ui-board/src/lib/styles/board.scss'` from an earlier version, delete it — that file no longer ships. The `ng-hub-ui-board/styles` entry point exists only for the Sass theming mixin below and emits no CSS of its own.

### 🎨 Semantic accent (`variant`)

The drag/drop placeholder is driven by a single accent token. Pass the `variant` input to recolour the drop zone with a semantic accent:

```html
<hub-board [board]="board()" variant="success"></hub-board>
```

Built-in variants (`primary` / `success` / `danger` / `warning` / `info`) use the exact design-system tints. Any other bareword is also accepted — the board reads `--hub-sys-color-<variant>` from the host application, so a custom accent palette interconnects with no changes to this library — and since `22.3.0` a literal colour (`#hex`, `rgb()`, `oklch()`, `var()`) is passed through unchanged. The input itself has no default; with no `variant` set the placeholder keeps the primary accent.

Under the hood this re-bases the new `--hub-board-accent` token (and its subtle tint `--hub-board-accent-subtle`, derived via `color-mix`), through which the placeholder border and background colours resolve:

| Token                        | Description                                                                |
| ---------------------------- | -------------------------------------------------------------------------- |
| `--hub-board-accent`         | Semantic accent of the drag/drop placeholder (re-based per `variant`)      |
| `--hub-board-accent-subtle`  | Subtle tint of the accent, used as the placeholder background              |

### 🧵 `hub-board-theme()` Sass mixin

Theme a `<hub-board>` in a single call. Every parameter is optional and defaults to `null`, so only the ones you pass are emitted as `--hub-board-*` overrides; the rest keep their defaults. Token-based, with no Bootstrap dependency.

```scss
@use 'ng-hub-ui-board/styles/mixins/board-theme' as *;

.sprint-board {
	@include hub-board-theme(
		$accent: var(--hub-sys-color-success),
		$column-bg: #f6f8fa,
		$card-border-radius: 0.75rem,
		$columns-gap: 1.25rem
	);
}
```

Available parameters cover the accent, container/column/card colours, borders and radius, columns gap, card padding and shadow.

### 🎛 Quick customization example (framework-agnostic)

```scss
.hub-board {
	--hub-board-columns-gap: 1.25rem;
	--hub-board-column-bg: #f8f9fa;
	--hub-board-card-bg: #ffffff;
	--hub-board-card-border-color: #d0d7de;
	--hub-board-placeholder-border-color: #0d6efd;
}
```

### 🔌 Bootstrap integration (optional)

```scss
.hub-board {
	--hub-board-column-bg: var(--bs-light);
	--hub-board-card-bg: var(--bs-body-bg);
	--hub-board-card-border-color: var(--bs-border-color);
	--hub-board-placeholder-border-color: var(--bs-primary);
}
```

## Real-world Use Cases

The `ng-hub-ui-board` component is versatile and has been used in a variety of real-world applications, such as:

- **Project Management Tools** – Visualize task progress across stages (To Do, In Progress, Done).
- **Support Ticket Boards** – Organize support tickets by urgency, team, or status.
- **Recruitment Pipelines** – Track candidates through different phases of hiring.
- **CRM Systems** – Manage leads and customers in pipeline-style workflows.
- **Editorial Calendars** – Schedule and organize content by publication status.

Each case benefits from customizable columns, card templates, and event outputs to integrate with your app logic.

## Troubleshooting

Here are some common issues and how to resolve them:

### 🔄 Drag and drop not working

- **Check dependencies**: Ensure the `ng-hub-ui-utils` peer dependency is installed (`npm install ng-hub-ui-utils`)
- **Reactive data**: Verify your board data is reactive (using `signal()`, `Observable`, or proper change detection)
- **Browser compatibility**: Ensure your target browsers support the HTML5 Drag and Drop API

### 📏 Scroll detection not triggering `reachedEnd`

- **Height constraints**: The `<hub-board>` element or its parent must have a `max-height` or fixed height
- **Overflow setting**: Ensure `overflow: auto` or `overflow-y: scroll` is applied to enable scrolling
- **Content length**: Make sure there's enough content to actually trigger scrolling

### 🎨 Styles not applying

- **Nothing to import**: the component styles itself. If your global `styles.scss` still has `@use 'ng-hub-ui-board/src/lib/styles/board.scss'` from a version before `21.1.0`, delete it — that file no longer ships.
- **CSS custom properties**: Check that your custom CSS variables follow the `--hub-*` naming convention
- **Style specificity**: Ensure your custom styles have sufficient specificity to override defaults

### 🧩 Templates not rendering

- **Import directives**: When using standalone components, import the template directives:
    ```typescript
    imports: [HubBoardComponent, HubCardTemplateDirective, HubBoardColumnHeaderDirective];
    ```
- **Template syntax**: Verify you're using the correct template selectors (`cardTpt`, `columnHeaderTpt`, `columnFooterTpt`)

### 🛠️ Runtime errors

- **"Cannot read property 'cards' of undefined"**: Initialize your board signal properly:
    ```typescript
    board = signal<Board>({ title: 'My Board', columns: [] });
    ```
- **Type errors**: Ensure your data matches the `Board`, `BoardColumn`, and `BoardCard` interfaces
- **Signal updates**: Use `.set()` or `.update()` methods to modify signal values

### 🎯 Performance issues

- **Large datasets**: Consider implementing virtual scrolling for columns with many cards
- **Memory leaks**: Ensure proper cleanup of event listeners and subscriptions
- **Change detection**: Use `OnPush` change detection strategy when possible

If problems persist, open an issue at: https://github.com/hub-env/hub-ui/issues

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Submit a pull request

## Support the Project

If you find this project helpful and would like to support its development, you can buy me a coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

Your support is greatly appreciated and helps maintain and improve this project!

## Commercial support

These libraries are maintained by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com), a freelance frontend architect working with teams that build and maintain Angular applications.

If your team depends on Hub-UI and needs more than an issue thread can solve, that is my day job: architecture audits, design systems, Angular migrations and team mentoring. For projects that also need design and a full team, I run them through [Frog Hub](https://froghub.es), my development studio.

Have a look at [the services](https://www.carlosmorcillo.com/en/services/) or [tell me about your project](https://www.carlosmorcillo.com/en/contact/).

## License

MIT © [Carlos Morcillo Fernández](https://www.carlosmorcillo.com)

Relicensed from CC BY 4.0 in `22.5.0`; versions published before that keep the grant they shipped under. For full license details, see the [LICENSE](LICENSE) file.

---

Made with ❤️ by [Carlos Morcillo Fernández](https://www.carlosmorcillo.com/)
