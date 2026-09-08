import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive that allows customization of column header templates within board columns.
 *
 * This directive provides the ability to define custom templates for rendering column headers,
 * giving developers full control over the appearance and functionality of column headers
 * including titles, descriptions, actions, and metadata display.
 *
 * @publicApi
 *
 * @example
 * ```html
 * <ng-template columnHeaderTpt let-column="column">
 *   <div class="custom-header">
 *     <h2>{{ column.title }}</h2>
 *     <span class="card-count">{{ column.cards.length }} items</span>
 *     <button (click)="addCard(column)">Add Card</button>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
	selector: '[columnHeaderTpt]',
	standalone: true
})
export class HubBoardColumnHeaderDirective {
	/**
	 * Creates a new HubBoardColumnHeaderDirective instance.
	 *
	 * @param templateRef - The template reference that contains the custom column header layout
	 */
	constructor(public templateRef: TemplateRef<unknown>) {}
}
