import { Directive } from '@angular/core';

/**
 * Structural directive used to define a custom placeholder template for columns during drag operations.
 *
 * When a column is being dragged, the placeholder shows where the column will be dropped.
 * By default, an empty space with a dashed border is shown. Use this directive to customize
 * the placeholder appearance.
 *
 * @usageNotes
 *
 * ### Basic usage
 *
 * ```html
 * <hub-board [board]="board">
 *   <ng-template columnPlaceholder let-column="column">
 *     <div class="my-custom-placeholder">
 *       <span>Drop "{{ column?.title }}" here</span>
 *     </div>
 *   </ng-template>
 * </hub-board>
 * ```
 *
 * ### Context variables
 *
 * The template context provides:
 * - `column`: The column being dragged (may be undefined)
 *
 * @publicApi
 */
@Directive({
	selector: '[columnPlaceholder]',
	standalone: true
})
export class HubColumnPlaceholderDirective {}
