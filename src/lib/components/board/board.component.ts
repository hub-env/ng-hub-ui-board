import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Signal,
	TemplateRef,
	computed,
	contentChild,
	inject,
	input,
	output,
	signal,
	viewChild
} from '@angular/core';
import { HubBoardColumnFooterDirective } from '../../directives/board-column-footer.directive';
import { HubBoardColumnHeaderDirective } from '../../directives/board-column-header.directive';
import { HubCardDragPreviewDirective } from '../../directives/card-drag-preview.directive';
import { HubCardPlaceholderDirective } from '../../directives/card-placeholder.directive';
import { HubCardTemplateDirective } from '../../directives/card-template.directive';
import { HubColumnDragPreviewDirective } from '../../directives/column-drag-preview.directive';
import { HubColumnPlaceholderDirective } from '../../directives/column-placeholder.directive';
import { Board } from '../../models/board';
import { BoardCard } from '../../models/board-card';
import { BoardColumn } from '../../models/board-column';
import { createNativeDragImage, resolveHubAccent } from 'ng-hub-ui-utils';
import { moveItemInArray, transferArrayItem } from '../../models/array-helpers';
import { BoardDragItem, CardDragDropEvent, ColumnDragDropEvent } from '../../models/drag-drop-event';
import { ReachedEndEvent } from '../../models/reached-end-event';

/**
 * Internal interface for tracking drag state.
 */
interface DragState {
	type: 'column' | 'card';
	sourceColumnIndex: number;
	sourceCardIndex?: number;
	item: BoardColumn | BoardCard;
	element?: HTMLElement;
}

/**
 * Internal interface tracking an in-progress keyboard move of a card.
 * Captured when the card is grabbed and updated on every arrow-key move so the
 * original position can be restored when the move is cancelled.
 */
interface KeyboardMoveState {
	/** The card currently grabbed for a keyboard move. */
	card: BoardCard;
	/** Column index the card occupied when it was grabbed. */
	sourceColumnIndex: number;
	/** Card index the card occupied when it was grabbed. */
	sourceCardIndex: number;
	/** Column index the card currently occupies. */
	currentColumnIndex: number;
	/** Card index the card currently occupies. */
	currentCardIndex: number;
}

/**
 * Monotonic counter used to derive unique, SSR-safe ids per board instance.
 */
let nextHubBoardInstanceId = 0;

/**
 * Defines how the dragged element behaves visually during drag operations.
 * - 'ghost': Element becomes semi-transparent but remains visible and occupies space
 * - 'hide': Element is hidden but still occupies space (invisible placeholder)
 * - 'collapse': Element is completely hidden and its space is collapsed
 * @publicApi
 */
export type DragBehavior = 'ghost' | 'hide' | 'collapse';

/**
 * Standalone Kanban-style board component that provides column-based drag-and-drop,
 * custom templates and infinite-scroll detection.
 *
 * @publicApi
 */
@Component({
	selector: 'hub-board, hub-ui-board',
	templateUrl: './board.component.html',
	styleUrl: './board.component.scss',
	imports: [NgClass, NgTemplateOutlet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'hub-board',
		role: 'region',
		'[attr.aria-label]': 'boardLabel()',
		'[attr.data-variant]': 'variant() ?? null',
		'[style.--hub-board-accent]': 'groupAccent()'
	}
})
export class HubBoardComponent {
	/**
	 * Reference to the host element, used to relocate keyboard focus after
	 * Angular re-renders a moved card.
	 */
	private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

	/**
	 * Reactive input containing the full board definition (columns and cards).
	 */
	readonly board = input<Board>();

	/**
	 * Accessible label exposed on the board container through `aria-label`.
	 * It names the host landmark, so a screen-reader user can reach the board
	 * without the consumer having to add a heading of their own.
	 * Defaults to `'Board'`.
	 */
	readonly boardLabel = input<string>('Board');

	/**
	 * Unique, SSR-safe id prefix for this board instance. Used to build stable
	 * element ids (column groups, keyboard hint) that never collide when several
	 * boards coexist on the same page.
	 */
	readonly boardInstanceId = `hub-board-${nextHubBoardInstanceId++}`;

	/**
	 * Id of the visually hidden keyboard usage hint referenced by every
	 * focusable card through `aria-describedby`.
	 */
	readonly keyboardHintId = `${this.boardInstanceId}-keyboard-hint`;

	/**
	 * Semantic accent applied to the drag/drop placeholder. The built-in values
	 * (`primary` / `success` / `danger` / `warning` / `info`) render with the
	 * design-system tints; any other string is also accepted — the board reads
	 * `--hub-sys-color-<variant>` from the host application, so a custom accent
	 * palette interconnects with no changes to this library. Defaults to `primary`.
	 */
	readonly variant = input<'primary' | 'success' | 'danger' | 'warning' | 'info' | (string & {}) | undefined>(undefined);

	/**
	 * Inline accent fed to the board styles through the single `--hub-board-accent`
	 * slot. A bareword — a built-in variant, a registered accent or a CSS named
	 * colour — resolves to `var(--hub-sys-color-<variant>, <variant>)`, so the
	 * design-system token drives the colour when present and the raw word is the
	 * fallback. A literal `#hex` / `rgb()` / `oklch()` / `var()` is passed through
	 * unchanged. Returns `null` when no variant is set, keeping the `primary` default.
	 */
	readonly groupAccent = computed(() => resolveHubAccent(this.variant()));

	/**
	 * Pixel threshold used when determining whether a column has reached scroll end.
	 * Allows for fractional scroll values across different browsers.
	 */
	private readonly scrollDetectionPadding = 1;

	/**
	 * Internal signal to track column updates and force re-renders.
	 */
	private readonly _columnsVersion = signal(0);

	/**
	 * Derived list of board columns exposed as a signal to the template.
	 * Depends on both the board input and internal version counter to ensure
	 * re-renders after in-place array mutations.
	 */
	columns: Signal<Array<BoardColumn>> = computed(() => {
		// Subscribe to version changes to force re-computation after mutations
		this._columnsVersion();
		return this.board()?.columns ?? [];
	});

	/**
	 * When true, column reordering via drag-and-drop is disabled.
	 */
	readonly columnSortingDisabled = input<boolean>(false);

	/**
	 * Controls how dragged elements behave visually during drag operations.
	 * - 'ghost': Element becomes semi-transparent (50% opacity) but remains visible
	 * - 'hide': Element is hidden but still occupies its space
	 * - 'collapse': Element is completely hidden and its space is collapsed (default)
	 */
	readonly dragBehavior = input<DragBehavior>('collapse');

	/**
	 * Custom card template supplied via the `cardTpt` structural directive.
	 */
	readonly cardTpt = contentChild(HubCardTemplateDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom column header template supplied via the `columnHeaderTpt` structural directive.
	 */
	readonly columnHeaderTpt = contentChild(HubBoardColumnHeaderDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom column footer template supplied via the `columnFooterTpt` structural directive.
	 */
	readonly columnFooterTpt = contentChild(HubBoardColumnFooterDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom card placeholder template supplied via the `cardPlaceholder` structural directive.
	 * Used to customize the appearance of the drop zone when dragging cards.
	 */
	readonly cardPlaceholderTpt = contentChild(HubCardPlaceholderDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom column placeholder template supplied via the `columnPlaceholder` structural directive.
	 * Used to customize the appearance of the drop zone when dragging columns.
	 */
	readonly columnPlaceholderTpt = contentChild(HubColumnPlaceholderDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom card drag preview template supplied via the `cardDragPreview` structural directive.
	 * Used to customize the visual element that follows the cursor when dragging cards.
	 * The template receives `card` (the dragged card) and `column` (the source column) as context.
	 */
	readonly cardDragPreviewTpt = contentChild(HubCardDragPreviewDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Custom column drag preview template supplied via the `columnDragPreview` structural directive.
	 * Used to customize the visual element that follows the cursor when dragging columns.
	 * The template receives `column` (the dragged column) as context.
	 */
	readonly columnDragPreviewTpt = contentChild(HubColumnDragPreviewDirective, {
		read: TemplateRef<unknown>
	});

	/**
	 * Reference to the hidden container where drag preview elements are rendered.
	 */
	readonly dragPreviewContainer = viewChild<ElementRef<HTMLElement>>('dragPreviewContainer');

	/**
	 * Disposer for the currently active custom drag preview, or `null`.
	 */
	private dragPreviewDestroy: (() => void) | null = null;

	/**
	 * Emits each time a card is clicked within the board.
	 */
	readonly onCardClick = output<BoardCard>();

	/**
	 * Emits when a card has been repositioned, either within the same column or into another column.
	 */
	readonly onCardMoved = output<CardDragDropEvent<any>>();

	/**
	 * Emits when columns are reordered through drag-and-drop.
	 */
	readonly onColumnMoved = output<ColumnDragDropEvent<any>>();

	/**
	 * Emits when a column body is scrolled to its end, enabling infinite-scroll behaviour.
	 */
	readonly reachedEnd = output<ReachedEndEvent>();

	/**
	 * Internal drag state tracking.
	 */
	readonly dragState = signal<DragState | null>(null);

	/**
	 * Signal for tracking the currently hovered column index during card drag.
	 */
	readonly hoveredColumnIndex = signal<number | null>(null);

	/**
	 * Signal for tracking the drop indicator position within a column.
	 */
	readonly dropIndicatorIndex = signal<number | null>(null);

	/**
	 * Signal for tracking the column drop indicator position.
	 */
	readonly columnDropIndicatorIndex = signal<number | null>(null);

	/**
	 * Signal tracking the in-progress keyboard move of a card, or `null` when
	 * no card is grabbed.
	 */
	readonly keyboardMoveState = signal<KeyboardMoveState | null>(null);

	/**
	 * Message rendered inside the visually hidden `aria-live` region so screen
	 * readers announce keyboard grab, move, drop and cancel actions.
	 */
	readonly announcement = signal<string>('');

	/**
	 * Alternation flag used by {@link announce} so consecutive identical
	 * messages still trigger a live-region announcement.
	 */
	private announcementToggle = false;

	/**
	 * Default predicate that allows any card to be dropped into any column.
	 *
	 * @returns Always `true`, indicating that drop operations are permitted.
	 */
	defaultEnterPredicateFn = () => true;

	/**
	 * Returns the card currently being dragged, if any.
	 *
	 * @returns The dragged card or null if no card is being dragged.
	 */
	get draggedCard(): BoardCard | null {
		const state = this.dragState();
		return state?.type === 'card' ? (state.item as BoardCard) : null;
	}

	/**
	 * Returns the column currently being dragged, if any.
	 *
	 * @returns The dragged column or null if no column is being dragged.
	 */
	get draggedColumn(): BoardColumn | null {
		const state = this.dragState();
		return state?.type === 'column' ? (state.item as BoardColumn) : null;
	}

	/**
	 * Emits the clicked card through {@link onCardClick}.
	 *
	 * @param item - The card that triggered the click event.
	 */
	cardClick(item: BoardCard) {
		this.onCardClick.emit(item);
	}

	/**
	 * Track function for columns to ensure proper re-rendering.
	 * Uses column id if available, otherwise falls back to index.
	 *
	 * @param index - The index of the column.
	 * @param column - The column object.
	 * @returns A unique identifier for the column.
	 */
	trackColumnById(index: number, column: BoardColumn): string | number {
		return (column as any).id ?? index;
	}

	/**
	 * Builds the stable DOM id of a column group. Uses the column id when
	 * available (falling back to its index) prefixed by the board instance id.
	 *
	 * @param index - The index of the column.
	 * @param column - The column object.
	 * @returns A stable, board-scoped element id for the column group.
	 */
	columnGroupId(index: number, column: BoardColumn): string {
		return `${this.boardInstanceId}-column-${this.trackColumnById(index, column)}`;
	}

	/**
	 * Checks if the given card is currently grabbed for a keyboard move.
	 *
	 * @param card - The card to check.
	 * @returns Whether the card is grabbed.
	 */
	isCardGrabbed(card: BoardCard): boolean {
		return this.keyboardMoveState()?.card === card;
	}

	/**
	 * Checks if the given column is currently being dragged.
	 *
	 * @param column - The column to check.
	 * @returns Whether the column is being dragged.
	 */
	isDraggingColumn(column: BoardColumn): boolean {
		const state = this.dragState();
		return state?.type === 'column' && state.item === column;
	}

	/**
	 * Checks if the given card is currently being dragged.
	 *
	 * @param card - The card to check.
	 * @returns Whether the card is being dragged.
	 */
	isDraggingCard(card: BoardCard): boolean {
		const state = this.dragState();
		return state?.type === 'card' && state.item === card;
	}

	/**
	 * Handles the drag start event for columns.
	 *
	 * @param event - The native drag event.
	 * @param column - The column being dragged.
	 * @param columnIndex - The index of the column in the board.
	 */
	onColumnDragStart(event: DragEvent, column: BoardColumn, columnIndex: number): void {
		if (this.columnSortingDisabled() || column.disabled) {
			event.preventDefault();
			return;
		}

		const element = event.currentTarget as HTMLElement;

		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', `column:${columnIndex}`);

			// Use custom drag preview if template is provided
			const previewTemplate = this.columnDragPreviewTpt();
			if (previewTemplate) {
				const previewElement = this.createDragPreview(previewTemplate, { column });
				if (previewElement) {
					event.dataTransfer.setDragImage(previewElement, 0, 0);
				}
			}
		}

		// Set drag state after a micro-delay to allow the browser to capture the drag image
		// before we hide the element
		requestAnimationFrame(() => {
			this.dragState.set({
				type: 'column',
				sourceColumnIndex: columnIndex,
				item: column,
				element
			});
		});
	}

	/**
	 * Handles the drag end event for columns.
	 *
	 * @param _event - The native drag event (unused).
	 */
	onColumnDragEnd(_event: DragEvent): void {
		this.destroyDragPreview();
		this.columnDropIndicatorIndex.set(null);
		this.dragState.set(null);
	}

	/**
	 * Handles the drag over event for the board container.
	 * Calculates the drop position based on mouse position relative to columns.
	 *
	 * @param event - The native drag event.
	 */
	onBoardDragOver(event: DragEvent): void {
		const state = this.dragState();
		if (!state || state.type !== 'column') {
			return;
		}

		event.preventDefault();
		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}

		// Find which column we're over based on mouse position
		const boardElement = event.currentTarget as HTMLElement;
		const columnElements = boardElement.querySelectorAll('.hub-board__column-container');
		const mouseX = event.clientX;

		let dropIndex = this.columns().length; // Default to end

		for (let i = 0; i < columnElements.length; i++) {
			const columnElement = columnElements[i] as HTMLElement;
			const rect = columnElement.getBoundingClientRect();
			const columnMiddle = rect.left + rect.width / 2;

			if (mouseX < columnMiddle) {
				dropIndex = i;
				break;
			} else if (mouseX < rect.right) {
				dropIndex = i + 1;
				break;
			}
		}

		this.columnDropIndicatorIndex.set(dropIndex);
	}

	/**
	 * Handles the drop event for the board container (column reordering).
	 *
	 * @param event - The native drag event.
	 */
	onBoardDrop(event: DragEvent): void {
		event.preventDefault();
		const state = this.dragState();

		if (!state || state.type !== 'column') {
			return;
		}

		const dropIndicator = this.columnDropIndicatorIndex();
		if (dropIndicator === null) {
			// No valid drop position - reset state
			this.columnDropIndicatorIndex.set(null);
			this.dragState.set(null);
			return;
		}

		const columns = this.columns();
		const previousIndex = state.sourceColumnIndex;

		// Calculate the actual target index
		// If dropping after the source, we need to subtract 1 because the source will be removed first
		let currentIndex = dropIndicator;
		if (dropIndicator > previousIndex) {
			currentIndex = dropIndicator - 1;
		}

		if (previousIndex !== currentIndex) {
			moveItemInArray(columns, previousIndex, currentIndex);

			// Force re-render by incrementing the version counter
			this._columnsVersion.update((v) => v + 1);

			const dropEvent: ColumnDragDropEvent = {
				previousIndex,
				currentIndex,
				container: { data: columns },
				previousContainer: { data: columns },
				item: { data: state.item as BoardColumn },
				isPointerOverContainer: true
			};

			this.onColumnMoved.emit(dropEvent);
		}

		this.columnDropIndicatorIndex.set(null);
		this.dragState.set(null);
	}

	/**
	 * Handles the drag start event for cards.
	 *
	 * @param event - The native drag event.
	 * @param card - The card being dragged.
	 * @param columnIndex - The index of the column containing the card.
	 * @param cardIndex - The index of the card within the column.
	 */
	onCardDragStart(event: DragEvent, card: BoardCard, columnIndex: number, cardIndex: number): void {
		if (card.disabled) {
			event.preventDefault();
			return;
		}

		event.stopPropagation();

		const element = event.currentTarget as HTMLElement;
		const sourceColumn = this.columns()[columnIndex];

		if (event.dataTransfer) {
			event.dataTransfer.effectAllowed = 'move';
			event.dataTransfer.setData('text/plain', `card:${columnIndex}:${cardIndex}`);

			// Use custom drag preview if template is provided
			const previewTemplate = this.cardDragPreviewTpt();
			if (previewTemplate) {
				const previewElement = this.createDragPreview(previewTemplate, { card, column: sourceColumn });
				if (previewElement) {
					event.dataTransfer.setDragImage(previewElement, 0, 0);
				}
			}
		}

		// Set drag state after a micro-delay to allow the browser to capture the drag image
		// before we hide the element
		requestAnimationFrame(() => {
			this.dragState.set({
				type: 'card',
				sourceColumnIndex: columnIndex,
				sourceCardIndex: cardIndex,
				item: card,
				element
			});
		});
	}

	/**
	 * Handles the drag end event for cards.
	 *
	 * @param _event - The native drag event (unused).
	 */
	onCardDragEnd(_event: DragEvent): void {
		this.destroyDragPreview();
		this.hoveredColumnIndex.set(null);
		this.dropIndicatorIndex.set(null);
		this.dragState.set(null);
	}

	/**
	 * Handles the drag over event for column bodies (card drop zones).
	 *
	 * @param event - The native drag event.
	 * @param column - The column being dragged over.
	 * @param columnIndex - The index of the column.
	 */
	onCardDragOver(event: DragEvent, column: BoardColumn, columnIndex: number): void {
		const state = this.dragState();
		if (!state || state.type !== 'card') {
			return;
		}

		// Check if the column accepts this card via predicate
		const predicate = column.predicate ?? this.defaultEnterPredicateFn;
		const dragItem: BoardDragItem<BoardCard> = { data: state.item as BoardCard, element: state.element };

		if (!predicate(dragItem) || column.cardSortingDisabled) {
			return;
		}

		event.preventDefault();
		event.stopPropagation();

		if (event.dataTransfer) {
			event.dataTransfer.dropEffect = 'move';
		}

		this.hoveredColumnIndex.set(columnIndex);

		// Calculate drop position based on mouse Y position
		const containerElement = event.currentTarget as HTMLElement;
		const cards = containerElement.querySelectorAll('.hub-board__card:not(.hub-board__card--dragging)');
		const mouseY = event.clientY;

		let dropIndex = column.cards.length;

		for (let i = 0; i < cards.length; i++) {
			const cardElement = cards[i] as HTMLElement;
			const rect = cardElement.getBoundingClientRect();
			const cardMiddle = rect.top + rect.height / 2;

			if (mouseY < cardMiddle) {
				// Adjust index to account for the dragged card if in same column
				if (state.sourceColumnIndex === columnIndex && state.sourceCardIndex !== undefined) {
					dropIndex = i <= state.sourceCardIndex ? i : i;
				} else {
					dropIndex = i;
				}
				break;
			}
		}

		this.dropIndicatorIndex.set(dropIndex);
	}

	/**
	 * Handles the drag leave event for column bodies.
	 *
	 * @param event - The native drag event.
	 * @param columnIndex - The index of the column being left.
	 */
	onCardDragLeave(event: DragEvent, columnIndex: number): void {
		const relatedTarget = event.relatedTarget as HTMLElement | null;
		const currentTarget = event.currentTarget as HTMLElement;

		// Only clear if we're actually leaving the container (not entering a child)
		if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
			if (this.hoveredColumnIndex() === columnIndex) {
				this.hoveredColumnIndex.set(null);
				this.dropIndicatorIndex.set(null);
			}
		}
	}

	/**
	 * Handles the drop event for cards.
	 *
	 * @param event - The native drag event.
	 * @param column - The target column.
	 * @param columnIndex - The index of the target column.
	 */
	onCardDrop(event: DragEvent, column: BoardColumn, columnIndex: number): void {
		event.preventDefault();
		event.stopPropagation();

		const state = this.dragState();
		if (!state || state.type !== 'card' || state.sourceCardIndex === undefined) {
			return;
		}

		const columns = this.columns();
		const sourceColumn = columns[state.sourceColumnIndex];
		const targetColumn = column;

		const previousIndex = state.sourceCardIndex;
		let currentIndex = this.dropIndicatorIndex() ?? targetColumn.cards.length;

		// Adjust for same-column moves
		if (state.sourceColumnIndex === columnIndex && previousIndex < currentIndex) {
			currentIndex--;
		}

		const isSameContainer = state.sourceColumnIndex === columnIndex;

		if (isSameContainer) {
			if (previousIndex !== currentIndex) {
				moveItemInArray(targetColumn.cards, previousIndex, currentIndex);
			}
		} else {
			transferArrayItem(sourceColumn.cards, targetColumn.cards, previousIndex, currentIndex);
		}

		// Force re-render by incrementing the version counter
		this._columnsVersion.update((v) => v + 1);

		this.emitCardMoved(sourceColumn, targetColumn, state.item as BoardCard, previousIndex, currentIndex);

		this.hoveredColumnIndex.set(null);
		this.dropIndicatorIndex.set(null);
		this.dragState.set(null);
	}

	/**
	 * Handles keyboard interaction on a card, implementing the keyboard
	 * reordering model:
	 *
	 * - `Space` / `Enter` on a focused card grabs it (or drops it when already
	 *   grabbed, committing the move through the same event path as a pointer
	 *   drop).
	 * - While grabbed, `ArrowUp` / `ArrowDown` move the card within its column
	 *   and `ArrowLeft` / `ArrowRight` move it to the adjacent column,
	 *   respecting the same acceptance rules as the drag path (column
	 *   `predicate` and `cardSortingDisabled`).
	 * - `Escape` cancels the move and restores the original position.
	 *
	 * @param event - The native keyboard event.
	 * @param card - The card that received the key press.
	 * @param columnIndex - The index of the column containing the card.
	 * @param cardIndex - The index of the card within the column.
	 */
	onCardKeydown(event: KeyboardEvent, card: BoardCard, columnIndex: number, cardIndex: number): void {
		if (card.disabled) {
			return;
		}

		const state = this.keyboardMoveState();

		if (!state) {
			if (event.key === ' ' || event.key === 'Enter') {
				this.grabCard(event, card, columnIndex, cardIndex);
			}
			return;
		}

		// Only the grabbed card reacts while a keyboard move is in progress.
		if (state.card !== card) {
			return;
		}

		switch (event.key) {
			case ' ':
			case 'Enter':
				event.preventDefault();
				this.dropGrabbedCard(state);
				break;
			case 'Escape':
				event.preventDefault();
				this.cancelGrabbedCard(state);
				break;
			case 'ArrowUp':
				event.preventDefault();
				this.moveGrabbedCardWithinColumn(state, -1);
				break;
			case 'ArrowDown':
				event.preventDefault();
				this.moveGrabbedCardWithinColumn(state, 1);
				break;
			case 'ArrowLeft':
				event.preventDefault();
				this.moveGrabbedCardToColumn(state, -1);
				break;
			case 'ArrowRight':
				event.preventDefault();
				this.moveGrabbedCardToColumn(state, 1);
				break;
		}
	}

	/**
	 * Grabs a card for a keyboard move, mirroring the drag-start restrictions
	 * (disabled cards and columns with `cardSortingDisabled` cannot start a move).
	 *
	 * @param event - The keyboard event that initiated the grab.
	 * @param card - The card to grab.
	 * @param columnIndex - The index of the column containing the card.
	 * @param cardIndex - The index of the card within the column.
	 */
	private grabCard(event: KeyboardEvent, card: BoardCard, columnIndex: number, cardIndex: number): void {
		const column = this.columns()[columnIndex];
		if (!column || column.cardSortingDisabled) {
			return;
		}

		event.preventDefault();
		this.keyboardMoveState.set({
			card,
			sourceColumnIndex: columnIndex,
			sourceCardIndex: cardIndex,
			currentColumnIndex: columnIndex,
			currentCardIndex: cardIndex
		});
		this.announce(
			`Card "${card.title}" grabbed. Position ${cardIndex + 1} of ${column.cards.length} in "${column.title}". ` +
				`Use the arrow keys to move, Space or Enter to drop, Escape to cancel.`
		);
	}

	/**
	 * Moves the grabbed card one position up or down within its current column.
	 *
	 * @param state - The active keyboard move state.
	 * @param delta - `-1` to move up, `1` to move down.
	 */
	private moveGrabbedCardWithinColumn(state: KeyboardMoveState, delta: -1 | 1): void {
		const column = this.columns()[state.currentColumnIndex];
		const targetIndex = state.currentCardIndex + delta;

		if (!column || targetIndex < 0 || targetIndex >= column.cards.length) {
			return;
		}

		moveItemInArray(column.cards, state.currentCardIndex, targetIndex);
		this._columnsVersion.update((v) => v + 1);
		this.keyboardMoveState.set({ ...state, currentCardIndex: targetIndex });
		this.announce(
			`Card "${state.card.title}" moved to "${column.title}", position ${targetIndex + 1} of ${column.cards.length}.`
		);
		this.focusCard(state.currentColumnIndex, targetIndex);
	}

	/**
	 * Moves the grabbed card to the adjacent column, enforcing the same
	 * acceptance rules as the pointer drag path (the target column `predicate`
	 * and `cardSortingDisabled`).
	 *
	 * @param state - The active keyboard move state.
	 * @param delta - `-1` to move to the previous column, `1` to the next one.
	 */
	private moveGrabbedCardToColumn(state: KeyboardMoveState, delta: -1 | 1): void {
		const columns = this.columns();
		const targetColumnIndex = state.currentColumnIndex + delta;
		const targetColumn = columns[targetColumnIndex];

		if (!targetColumn) {
			return;
		}

		// Enforce the same acceptance rules as the pointer drag-over path.
		const predicate = targetColumn.predicate ?? this.defaultEnterPredicateFn;
		if (!predicate({ data: state.card }) || targetColumn.cardSortingDisabled) {
			this.announce(`Card "${state.card.title}" cannot be moved to "${targetColumn.title}".`);
			return;
		}

		const sourceColumn = columns[state.currentColumnIndex];
		const targetIndex = Math.min(state.currentCardIndex, targetColumn.cards.length);

		transferArrayItem(sourceColumn.cards, targetColumn.cards, state.currentCardIndex, targetIndex);
		this._columnsVersion.update((v) => v + 1);
		this.keyboardMoveState.set({
			...state,
			currentColumnIndex: targetColumnIndex,
			currentCardIndex: targetIndex
		});
		this.announce(
			`Card "${state.card.title}" moved to "${targetColumn.title}", position ${targetIndex + 1} of ${targetColumn.cards.length}.`
		);
		this.focusCard(targetColumnIndex, targetIndex);
	}

	/**
	 * Commits the keyboard move, emitting {@link onCardMoved} through the same
	 * path as a pointer drop. Dropping a card that was never moved is a no-op
	 * (the grab is simply released without emitting).
	 *
	 * @param state - The active keyboard move state.
	 */
	private dropGrabbedCard(state: KeyboardMoveState): void {
		const columns = this.columns();
		const sourceColumn = columns[state.sourceColumnIndex];
		const targetColumn = columns[state.currentColumnIndex];

		this.keyboardMoveState.set(null);

		if (!sourceColumn || !targetColumn) {
			return;
		}

		const moved = state.sourceColumnIndex !== state.currentColumnIndex || state.sourceCardIndex !== state.currentCardIndex;
		if (moved) {
			this.emitCardMoved(sourceColumn, targetColumn, state.card, state.sourceCardIndex, state.currentCardIndex);
		}

		this.announce(
			`Card "${state.card.title}" dropped in "${targetColumn.title}", position ${state.currentCardIndex + 1} of ${targetColumn.cards.length}.`
		);
	}

	/**
	 * Cancels the keyboard move, restoring the card to the position it occupied
	 * when it was grabbed. No {@link onCardMoved} event is emitted.
	 *
	 * @param state - The active keyboard move state.
	 */
	private cancelGrabbedCard(state: KeyboardMoveState): void {
		const columns = this.columns();
		const currentColumn = columns[state.currentColumnIndex];
		const sourceColumn = columns[state.sourceColumnIndex];

		if (currentColumn && sourceColumn) {
			if (state.currentColumnIndex === state.sourceColumnIndex) {
				if (state.currentCardIndex !== state.sourceCardIndex) {
					moveItemInArray(currentColumn.cards, state.currentCardIndex, state.sourceCardIndex);
				}
			} else {
				transferArrayItem(
					currentColumn.cards,
					sourceColumn.cards,
					state.currentCardIndex,
					Math.min(state.sourceCardIndex, sourceColumn.cards.length)
				);
			}
			this._columnsVersion.update((v) => v + 1);
		}

		this.keyboardMoveState.set(null);
		this.announce(`Move cancelled. Card "${state.card.title}" returned to its original position.`);
		this.focusCard(state.sourceColumnIndex, state.sourceCardIndex);
	}

	/**
	 * Builds and emits the {@link onCardMoved} event. Shared by the pointer
	 * drop and keyboard commit paths so both emit an identical payload shape.
	 *
	 * @param sourceColumn - The column the card was moved from.
	 * @param targetColumn - The column the card was moved to.
	 * @param card - The moved card.
	 * @param previousIndex - The card index before the move.
	 * @param currentIndex - The card index after the move.
	 */
	private emitCardMoved(
		sourceColumn: BoardColumn,
		targetColumn: BoardColumn,
		card: BoardCard,
		previousIndex: number,
		currentIndex: number
	): void {
		const dropEvent: CardDragDropEvent = {
			previousIndex,
			currentIndex,
			container: { data: targetColumn },
			previousContainer: { data: sourceColumn },
			item: { data: card },
			isPointerOverContainer: true
		};

		this.onCardMoved.emit(dropEvent);
	}

	/**
	 * Sets the given announcement message on the polite live region. Alternates
	 * a trailing no-break space so consecutive identical messages are still
	 * re-announced by screen readers.
	 *
	 * @param message - The message to announce.
	 */
	private announce(message: string): void {
		this.announcementToggle = !this.announcementToggle;
		this.announcement.set(this.announcementToggle ? message : `${message}\u00A0`);
	}

	/**
	 * Restores keyboard focus to the card at the given coordinates after the
	 * next render. Needed because browsers blur an element when Angular
	 * relocates it in the DOM during a keyboard move. Only ever called from
	 * keyboard handlers, so it is SSR-safe.
	 *
	 * @param columnIndex - The index of the column containing the card.
	 * @param cardIndex - The index of the card within the column.
	 */
	private focusCard(columnIndex: number, cardIndex: number): void {
		requestAnimationFrame(() => {
			const card = this.elementRef.nativeElement.querySelector<HTMLElement>(
				`[data-column-index="${columnIndex}"] .hub-board__card[data-card-index="${cardIndex}"]`
			);
			card?.focus();
		});
	}

	/**
	 * Determines if a column should show the drop indicator.
	 *
	 * @param columnIndex - The index position to check for the drop indicator.
	 * @returns Whether the drop indicator should be shown at this position.
	 */
	shouldShowColumnDropIndicator(columnIndex: number): boolean {
		const state = this.dragState();
		if (state?.type !== 'column') {
			return false;
		}
		return this.columnDropIndicatorIndex() === columnIndex;
	}

	/**
	 * Determines if a card drop indicator should be shown at a specific position.
	 *
	 * @param columnIndex - The index of the column.
	 * @param cardIndex - The index where the indicator would appear.
	 * @returns Whether the drop indicator should be shown.
	 */
	shouldShowCardDropIndicator(columnIndex: number, cardIndex: number): boolean {
		const state = this.dragState();
		if (state?.type !== 'card') {
			return false;
		}

		return this.hoveredColumnIndex() === columnIndex && this.dropIndicatorIndex() === cardIndex;
	}

	/**
	 * Emits {@link reachedEnd} once a column body is scrolled to its bottom.
	 *
	 * @param index - Index of the scrolled column within the board.
	 * @param event - Browser scroll event originating from the column body element.
	 */
	onScroll(index: number, event: Event) {
		const el = event.target as HTMLElement | null;
		if (!el) {
			return;
		}

		const scrolledToBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - this.scrollDetectionPadding;

		if (!scrolledToBottom) {
			return;
		}

		const column = this.board()?.columns?.[index];
		if (!column) {
			return;
		}

		this.reachedEnd.emit({
			index,
			data: column
		});
	}

	/**
	 * Creates a custom drag preview element from a template and renders it in a hidden container.
	 * The element must be in the DOM for setDragImage to work properly.
	 *
	 * @param template - The template to render as the drag preview.
	 * @param context - The context to pass to the template.
	 * @returns The native HTML element to use as the drag image, or null if creation failed.
	 */
	private createDragPreview(template: TemplateRef<unknown>, context: Record<string, unknown>): HTMLElement | null {
		// Destroy any existing preview first.
		this.destroyDragPreview();

		const container = this.dragPreviewContainer();
		if (!container) {
			return null;
		}

		// Render the template into the hidden container using the shared drag-image helper.
		const image = createNativeDragImage(template, context, container.nativeElement);
		if (!image) {
			return null;
		}
		this.dragPreviewDestroy = image.destroy;
		return image.node;
	}

	/**
	 * Destroys the current drag preview view and cleans up related resources. The disposer
	 * returned by `createNativeDragImage` removes both the embedded view and the rendered
	 * nodes, so no manual container clearing is required.
	 */
	private destroyDragPreview(): void {
		this.dragPreviewDestroy?.();
		this.dragPreviewDestroy = null;
	}
}
