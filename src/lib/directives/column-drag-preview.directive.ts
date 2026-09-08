import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive that allows customization of the drag preview (drag image) for columns.
 *
 * This directive defines a custom template for the visual element that follows
 * the cursor when dragging a column. The template receives the dragged column
 * as a context variable.
 *
 * @publicApi
 *
 * @example
 * ```html
 * <hub-board [board]="board">
 *   <ng-template columnDragPreview let-column="column">
 *     <div class="custom-column-drag-preview">
 *       <i class="bi bi-kanban"></i>
 *       <span>{{ column.title }}</span>
 *       <span class="badge">{{ column.cards.length }} cards</span>
 *     </div>
 *   </ng-template>
 * </hub-board>
 * ```
 */
@Directive({
	selector: '[columnDragPreview]',
	standalone: true
})
export class HubColumnDragPreviewDirective {
	/**
	 * Creates a new HubColumnDragPreviewDirective instance.
	 *
	 * @param templateRef - The template reference that contains the custom drag preview layout
	 */
	constructor(public templateRef: TemplateRef<unknown>) {}
}
