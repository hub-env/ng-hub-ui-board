/*
 * Public API Surface of board
 */

// module
export * from './lib/board.module';

// directives
export * from './lib/directives/board-column-footer.directive';
export * from './lib/directives/board-column-header.directive';
export * from './lib/directives/card-drag-preview.directive';
export * from './lib/directives/card-placeholder.directive';
export * from './lib/directives/card-template.directive';
export * from './lib/directives/column-drag-preview.directive';
export * from './lib/directives/column-placeholder.directive';

// components
export * from './lib/components/board/board.component';

// pipes
export * from './lib/pipes/invert-color.pipe';

// models
export * from './lib/models/array-helpers';
export * from './lib/models/board';
export * from './lib/models/board-card';
export * from './lib/models/board-column';
export * from './lib/models/drag-drop-event';
export * from './lib/models/reached-end-event';

// ─── Deprecated aliases ───────────────────────────────────────────────────────
// Every class in the family carries the `Hub` prefix, so a consumer importing several
// packages into one file cannot end up with two `CardTemplateDirective`s. The classes
// behind these aliases are unchanged; only the exported names move.
// `InvertColorPipe` is not here: it keeps its own class in `pipes/invert-color.pipe.ts`
// because a pipe's template name travels with the class and cannot be re-exported.

/** @deprecated Renamed to `HubBoardModule`, and removed under this name in **23.0.0**. */
export { HubBoardModule as BoardModule } from './lib/board.module';
/** @deprecated Renamed to `HubBoardColumnFooterDirective`, and removed under this name in **23.0.0**. */
export { HubBoardColumnFooterDirective as BoardColumnFooterDirective } from './lib/directives/board-column-footer.directive';
/** @deprecated Renamed to `HubBoardColumnHeaderDirective`, and removed under this name in **23.0.0**. */
export { HubBoardColumnHeaderDirective as BoardColumnHeaderDirective } from './lib/directives/board-column-header.directive';
/** @deprecated Renamed to `HubCardDragPreviewDirective`, and removed under this name in **23.0.0**. */
export { HubCardDragPreviewDirective as CardDragPreviewDirective } from './lib/directives/card-drag-preview.directive';
/** @deprecated Renamed to `HubCardPlaceholderDirective`, and removed under this name in **23.0.0**. */
export { HubCardPlaceholderDirective as CardPlaceholderDirective } from './lib/directives/card-placeholder.directive';
/** @deprecated Renamed to `HubCardTemplateDirective`, and removed under this name in **23.0.0**. */
export { HubCardTemplateDirective as CardTemplateDirective } from './lib/directives/card-template.directive';
/** @deprecated Renamed to `HubColumnDragPreviewDirective`, and removed under this name in **23.0.0**. */
export { HubColumnDragPreviewDirective as ColumnDragPreviewDirective } from './lib/directives/column-drag-preview.directive';
/** @deprecated Renamed to `HubColumnPlaceholderDirective`, and removed under this name in **23.0.0**. */
export { HubColumnPlaceholderDirective as ColumnPlaceholderDirective } from './lib/directives/column-placeholder.directive';
