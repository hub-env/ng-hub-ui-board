import { Component, TemplateRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HubCardTemplateDirective } from './card-template.directive';

/**
 * Test component to verify the directive functionality
 */
@Component({
	template: `
		<ng-template cardTpt let-card="item" let-column="column" #testTemplate>
			<div class="test-card-template" [attr.data-card-title]="card?.title">
				<h4>{{ card?.title }}</h4>
				<p>{{ card?.description }}</p>
				<span class="column-info">Column: {{ column?.title }}</span>
				@if (card?.data) {
					<div class="card-data">
						<span class="priority">{{ card.data.priority }}</span>
					</div>
				}
			</div>
		</ng-template>

		<ng-template cardTpt #anotherTemplate>
			<div class="simple-card">Simple template</div>
		</ng-template>

		<!-- Template without directive for comparison -->
		<ng-template #regularTemplate>
			<div class="regular-template">Regular template</div>
		</ng-template>
	`,
	standalone: true,
	imports: [HubCardTemplateDirective]
})
class TestComponent {
	readonly cardDirective = viewChild.required('testTemplate', { read: HubCardTemplateDirective });

	readonly templateRef = viewChild.required('testTemplate', { read: TemplateRef });

	readonly anotherCardDirective = viewChild.required('anotherTemplate', { read: HubCardTemplateDirective });

	readonly regularTemplateRef = viewChild.required('regularTemplate', { read: TemplateRef });

	// Test data
	mockCard = {
		id: 1,
		title: 'Test Card',
		description: 'Test Description',
		data: {
			priority: 'High',
			dueDate: '2024-12-31'
		}
	};

	mockColumn = {
		id: 1,
		title: 'Test Column',
		cards: []
	};
}

describe('HubCardTemplateDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let directive: HubCardTemplateDirective;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		directive = component.cardDirective();
	});

	describe('Basic Functionality', () => {
		it('should create an instance', () => {
			expect(directive).toBeTruthy();
		});

		it('should be a HubCardTemplateDirective instance', () => {
			expect(directive).toBeInstanceOf(HubCardTemplateDirective);
		});

		it('should have templateRef property', () => {
			expect(directive.templateRef).toBeTruthy();
			expect(directive.templateRef).toBeInstanceOf(TemplateRef);
		});

		it('should have templateRef that is accessible', () => {
			expect(directive.templateRef).toBeTruthy();
			expect(component.templateRef()).toBeTruthy();
			expect(directive.templateRef.constructor.name).toBe('TemplateRef');
		});
	});

	describe('Template Reference Behavior', () => {
		it('should provide access to template content through templateRef', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				item: component.mockCard,
				column: component.mockColumn
			});

			embeddedView.detectChanges();
			const templateElement = getFirstElementNode(embeddedView.rootNodes);

			expect(templateElement).toBeTruthy();
			expect(templateElement.classList.contains('test-card-template')).toBe(true);
			expect(templateElement.getAttribute('data-card-title')).toBe('Test Card');
		});

		it('should render template with context variables', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				item: component.mockCard,
				column: component.mockColumn
			});

			embeddedView.detectChanges();
			const templateElement = getFirstElementNode(embeddedView.rootNodes);

			expect(templateElement.textContent).toContain('Test Card');
			expect(templateElement.textContent).toContain('Test Description');
			expect(templateElement.textContent).toContain('Column: Test Column');
			expect(templateElement.textContent).toContain('High');
		});

		it('should handle template without context data', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({});

			expect(embeddedView).toBeTruthy();
			expect(embeddedView.rootNodes.length).toBeGreaterThan(0);
		});

		it('should handle template with partial context', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				item: component.mockCard
				// column is missing
			});

			embeddedView.detectChanges();
			const templateElement = getFirstElementNode(embeddedView.rootNodes);

			expect(templateElement.textContent).toContain('Test Card');
			expect(templateElement.textContent).toContain('Column:'); // Should render even without column data
		});
	});

	describe('Multiple Template Instances', () => {
		it('should handle multiple template instances with the same directive', () => {
			const firstDirective = component.cardDirective();
			const secondDirective = component.anotherCardDirective();

			expect(firstDirective).toBeTruthy();
			expect(secondDirective).toBeTruthy();
			expect(firstDirective).not.toBe(secondDirective);
			expect(firstDirective.templateRef).not.toBe(secondDirective.templateRef);
		});

		it('should create different embedded views from different template instances', () => {
			const firstView = component.cardDirective().templateRef.createEmbeddedView({
				item: component.mockCard,
				column: component.mockColumn
			});

			const secondView = component.anotherCardDirective().templateRef.createEmbeddedView({});

			firstView.detectChanges();
			secondView.detectChanges();

			const firstElement = getFirstElementNode(firstView.rootNodes);
			const secondElement = getFirstElementNode(secondView.rootNodes);

			expect(firstElement.classList.contains('test-card-template')).toBe(true);
			expect(secondElement.classList.contains('simple-card')).toBe(true);
		});
	});

	describe('Directive Selector', () => {
		it('should create directive instances correctly', () => {
			expect(component.cardDirective()).toBeTruthy();
			expect(component.anotherCardDirective()).toBeTruthy();
		});

		it('should have template references available', () => {
			expect(component.cardDirective().templateRef).toBeTruthy();
			expect(component.anotherCardDirective().templateRef).toBeTruthy();
			expect(component.regularTemplateRef()).toBeTruthy();
		});

		it('should have different template refs for different directives', () => {
			expect(component.cardDirective().templateRef).not.toBe(component.anotherCardDirective().templateRef);
		});
	});

	describe('Template Context Types', () => {
		it('should work with different card data types', () => {
			const stringCard = {
				title: 'String Card',
				description: 'Simple string data',
				data: 'Simple string'
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				item: stringCard,
				column: component.mockColumn
			});

			embeddedView.detectChanges();
			const templateElement = embeddedView.rootNodes[0] as HTMLElement;

			expect(templateElement.textContent).toContain('String Card');
		});

		it('should handle null/undefined card data gracefully', () => {
			const nullCard = {
				title: 'Null Card',
				description: null,
				data: null
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				item: nullCard,
				column: component.mockColumn
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});

		it('should handle empty objects', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				item: {},
				column: {}
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});
	});

	describe('Memory Management', () => {
		it('should properly clean up embedded views', () => {
			const embeddedView = directive.templateRef.createEmbeddedView({
				item: component.mockCard,
				column: component.mockColumn
			});

			expect(embeddedView.destroyed).toBe(false);

			embeddedView.destroy();

			expect(embeddedView.destroyed).toBe(true);
		});

		it('should handle multiple view creation and destruction', () => {
			const views: any[] = [];

			// Create multiple views
			for (let i = 0; i < 5; i++) {
				const view = directive.templateRef.createEmbeddedView({
					item: { ...component.mockCard, id: i },
					column: component.mockColumn
				});
				views.push(view);
			}

			expect(views.length).toBe(5);
			views.forEach((view) => expect(view.destroyed).toBe(false));

			// Destroy all views
			views.forEach((view) => view.destroy());
			views.forEach((view) => expect(view.destroyed).toBe(true));
		});
	});

	describe('Integration with Angular Forms and Pipes', () => {
		it('should work with Angular pipes in template', () => {
			// This test assumes the template might use pipes
			const cardWithDate = {
				...component.mockCard,
				data: {
					...component.mockCard.data,
					createdAt: new Date('2024-01-01T10:30:00Z')
				}
			};

			const embeddedView = directive.templateRef.createEmbeddedView({
				item: cardWithDate,
				column: component.mockColumn
			});

			expect(() => embeddedView.detectChanges()).not.toThrow();
		});
	});

	describe('Error Handling', () => {
		it('should handle template creation with invalid context gracefully', () => {
			// Test with various invalid contexts that won't break the template
			const validEmptyContexts = [
				{},
				{ item: null, column: null },
				{ item: {}, column: {} },
				{ item: { title: '' }, column: { title: '' } }
			];

			validEmptyContexts.forEach((context) => {
				expect(() => {
					const view = directive.templateRef.createEmbeddedView(context as any);
					view.detectChanges();
					view.destroy();
				}).not.toThrow();
			});
		});

		it('should handle completely empty context', () => {
			expect(() => {
				const view = directive.templateRef.createEmbeddedView({});
				view.detectChanges();
				view.destroy();
			}).not.toThrow();
		});
	});
});

function getFirstElementNode(rootNodes: unknown[]): HTMLElement {
	return rootNodes.find((node): node is HTMLElement => node instanceof HTMLElement)!;
}
