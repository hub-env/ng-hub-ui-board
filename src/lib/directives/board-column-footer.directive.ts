import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive that allows customization of column footer templates within board columns.
 *
 * This directive enables developers to define custom templates for column footers,
 * perfect for displaying summary information, quick actions, statistics,
 * or any column-specific controls at the bottom of each column.
 *
 * @publicApi
 *
 * @example
 * ```html
 * <ng-template columnFooterTpt let-column="column">
 *   <div class="custom-footer">
 *     <div class="column-summary">
 *       <span>Total: {{ column.cards.length }}</span>
 *       <span>Priority Items: {{ getPriorityItems(column) }}</span>
 *     </div>
 *     <button (click)="quickAddCard(column)">Quick Add</button>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
	selector: '[columnFooterTpt]',
	standalone: true
})
export class HubBoardColumnFooterDirective {
	/**
	 * Creates a new HubBoardColumnFooterDirective instance.
	 *
	 * @param templateRef - The template reference that contains the custom column footer layout
	 */
	constructor(public templateRef: TemplateRef<unknown>) {}
}
