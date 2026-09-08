import { NgModule } from '@angular/core';
import { HubBoardComponent } from './components/board/board.component';
import { HubBoardColumnFooterDirective } from './directives/board-column-footer.directive';
import { HubBoardColumnHeaderDirective } from './directives/board-column-header.directive';
import { HubCardDragPreviewDirective } from './directives/card-drag-preview.directive';
import { HubCardPlaceholderDirective } from './directives/card-placeholder.directive';
import { HubCardTemplateDirective } from './directives/card-template.directive';
import { HubColumnDragPreviewDirective } from './directives/column-drag-preview.directive';
import { HubColumnPlaceholderDirective } from './directives/column-placeholder.directive';

/**
 * Angular module that provides board functionality with drag-and-drop support.
 *
 * This module includes all the necessary components and directives for creating
 * Kanban-style boards with customizable columns, cards, and templates.
 *
 * @deprecated Use standalone components instead. Import individual components and directives directly.
 * @publicApi
 *
 * @example
 * ```typescript
 * // Legacy module approach (not recommended)
 * import { HubBoardModule } from 'ng-hub-ui-board';
 *
 * @NgModule({
 *   imports: [HubBoardModule]
 * })
 * export class AppModule {}
 *
 * // Recommended standalone approach
 * import { HubBoardComponent, HubCardTemplateDirective } from 'ng-hub-ui-board';
 *
 * @Component({
 *   standalone: true,
 *   imports: [HubBoardComponent, HubCardTemplateDirective]
 * })
 * export class MyComponent {}
 * ```
 */
@NgModule({
	declarations: [],
	imports: [
		HubBoardComponent,
		HubCardTemplateDirective,
		HubBoardColumnHeaderDirective,
		HubBoardColumnFooterDirective,
		HubCardPlaceholderDirective,
		HubColumnPlaceholderDirective,
		HubCardDragPreviewDirective,
		HubColumnDragPreviewDirective
	],
	exports: [
		HubBoardComponent,
		HubCardTemplateDirective,
		HubBoardColumnHeaderDirective,
		HubBoardColumnFooterDirective,
		HubCardPlaceholderDirective,
		HubColumnPlaceholderDirective,
		HubCardDragPreviewDirective,
		HubColumnDragPreviewDirective
	]
})
export class HubBoardModule {}
