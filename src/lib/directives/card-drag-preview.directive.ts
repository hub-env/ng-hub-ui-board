import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive that allows customization of the drag preview (drag image) for cards.
 *
 * This directive defines a custom template for the visual element that follows
 * the cursor when dragging a card. The template receives the dragged card and
 * the source column as context variables.
 *
 * @publicApi
 *
 * @example
 * ```html
 * <hub-board [board]="board">
 *   <ng-template cardDragPreview let-card="card" let-column="column">
 *     <div class="custom-drag-preview">
 *       <i class="bi bi-grip-vertical"></i>
 *       <span>{{ card.title }}</span>
 *     </div>
 *   </ng-template>
 * </hub-board>
 * ```
 */
@Directive({
	selector: '[cardDragPreview]',
	standalone: true
})
export class HubCardDragPreviewDirective {
	/**
	 * Creates a new HubCardDragPreviewDirective instance.
	 *
	 * @param templateRef - The template reference that contains the custom drag preview layout
	 */
	constructor(public templateRef: TemplateRef<unknown>) {}
}
