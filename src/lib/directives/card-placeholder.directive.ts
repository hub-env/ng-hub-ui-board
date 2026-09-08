import { Directive } from '@angular/core';

/**
 * Structural directive used to define a custom placeholder template for cards during drag operations.
 *
 * When a card is being dragged, the placeholder shows where the card will be dropped.
 * By default, an empty space with a dashed border is shown. Use this directive to customize
 * the placeholder appearance.
 *
 * @usageNotes
 *
 * ### Basic usage
 *
 * ```html
 * <hub-board [board]="board">
 *   <ng-template cardPlaceholder let-card="card" let-column="column">
 *     <div class="my-custom-placeholder">
 *       <span>Drop "{{ card?.title }}" here</span>
 *     </div>
 *   </ng-template>
 * </hub-board>
 * ```
 *
 * ### Context variables
 *
 * The template context provides:
 * - `card`: The card being dragged (may be undefined)
 * - `column`: The target column where the card will be dropped
 *
 * @publicApi
 */
@Directive({
	selector: '[cardPlaceholder]',
	standalone: true
})
export class HubCardPlaceholderDirective {}
