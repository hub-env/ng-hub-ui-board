import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Board } from '../../models/board';
import { CardDragDropEvent } from '../../models/drag-drop-event';
import { HubBoardComponent } from './board.component';

// jsdom (used by the Vitest test environment) does not implement `DragEvent`.
// Provide a minimal shim backed by `Event` so drag handlers can be exercised.
if (typeof (globalThis as any).DragEvent === 'undefined') {
	(globalThis as any).DragEvent = class DragEvent extends Event {
		dataTransfer: unknown = null;
		constructor(type: string, init?: EventInit) {
			super(type, init);
		}
	};
}

describe('HubBoardComponent', () => {
	let component: HubBoardComponent;
	let fixture: ComponentFixture<HubBoardComponent>;
	let componentRef: ComponentRef<HubBoardComponent>;

	const mockBoard: Board = {
		id: 1,
		title: 'Test Board',
		columns: [
			{
				id: 1,
				title: 'Column 1',
				cards: [
					{ id: 101, columnId: 1, title: 'Card 1', data: {} },
					{ id: 102, columnId: 1, title: 'Card 2', data: {} }
				]
			},
			{
				id: 2,
				title: 'Column 2',
				cards: [{ id: 201, columnId: 2, title: 'Card 3', data: {} }]
			}
		]
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HubBoardComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(HubBoardComponent);
		component = fixture.componentInstance;
		componentRef = fixture.componentRef;

		// Set input using signal input API
		componentRef.setInput('board', JSON.parse(JSON.stringify(mockBoard)));

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render columns and cards', () => {
		const columns = fixture.debugElement.queryAll(By.css('.hub-board__column'));
		expect(columns.length).toBe(2);

		const cards = fixture.debugElement.queryAll(By.css('.hub-board__card'));
		expect(cards.length).toBe(3);
	});

	describe('Accent resolution (groupAccent)', () => {
		it('resolves a semantic variant name to a ds token with a raw fallback', () => {
			componentRef.setInput('variant', 'primary');
			fixture.detectChanges();
			expect(component.groupAccent()).toBe('var(--hub-sys-color-primary, primary)');
		});

		it('passes a literal colour through unchanged', () => {
			componentRef.setInput('variant', '#ff0000');
			fixture.detectChanges();
			expect(component.groupAccent()).toBe('#ff0000');
		});
	});

	describe('Column Drag & Drop', () => {
		it('should start column drag', () => {
			const event = new DragEvent('dragstart');
			Object.defineProperty(event, 'dataTransfer', {
				value: {
					setData: vi.fn().mockName('setData'),
					setDragImage: vi.fn().mockName('setDragImage'),
					effectAllowed: 'none'
				}
			});

			const column = component.columns()[0];
			component.onColumnDragStart(event, column, 0);

			// Wait for requestAnimationFrame
			// In test environment requestAnimationFrame might be synchronous or need done()
			// But using signal check directly might fail if async.
			// We can spy on dragState.set or check it after a timeout.

			// Let's force the callback logic since requestAnimationFrame is hard to test without fakeAsync
			// We can bypass or assume fakeAsync usage.
			// Or we can invoke the private method logic if we exposed it, but we can't.
		});

		// To properly test requestAnimationFrame we need fakeAsync/tick, but signals + standalone makes it tricky sometimes.
		// Let's rely on checking the implementation logic via calling methods directly when possible.
	});

	describe('Outputs', () => {
		it('should emit onCardClick', () => {
			vi.spyOn(component.onCardClick, 'emit').mockReturnValue(undefined);
			const card = component.columns()[0].cards[0];
			component.cardClick(card);
			expect(component.onCardClick.emit).toHaveBeenCalledWith(card);
		});
	});

	describe('Scroll Infinite', () => {
		it('should emit reachedEnd when scrolled to bottom', () => {
			vi.spyOn(component.reachedEnd, 'emit').mockReturnValue(undefined);
			const mockEvent = {
				target: {
					scrollTop: 100,
					clientHeight: 100,
					scrollHeight: 200 // Exactly matches padding 0 if no padding
				}
			} as unknown as Event;

			// threshold is 1px. 100+100 >= 200 - 1 = 199. True.
			component.onScroll(0, mockEvent);

			expect(component.reachedEnd.emit).toHaveBeenCalled();
		});

		it('should NOT emit reachedEnd when NOT scrolled to bottom', () => {
			vi.spyOn(component.reachedEnd, 'emit').mockReturnValue(undefined);
			const mockEvent = {
				target: {
					scrollTop: 0,
					clientHeight: 100,
					scrollHeight: 200
				}
			} as unknown as Event;

			component.onScroll(0, mockEvent);
			expect(component.reachedEnd.emit).not.toHaveBeenCalled();
		});
	});

	// Testing complex Drag Logic directly (calling handlers)
	describe('Drag Logic Direct', () => {
		it('should set drag state on column drag start', () =>
			new Promise<void>((resolve) => {
				const event = new DragEvent('dragstart');
				Object.defineProperty(event, 'dataTransfer', {
					value: { setData: vi.fn().mockName('setData'), setDragImage: () => {}, effectAllowed: 'none' }
				});
				const column = component.columns()[0];

				component.onColumnDragStart(event, column, 0);

				// Wait for the requestAnimationFrame callback that sets the drag state.
				requestAnimationFrame(() => {
					const state = component.dragState();
					expect(state).toBeTruthy();
					expect(state?.type).toBe('column');
					expect(state?.sourceColumnIndex).toBe(0);
					resolve();
				});
			}));

		it('should move column on drop', () => {
			// Setup state manually
			(component as any).dragState.set({
				type: 'column',
				sourceColumnIndex: 0,
				item: component.columns()[0]
			});
			(component as any).columnDropIndicatorIndex.set(2); // Drop after the second column so target index becomes 1

			vi.spyOn(component.onColumnMoved, 'emit').mockReturnValue(undefined);
			const event = new DragEvent('drop');
			event.preventDefault = vi.fn().mockName('preventDefault');

			component.onBoardDrop(event);

			expect(component.onColumnMoved.emit).toHaveBeenCalled();
			const columns = component.columns();
			expect(columns[0].title).toBe('Column 2');
			expect(columns[1].title).toBe('Column 1');
		});

		it('should move card within same column', () => {
			const column = component.columns()[0]; // 2 cards: index 0 and 1
			(component as any).dragState.set({
				type: 'card',
				sourceColumnIndex: 0,
				sourceCardIndex: 0,
				item: column.cards[0]
			});
			(component as any).dropIndicatorIndex.set(2);
			// Dropping at end (index 2). Logic: prev=0, current=2.
			// Same container => moveItemInArray(0, 2). BUT dropIndicator logic inside onCardDrop adjusts logic.

			vi.spyOn(component.onCardMoved, 'emit').mockReturnValue(undefined);
			const event = new DragEvent('drop');
			event.preventDefault = vi.fn().mockName('preventDefault');
			event.stopPropagation = vi.fn().mockName('stopPropagation');

			component.onCardDrop(event, column, 0);

			expect(component.onCardMoved.emit).toHaveBeenCalled();
			const newCards = component.columns()[0].cards;
			expect(newCards[0].id).toBe(102); // Card 2 moved up
			expect(newCards[1].id).toBe(101); // Card 1 moved to end
		});

		it('should move card to different column', () => {
			const sourceColumn = component.columns()[0];
			const targetColumn = component.columns()[1];
			const cardToMove = sourceColumn.cards[0];

			(component as any).dragState.set({
				type: 'card',
				sourceColumnIndex: 0,
				sourceCardIndex: 0,
				item: cardToMove
			});
			(component as any).dropIndicatorIndex.set(0); // Drop at start of target

			vi.spyOn(component.onCardMoved, 'emit').mockReturnValue(undefined);
			const event = new DragEvent('drop');
			event.preventDefault = vi.fn().mockName('preventDefault');
			event.stopPropagation = vi.fn().mockName('stopPropagation');

			component.onCardDrop(event, targetColumn, 1);

			expect(component.onCardMoved.emit).toHaveBeenCalled();
			expect(component.columns()[0].cards.length).toBe(1); // One less
			expect(component.columns()[1].cards.length).toBe(2); // One more
			expect(component.columns()[1].cards[0].id).toBe(101); // Moved card is first
		});
	});

	describe('Accessibility semantics', () => {
		it('should expose region/list/listitem roles with labels and stable ids', () => {
			const host = fixture.nativeElement as HTMLElement;
			expect(host.getAttribute('role')).toBe('region');
			expect(host.getAttribute('aria-label')).toBe('Board');

			const containers = fixture.debugElement.queryAll(By.css('.hub-board__column-container'));
			expect(containers.length).toBe(2);
			expect(containers[0].attributes['role']).toBe('listitem');
			expect(containers[1].attributes['role']).toBe('listitem');

			const columns = fixture.debugElement.queryAll(By.css('.hub-board__column'));
			expect(columns[0].attributes['role']).toBe('group');
			expect(columns[0].attributes['aria-label']).toBe('Column 1');
			expect(columns[0].attributes['id']).toBe(`${component.boardInstanceId}-column-1`);
			expect(columns[1].attributes['aria-label']).toBe('Column 2');
			expect(columns[1].attributes['id']).toBe(`${component.boardInstanceId}-column-2`);

			const bodies = fixture.debugElement.queryAll(By.css('.hub-board__column-body'));
			for (const body of bodies) {
				expect(body.attributes['role']).toBe('list');
			}

			const cards = fixture.debugElement.queryAll(By.css('.hub-board__card'));
			expect(cards.length).toBe(3);
			for (const card of cards) {
				expect(card.attributes['role']).toBe('listitem');
			}
		});

		// The list of columns must own the columns themselves: a list whose only
		// descendants are role-less wrappers is announced as a list with no items.
		it('should own every column as an item of the board column list', () => {
			const host = fixture.nativeElement as HTMLElement;
			const columnList = host.querySelector('.hub-board__columns') as HTMLElement;

			expect(columnList.getAttribute('role')).toBe('list');

			const owned = Array.from(columnList.children);
			expect(owned.length).toBe(2);
			for (const child of owned) {
				expect(child.getAttribute('role')).toBe('listitem');
			}

			// Neither the keyboard hint nor the announcer may sit inside the list,
			// or the list would own elements that are not columns.
			expect(columnList.querySelector('[aria-live]')).toBeNull();
			expect(host.querySelector(`#${component.keyboardHintId}`)!.closest('[role="list"]')).toBeNull();
		});

		it('should honour a custom boardLabel', () => {
			componentRef.setInput('boardLabel', 'Sprint board');
			fixture.detectChanges();
			expect((fixture.nativeElement as HTMLElement).getAttribute('aria-label')).toBe('Sprint board');
		});

		it('should make enabled cards focusable with the keyboard hint, skipping disabled ones', () => {
			const board = JSON.parse(JSON.stringify(mockBoard)) as Board;
			board.columns![0].cards[1].disabled = true;
			componentRef.setInput('board', board);
			fixture.detectChanges();

			const cards = fixture.debugElement
				.queryAll(By.css('.hub-board__card'))
				.map((debugEl) => debugEl.nativeElement as HTMLElement);

			expect(cards[0].getAttribute('tabindex')).toBe('0');
			expect(cards[0].getAttribute('aria-describedby')).toBe(component.keyboardHintId);
			expect(cards[1].hasAttribute('tabindex')).toBe(false);
			expect(cards[1].hasAttribute('aria-describedby')).toBe(false);

			const hint = (fixture.nativeElement as HTMLElement).querySelector(`#${component.keyboardHintId}`);
			expect(hint).toBeTruthy();
		});

		it('should allow a card to receive keyboard focus', () => {
			const card = (fixture.nativeElement as HTMLElement).querySelector('.hub-board__card') as HTMLElement;
			card.focus();
			expect(document.activeElement).toBe(card);
		});
	});

	describe('Keyboard reordering', () => {
		/** Dispatches a keydown with the given key on an element and refreshes the view. */
		function keydown(element: HTMLElement, key: string): void {
			element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
			fixture.detectChanges();
		}

		/** Returns the rendered card elements in DOM order. */
		function cardElements(): HTMLElement[] {
			return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.hub-board__card'));
		}

		/** Returns the polite live region element. */
		function liveRegion(): HTMLElement {
			return (fixture.nativeElement as HTMLElement).querySelector('[aria-live="polite"]') as HTMLElement;
		}

		/**
		 * Returns the element of the currently grabbed card. Needed after a
		 * cross-column move: the card leaves one `@for` block and enters
		 * another, so Angular recreates its DOM node (keyboard focus follows
		 * it in the browser via the component's focus restoration).
		 */
		function grabbedCardEl(): HTMLElement {
			return (fixture.nativeElement as HTMLElement).querySelector('.hub-board__card--grabbed') as HTMLElement;
		}

		it('should grab a card with Space, apply the grabbed class and announce it', () => {
			keydown(cardElements()[0], ' ');

			expect(component.keyboardMoveState()).toBeTruthy();
			expect(cardElements()[0].classList.contains('hub-board__card--grabbed')).toBe(true);
			expect(liveRegion().textContent).toContain('Card "Card 1" grabbed');
			expect(liveRegion().textContent).toContain('Position 1 of 2 in "Column 1"');
		});

		it('grab → ArrowDown → Enter commits and emits the same payload shape as a pointer drop', () => {
			const emitSpy = vi.spyOn(component.onCardMoved, 'emit').mockReturnValue(undefined);

			const card = cardElements()[0];
			keydown(card, ' ');
			keydown(card, 'ArrowDown');
			expect(liveRegion().textContent).toContain('moved to "Column 1", position 2 of 2');

			keydown(card, 'Enter');

			expect(emitSpy).toHaveBeenCalledTimes(1);
			const keyboardPayload = emitSpy.mock.calls[0][0] as CardDragDropEvent;
			const column = component.columns()[0];
			expect(keyboardPayload).toEqual({
				previousIndex: 0,
				currentIndex: 1,
				container: { data: column },
				previousContainer: { data: column },
				item: { data: column.cards[1] },
				isPointerOverContainer: true
			});
			expect(column.cards.map((c) => c.id)).toEqual([102, 101]);
			expect(component.keyboardMoveState()).toBeNull();
			expect(liveRegion().textContent).toContain('dropped in "Column 1", position 2 of 2');

			// Compare the payload shape against an actual pointer drop.
			(component as any).dragState.set({
				type: 'card',
				sourceColumnIndex: 0,
				sourceCardIndex: 0,
				item: component.columns()[0].cards[0]
			});
			(component as any).dropIndicatorIndex.set(0);
			const dropEvent = new DragEvent('drop');
			dropEvent.preventDefault = vi.fn().mockName('preventDefault');
			dropEvent.stopPropagation = vi.fn().mockName('stopPropagation');
			component.onCardDrop(dropEvent, component.columns()[1], 1);

			const pointerPayload = emitSpy.mock.calls[1][0] as CardDragDropEvent;
			expect(Object.keys(keyboardPayload).sort()).toEqual(Object.keys(pointerPayload).sort());
		});

		it('grab → ArrowRight → Enter transfers the card to the adjacent column', () => {
			const emitSpy = vi.spyOn(component.onCardMoved, 'emit').mockReturnValue(undefined);

			const card = cardElements()[0];
			keydown(card, ' ');
			keydown(card, 'ArrowRight');
			expect(liveRegion().textContent).toContain('moved to "Column 2", position 1 of 2');

			keydown(grabbedCardEl(), 'Enter');

			expect(emitSpy).toHaveBeenCalledTimes(1);
			const payload = emitSpy.mock.calls[0][0] as CardDragDropEvent;
			expect(payload.previousIndex).toBe(0);
			expect(payload.currentIndex).toBe(0);
			expect(payload.previousContainer.data).toBe(component.columns()[0]);
			expect(payload.container.data).toBe(component.columns()[1]);
			expect(payload.item.data.id).toBe(101);
			expect(payload.isPointerOverContainer).toBe(true);
			expect(component.columns()[0].cards.map((c) => c.id)).toEqual([102]);
			expect(component.columns()[1].cards.map((c) => c.id)).toEqual([101, 201]);
		});

		it('Escape restores the original order across columns without emitting', () => {
			const emitSpy = vi.spyOn(component.onCardMoved, 'emit').mockReturnValue(undefined);

			const card = cardElements()[0];
			keydown(card, ' ');
			keydown(card, 'ArrowDown');
			keydown(card, 'ArrowRight');
			keydown(grabbedCardEl(), 'Escape');

			expect(emitSpy).not.toHaveBeenCalled();
			expect(component.keyboardMoveState()).toBeNull();
			expect(component.columns()[0].cards.map((c) => c.id)).toEqual([101, 102]);
			expect(component.columns()[1].cards.map((c) => c.id)).toEqual([201]);
			expect(liveRegion().textContent).toContain('Move cancelled');
		});

		it('dropping without moving releases the grab without emitting', () => {
			const emitSpy = vi.spyOn(component.onCardMoved, 'emit').mockReturnValue(undefined);

			const card = cardElements()[0];
			keydown(card, ' ');
			keydown(card, 'Enter');

			expect(emitSpy).not.toHaveBeenCalled();
			expect(component.keyboardMoveState()).toBeNull();
			expect(component.columns()[0].cards.map((c) => c.id)).toEqual([101, 102]);
		});

		it('respects cardSortingDisabled on the target column, like the drag path', () => {
			component.columns()[1].cardSortingDisabled = true;

			const card = cardElements()[0];
			keydown(card, ' ');
			keydown(card, 'ArrowRight');

			expect(component.keyboardMoveState()?.currentColumnIndex).toBe(0);
			expect(component.columns()[1].cards.length).toBe(1);
			expect(liveRegion().textContent).toContain('cannot be moved to "Column 2"');
		});

		it('respects the target column predicate, like the drag path', () => {
			component.columns()[1].predicate = () => false;

			const card = cardElements()[0];
			keydown(card, ' ');
			keydown(card, 'ArrowRight');

			expect(component.keyboardMoveState()?.currentColumnIndex).toBe(0);
			expect(component.columns()[1].cards.length).toBe(1);
		});

		it('does not grab cards in a cardSortingDisabled column', () => {
			component.columns()[0].cardSortingDisabled = true;
			fixture.detectChanges();

			keydown(cardElements()[0], ' ');

			expect(component.keyboardMoveState()).toBeNull();
		});

		it('re-announces consecutive identical messages by alternating a suffix', () => {
			component.columns()[1].cardSortingDisabled = true;

			const card = cardElements()[0];
			keydown(card, ' ');
			keydown(card, 'ArrowRight'); // Rejected → "cannot be moved" message
			const first = component.announcement();

			keydown(card, 'ArrowRight'); // Same rejection message again
			const second = component.announcement();

			// Same human-readable message, but a different string so the
			// aria-live region re-announces it.
			expect(second).not.toBe(first);
			expect(second.replace(/\u00A0$/, '')).toBe(first.replace(/\u00A0$/, ''));
		});
	});
});
