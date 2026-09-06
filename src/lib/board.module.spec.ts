import { Component, NgModule, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BoardModule } from './board.module';
import { HubBoardComponent } from './components/board/board.component';

/**
 * Host that consumes the board the way the README's "Module Import (Legacy)" section
 * does: a component declared in an NgModule whose only board-related import is
 * `BoardModule`. Any template directive missing from the module's exports silently
 * fails to match here, leaving the matching `contentChild` undefined.
 */
@Component({
	standalone: false,
	selector: 'hub-board-module-host',
	template: `
		<hub-board>
			<ng-template cardDragPreview let-card="card">{{ card.title }}</ng-template>
			<ng-template columnDragPreview let-column="column">{{ column.title }}</ng-template>
		</hub-board>
	`
})
class BoardModuleHostComponent {
	readonly board = viewChild.required(HubBoardComponent);
}

@NgModule({
	declarations: [BoardModuleHostComponent],
	imports: [BoardModule]
})
class BoardModuleHostModule {}

describe('BoardModule', () => {
	it('matches the drag preview templates it documents', async () => {
		await TestBed.configureTestingModule({
			imports: [BoardModuleHostModule]
		}).compileComponents();

		const fixture = TestBed.createComponent(BoardModuleHostComponent);
		fixture.detectChanges();

		const board = fixture.componentInstance.board();

		expect(board.cardDragPreviewTpt()).toBeTruthy();
		expect(board.columnDragPreviewTpt()).toBeTruthy();
	});
});
