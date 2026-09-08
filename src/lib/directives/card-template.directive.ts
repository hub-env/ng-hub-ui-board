import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive that allows customization of card templates within board columns.
 *
 * This directive is used to define custom templates for rendering board cards.
 * It provides access to the template reference that can be used by the board component
 * to render cards with custom layouts and styling.
 *
 * @publicApi
 *
 * @example
 * ```html
 * <ng-template cardTpt let-card="item" let-column="column">
 *   <div class="custom-card">
 *     <h3>{{ card.title }}</h3>
 *     <p>{{ card.description }}</p>
 *   </div>
 * </ng-template>
 * ```
 */
@Directive({
	selector: '[cardTpt]',
	standalone: true
})
export class HubCardTemplateDirective {
	/**
	 * Creates a new HubCardTemplateDirective instance.
	 *
	 * @param templateRef - The template reference that contains the custom card layout
	 */
	constructor(public templateRef: TemplateRef<unknown>) {}
}
