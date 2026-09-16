# ng-hub-ui-board

**Español** | [English](./README.md)

[![NPM Version](https://img.shields.io/npm/v/ng-hub-ui-board.svg)](https://www.npmjs.com/package/ng-hub-ui-board)

> **⚠️ CAMBIOS IMPORTANTES:** La versión 21.1.0 elimina el punto de entrada de hojas de estilo público. Los estilos ahora se encapsulan dentro del componente. Lee el archivo [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) antes de actualizar.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/en/), una colección de bibliotecas de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/en/board/overview/
- Ejemplos en vivo: https://hubui.dev/en/board/examples/
- Hub UI: https://hubui.dev/en/
- Hub UI en GitHub (incidencias, roadmap y cómo contribuir): https://github.com/hub-env/hub-ui

## 🧩 Familia de bibliotecas `ng-hub-ui`

Esta biblioteca forma parte del ecosistema **ng-hub-ui**:

- [ng-hub-ui-accordion](https://www.npmjs.com/package/ng-hub-ui-accordion) (obsoleto — usa ng-hub-ui-panels)
- [ng-hub-ui-action-sheet](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [ng-hub-ui-avatar](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [ng-hub-ui-board](https://www.npmjs.com/package/ng-hub-ui-board) ← Estás aquí
- [ng-hub-ui-breadcrumbs](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [ng-hub-ui-calendar](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [ng-hub-ui-dropdown](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [ng-hub-ui-ds](https://www.npmjs.com/package/ng-hub-ui-ds)
- [ng-hub-ui-forms](https://www.npmjs.com/package/ng-hub-ui-forms)
- [ng-hub-ui-history](https://www.npmjs.com/package/ng-hub-ui-history)
- [ng-hub-ui-milestones](https://www.npmjs.com/package/ng-hub-ui-milestones)
- [ng-hub-ui-modal](https://www.npmjs.com/package/ng-hub-ui-modal)
- [ng-hub-ui-nav](https://www.npmjs.com/package/ng-hub-ui-nav)
- [ng-hub-ui-paginable](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [ng-hub-ui-panels](https://www.npmjs.com/package/ng-hub-ui-panels)
- [ng-hub-ui-portal](https://www.npmjs.com/package/ng-hub-ui-portal)
- [ng-hub-ui-skeleton](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [ng-hub-ui-sortable](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [ng-hub-ui-stepper](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [ng-hub-ui-utils](https://www.npmjs.com/package/ng-hub-ui-utils)

## Descripción

Un componente de tablero flexible y potente para aplicaciones Angular, perfecto para implementar tableros estilo Kanban, sistemas de gestión de tareas o cualquier interfaz basada en tarjetas con arrastrar y soltar. Similar a los tableros de Trello, este componente te permite crear columnas interactivas con tarjetas arrastrables.

## Características

- 🎯 **Componente standalone** - Enfoque moderno de Angular con configuración mínima
- 🔄 **Arrastrar y soltar nativo** - Basado en el núcleo `ng-hub-ui-utils` del ecosistema, sin dependencias de UI de terceros ni CDK
- 🎨 **Visuales de arrastre totalmente personalizables** - Plantillas personalizadas para previsualizaciones de arrastre y marcadores de posición de destino
- ⚙️ **Comportamiento de arrastre configurable** - Elige entre los modos ghost, hide o collapse para los elementos arrastrados
- 📱 **Diseño responsive** - Funciona sin problemas en escritorio, tablet y dispositivos móviles
- 🎭 **Altamente personalizable** - Plantillas personalizadas para tarjetas, cabeceras, pies de página e interacciones de arrastre
- 🔧 **Compatible con Bootstrap** - Se integra perfectamente con el sistema de diseño de Bootstrap 5
- ♾️ **Scroll infinito** - Detección de final de columna mediante la salida `reachedEnd`, para cargar más tarjetas bajo demanda
- 🎨 **Estilado personalizado** - Propiedades personalizadas de CSS para temas y personalización sencilla
- 🔒 **Control granular** - Habilita/deshabilita funcionalidades a nivel de tablero, columna o tarjeta
- 🏷️ **Soporte de TypeScript** - Seguridad de tipos completa con interfaces genéricas
- ♿ **Accesible por teclado** - Reordenación completa de tarjetas con teclado, semántica ARIA de lista y anuncios para lectores de pantalla
- 🪶 **Ligero** - Sin dependencias de UI de terceros ni CDK; solo depende del núcleo compartido `ng-hub-ui-utils`

## Instalación

```bash
# Instala el componente y su peer dependency obligatoria
npm install ng-hub-ui-board ng-hub-ui-utils
```

O usando yarn:

```bash
yarn add ng-hub-ui-board ng-hub-ui-utils
```

**Nota:** `@angular/cdk` no es necesario. El tablero usa el núcleo nativo de arrastrar y soltar de `ng-hub-ui-utils` (una peer dependency obligatoria desde `22.1.0`) — no hay dependencias de UI de terceros ni CDK.

`ng-hub-ui-ds` es una peer dependency **opcional** (`>=22.0.0`). Instálala para dar al tablero la paleta compartida de tokens `--hub-sys-*` y el modo oscuro; sin ella cada lectura de token cae en su valor por defecto y el tablero se dibuja igual.

## Inicio rápido

Aquí tienes un ejemplo rápido para empezar con `ng-hub-ui-board` usando el enfoque de componente standalone.

### 1. Configura el modelo de tu tablero

```ts
import { signal } from '@angular/core';
import { Board } from 'ng-hub-ui-board';

export const board = signal<Board>({
	title: 'Project Sprint',
	columns: [
		{
			title: 'To Do',
			cards: [
				{ title: 'Login page', description: 'Build login form with validation' },
				{ title: 'Landing hero', description: 'Implement hero section' }
			]
		},
		{
			title: 'In Progress',
			cards: [{ title: 'Set up CI/CD', description: 'Add GitHub Actions' }]
		},
		{
			title: 'Done',
			cards: [{ title: 'Project scaffold', description: 'Initial Angular setup' }]
		}
	]
});
```

### 2. Crea tu componente

```ts
import { Component } from '@angular/core';
import {
	HubBoardComponent,
	HubCardTemplateDirective,
	HubBoardColumnHeaderDirective,
	HubBoardColumnFooterDirective,
	BoardCard
} from 'ng-hub-ui-board';

@Component({
	selector: 'board-demo',
	standalone: true,
	imports: [HubBoardComponent, HubCardTemplateDirective, HubBoardColumnHeaderDirective, HubBoardColumnFooterDirective],
	templateUrl: './board-demo.component.html'
})
export class BoardDemoComponent {
	board = board;

	handleCardClick(card: BoardCard) {
		console.log('Card clicked:', card);
	}

	handleCardMoved(event: any) {
		console.log('Card moved:', event);
	}
}
```

### 3. Úsalo en tu plantilla

```html
<hub-board [board]="board()" (onCardClick)="handleCardClick($event)" (onCardMoved)="handleCardMoved($event)">
	<ng-template cardTpt let-card="item">
		<strong>{{ card.title }}</strong>
		<p>{{ card.description }}</p>
	</ng-template>
</hub-board>
```

Este bloque de código proporciona un ejemplo mínimo y funcional tanto para usuarios principiantes como intermedios.

## Uso

El componente se puede utilizar de dos maneras:

### 1. Importación de componente standalone (recomendado)

```typescript
import { Component } from '@angular/core';
import {
	HubBoardComponent,
	HubCardTemplateDirective,
	HubBoardColumnHeaderDirective,
	HubBoardColumnFooterDirective
} from 'ng-hub-ui-board';

@Component({
	selector: 'app-my-component',
	standalone: true,
	imports: [HubBoardComponent, HubCardTemplateDirective, HubBoardColumnHeaderDirective, HubBoardColumnFooterDirective],
	template: `
		<hub-board [board]="board" (onCardClick)="handleCardClick($event)" (onCardMoved)="handleCardMoved($event)">
			<!-- Las plantillas van aquí -->
		</hub-board>
	`
})
export class MyComponent {
	// ... lógica del componente
}
```

### 2. Importación de módulo (heredado)

```typescript
import { NgModule } from '@angular/core';
import { HubBoardModule } from 'ng-hub-ui-board';

@NgModule({
	imports: [HubBoardModule]
	// ... resto de la configuración del módulo
})
export class AppModule {}
```

## Plantillas

El componente utiliza varias plantillas para la personalización. Si usas el enfoque standalone, recuerda importar las directivas correspondientes para cada plantilla que vayas a utilizar.

### Plantillas estándar

### Plantilla de tarjeta (HubCardTemplateDirective)

Se usa para personalizar cómo se renderiza cada tarjeta dentro de las columnas. Esta plantilla te da control total sobre la apariencia y la estructura de la tarjeta.

```html
<ng-template cardTpt let-card="item">
	<div class="custom-card">
		<h3>{{ card.title }}</h3>
		<p>{{ card.description }}</p>
		<div class="card-metadata">
			<span class="priority">{{ card.data?.priority }}</span>
			<span class="due-date">{{ card.data?.dueDate | date }}</span>
		</div>
	</div>
</ng-template>
```

### Plantilla de cabecera de columna (HubBoardColumnHeaderDirective)

Se usa para personalizar la cabecera de cada columna. Perfecta para añadir acciones específicas de la columna, mostrar recuentos de tarjetas o añadir opciones de filtrado.

```html
<ng-template columnHeaderTpt let-column="column">
	<div class="custom-header">
		<h2>{{ column.title }}</h2>
		<span class="card-count">{{ column.cards.length }} items</span>
		<div class="column-actions">
			<button (click)="addCard(column)">Add Card</button>
			<button (click)="filterColumn(column)">Filter</button>
		</div>
	</div>
</ng-template>
```

### Plantilla de pie de columna (HubBoardColumnFooterDirective)

Se usa para añadir un pie de página a cada columna. Útil para información de resumen, acciones rápidas o controles específicos de la columna.

```html
<ng-template columnFooterTpt let-column="column">
	<div class="custom-footer">
		<div class="column-summary">
			<span>Total: {{ column.cards.length }}</span>
			<span>Priority Items: {{ getPriorityItems(column) }}</span>
		</div>
		<button (click)="quickAddCard(column)">Quick Add</button>
	</div>
</ng-template>
```

### Plantillas de arrastrar y soltar

#### Plantilla de previsualización de arrastre de tarjeta (HubCardDragPreviewDirective)

Personaliza el elemento visual que sigue al cursor al arrastrar tarjetas. La plantilla recibe la tarjeta arrastrada y su columna de origen como contexto.

```html
<ng-template cardDragPreview let-card="card" let-column="column">
	<div class="custom-drag-preview">
		<div class="preview-header">
			<span class="badge">{{ column.title }}</span>
		</div>
		<h4>{{ card.title }}</h4>
		<p class="preview-description">{{ card.description }}</p>
	</div>
</ng-template>
```

**Variables de contexto:**

- `card`: La tarjeta que se está arrastrando
- `column`: La columna de origen de la tarjeta

#### Plantilla de marcador de posición de tarjeta (HubCardPlaceholderDirective)

Personaliza la apariencia de la zona de destino al arrastrar tarjetas entre columnas o dentro de ellas.

```html
<ng-template cardPlaceholder>
	<div class="custom-card-placeholder">
		<span class="placeholder-icon">📥</span>
		<p>Drop card here</p>
	</div>
</ng-template>
```

#### Plantilla de previsualización de arrastre de columna (HubColumnDragPreviewDirective)

Personaliza el elemento visual que sigue al cursor al arrastrar columnas. La plantilla recibe la columna arrastrada como contexto.

```html
<ng-template columnDragPreview let-column="column">
	<div class="custom-column-preview">
		<h3>{{ column.title }}</h3>
		<span class="card-count">{{ column.cards.length }} cards</span>
	</div>
</ng-template>
```

**Variable de contexto:**

- `column`: La columna que se está arrastrando

#### Plantilla de marcador de posición de columna (HubColumnPlaceholderDirective)

Personaliza la apariencia de la zona de destino al reordenar columnas.

```html
<ng-template columnPlaceholder>
	<div class="custom-column-placeholder">
		<span class="placeholder-text">Drop column here</span>
	</div>
</ng-template>
```

## Eventos

El `HubBoardComponent` emite varios eventos que te ayudan a interactuar con las acciones del usuario, como hacer clic en tarjetas, mover elementos o llegar a los límites del scroll.

### onCardClick

Se emite cuando se hace clic en una tarjeta.

```html
<hub-board [board]="board" (onCardClick)="handleCardClick($event)"> </hub-board>
```

**Tipo:** `OutputEmitterRef<BoardCard>`

**Ejemplo:**

```ts
handleCardClick(card: BoardCard) {
  console.log('Card clicked:', card.title);
}
```

---

### onCardMoved

Se emite cuando una tarjeta se mueve, ya sea dentro de la misma columna o entre columnas.

```html
<hub-board [board]="board" (onCardMoved)="handleCardMoved($event)"> </hub-board>
```

**Tipo:** `OutputEmitterRef<CardDragDropEvent>`

**Ejemplo:**

```ts
import { CardDragDropEvent } from 'ng-hub-ui-board';

handleCardMoved(event: CardDragDropEvent) {
  const card = event.item.data;
  const from = event.previousContainer.data;
  const to = event.container.data;

  console.log(`Moved "${card.title}" from "${from.title}" to "${to.title}"`);
}
```

---

### onColumnMoved

Se emite cuando una columna se reordena mediante arrastrar y soltar.

```html
<hub-board [board]="board" (onColumnMoved)="handleColumnMoved($event)"> </hub-board>
```

**Tipo:** `OutputEmitterRef<ColumnDragDropEvent>`

**Ejemplo:**

```ts
import { ColumnDragDropEvent } from 'ng-hub-ui-board';

handleColumnMoved(event: ColumnDragDropEvent) {
  console.log(`Column moved from ${event.previousIndex} to ${event.currentIndex}`);
}
```

---

### reachedEnd

Se emite cuando un usuario hace scroll hasta el final de una columna. Útil para disparar la carga diferida de tarjetas adicionales.

```html
<div style="height: 512px;">
	<hub-board [board]="board" (reachedEnd)="loadMoreCards($event)"></hub-board>
</div>
```

**Tipo:** `OutputEmitterRef<ReachedEndEvent<BoardColumn>>`

**Estructura del evento:**

```typescript
interface ReachedEndEvent<T = any> {
	index: number; // Índice de la columna que llegó al final
	data: T; // El propio objeto BoardColumn
}
```

**Ejemplo:**

```ts
loadMoreCards(event: ReachedEndEvent) {
  const columnIndex = event.index;
  const column = event.data;  // event.data es el objeto BoardColumn

  if (!column) {
    return;
  }

  console.log(`Loading more cards for column: ${column.title}`);

  // Simula una llamada a la API para cargar más tarjetas
  setTimeout(() => {
    const newCards = this.generateCards(5);

    // Actualiza el tablero con las nuevas tarjetas
    this.board.update(currentBoard => ({
      ...currentBoard,
      columns: currentBoard.columns?.map((col, index) =>
        index === columnIndex
          ? { ...col, cards: [...col.cards, ...newCards] }
          : col
      ) || []
    }));
  }, 1000);
}
```

> ℹ️ **Importante:** Para habilitar la detección de scroll, el tablero debe colocarse dentro de un contenedor con una restricción de altura fija.

## Teclado y accesibilidad

El tablero expone semántica ARIA de lista: el host es un `role="region"` nombrado por el input `boardLabel` (por defecto `'Board'`), la pista de columnas que contiene es un `role="list"` cuyos elementos son las columnas (`role="listitem"`), cada columna es un `role="group"` etiquetado, cada cuerpo de columna es un `role="list"` y cada tarjeta un `role="listitem"`.

Las tarjetas pueden reordenarse sin puntero — cada tarjeta habilitada es una parada de tabulación. Con una tarjeta enfocada:

- `Space` / `Enter` — **agarra** la tarjeta.
- Mientras está agarrada, `ArrowUp` / `ArrowDown` la mueven dentro de su columna y `ArrowLeft` / `ArrowRight` la mueven a la columna adyacente, respetando las mismas reglas que el arrastre (el `predicate` de la columna destino y `cardSortingDisabled`). Cada movimiento se aplica en vivo y el foco sigue a la tarjeta.
- `Space` / `Enter` — **suelta** (confirma) el movimiento, emitiendo `onCardMoved` con exactamente el mismo payload `CardDragDropEvent` que una suelta con puntero.
- `Escape` — **cancela**, restaurando la tarjeta a su posición original sin emitir ningún evento.

Una región `aria-live="polite"` oculta visualmente anuncia agarres, movimientos, sueltas, cancelaciones y destinos rechazados. Los mensajes del anunciador están solo en inglés por ahora; su i18n/personalización está registrada como trabajo futuro. La reordenación de columnas sigue siendo solo con puntero.

## Inputs

Los siguientes inputs están disponibles en el `HubBoardComponent`:

| Input                   | Tipo            | Descripción                                                                                                                  | Por defecto  |
| ----------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `board`                 | `Board`         | El objeto del tablero que contiene las columnas y las tarjetas                                                               | `undefined`  |
| `boardLabel`            | `string`        | Nombre accesible (`aria-label`) del contenedor del tablero                                                          | `'Board'`    |
| `columnSortingDisabled` | `boolean`       | Deshabilita la ordenación de columnas mediante arrastrar y soltar                                                            | `false`      |
| `dragBehavior`          | `DragBehavior`  | Controla cómo se comportan visualmente los elementos arrastrados: `'ghost'` (semitransparente), `'hide'` o `'collapse'`      | `'collapse'` |
| `variant`               | `string`        | Acento semántico del marcador de posición de arrastrar y soltar. Los valores integrados (`'primary'` / `'success'` / `'danger'` / `'warning'` / `'info'`) usan los tintes exactos del sistema de diseño; cualquier otra palabra suelta se lee como `--hub-sys-color-<variant>` de la aplicación anfitriona, y un color literal (`#hex`, `rgb()`, `oklch()`, `var()`) se pasa tal cual | `undefined`  |

## Outputs

Estos outputs son emitidos por el componente durante la interacción del usuario:

| Output          | Tipo                                    | Descripción                                                                          |
| --------------- | --------------------------------------- | ------------------------------------------------------------------------------------ |
| `onCardClick`   | `OutputEmitterRef<BoardCard>`           | Se dispara cuando se hace clic en una tarjeta                                         |
| `onCardMoved`   | `OutputEmitterRef<CardDragDropEvent>`   | Se emite cuando se mueve una tarjeta (dentro de una columna o entre columnas)         |
| `onColumnMoved` | `OutputEmitterRef<ColumnDragDropEvent>` | Se emite cuando una columna se reordena mediante arrastrar y soltar                   |
| `reachedEnd`    | `OutputEmitterRef<ReachedEndEvent>`     | Se dispara cuando el usuario hace scroll hasta el final de una columna (carga diferida) |

## Interfaces

### Board

Interfaz contenedora principal que representa toda la estructura del tablero. Se usa para definir la configuración general del tablero, incluyendo sus columnas y su estilado general.

```typescript
interface Board<T = any> {
	id?: number;
	title: string;
	description?: string;
	columns?: BoardColumn<T>[];
	classlist?: string[];
	style?: { [key: string]: any };
}
```

### BoardColumn

Representa una única columna del tablero. Se usa para configurar columnas individuales, sus tarjetas y comportamientos específicos de la columna, como las reglas de arrastrar y soltar.

```typescript
interface BoardColumn<T = any> {
	id?: number;
	boardId?: number;
	title: string;
	description?: string;
	cards: BoardCard<T>[];
	style?: { [key: string]: any };
	classlist?: string[] | string;
	disabled?: boolean;
	data?: any;
	cardSortingDisabled?: boolean;
	predicate?: (item?: BoardDragItem<T>) => boolean;
}
```

### BoardCard

Representa las tarjetas individuales dentro de las columnas. Se usa para definir el contenido y el comportamiento de la tarjeta, incluyendo datos y estilado personalizados.

```typescript
interface BoardCard<T = any> {
	id?: number;
	columnId?: number;
	title: string;
	description?: string;
	data?: T;
	classlist?: string[];
	style?: { [key: string]: any };
	disabled?: boolean;
}
```

### CardDragDropEvent

Interfaz de evento emitida cuando se mueve una tarjeta. Proporciona toda la información sobre la operación de arrastrar y soltar.

```typescript
interface CardDragDropEvent<T = any> {
	previousIndex: number;
	currentIndex: number;
	container: BoardDropContainer<BoardColumn>;
	previousContainer: BoardDropContainer<BoardColumn>;
	item: BoardDragItem<BoardCard>;
	isPointerOverContainer: boolean;
	distance?: { x: number; y: number };
	dropPoint?: { x: number; y: number };
}
```

### ColumnDragDropEvent

Interfaz de evento emitida cuando se mueve una columna. Proporciona toda la información sobre la operación de reordenación de columnas.

```typescript
interface ColumnDragDropEvent {
	previousIndex: number;
	currentIndex: number;
	container: BoardDropContainer<BoardColumn[]>;
	previousContainer: BoardDropContainer<BoardColumn[]>;
	item: BoardDragItem<BoardColumn>;
	isPointerOverContainer: boolean;
	distance?: { x: number; y: number };
	dropPoint?: { x: number; y: number };
}
```

### DragBehavior

Definición de tipo para controlar cómo se comportan visualmente los elementos arrastrados durante las operaciones de arrastre.

```typescript
type DragBehavior = 'ghost' | 'hide' | 'collapse';
```

**Valores:**

- `'ghost'`: El elemento se vuelve semitransparente (50% de opacidad) pero permanece visible
- `'hide'`: El elemento se oculta pero sigue ocupando su espacio (marcador de posición invisible)
- `'collapse'`: El elemento se oculta por completo y su espacio se colapsa (por defecto)

## 🧩 Estilado

`ng-hub-ui-board` es totalmente configurable en cuanto a estilos mediante propiedades personalizadas de CSS.

Para consultar el catálogo de tokens completo y actualizado, consulta la [Referencia de variables CSS](./docs/css-variables-reference.md).

No hay ninguna hoja de estilos que importar: desde `21.1.0` los estilos están encapsulados en el propio componente. Si tu `styles.scss` global todavía arrastra `@use 'ng-hub-ui-board/src/lib/styles/board.scss'` de una versión anterior, bórralo — ese fichero ya no se publica. El punto de entrada `ng-hub-ui-board/styles` existe solo para el mixin de tema de Sass que se describe más abajo y no emite CSS por sí mismo.

### 🎨 Acento semántico (`variant`)

El marcador de posición de arrastrar y soltar se controla mediante un único token de acento. Pasa el input `variant` para recolorear la zona de destino con un acento semántico:

```html
<hub-board [board]="board()" variant="success"></hub-board>
```

Las variantes integradas (`primary` / `success` / `danger` / `warning` / `info`) usan los tintes exactos del sistema de diseño. También se acepta cualquier otra palabra suelta — el tablero lee `--hub-sys-color-<variant>` de la aplicación anfitriona, de modo que una paleta de acentos personalizada se integra sin cambios en esta biblioteca — y desde `22.3.0` un color literal (`#hex`, `rgb()`, `oklch()`, `var()`) se pasa tal cual. El input no tiene valor por defecto; si no se indica `variant`, el marcador de posición conserva el acento primario.

Internamente, esto rebasa el nuevo token `--hub-board-accent` (y su tinte sutil `--hub-board-accent-subtle`, derivado mediante `color-mix`), a través del cual se resuelven los colores de borde y fondo del marcador de posición:

| Token                        | Descripción                                                                          |
| ---------------------------- | ------------------------------------------------------------------------------------ |
| `--hub-board-accent`         | Acento semántico del marcador de posición de arrastrar y soltar (rebasado por `variant`) |
| `--hub-board-accent-subtle`  | Tinte sutil del acento, usado como fondo del marcador de posición                    |

### 🧵 Mixin Sass `hub-board-theme()`

Tematiza un `<hub-board>` en una sola llamada. Cada parámetro es opcional y por defecto vale `null`, de modo que solo se emiten los que pasas como overrides `--hub-board-*`; el resto conservan sus valores por defecto. Basado en tokens, sin dependencia de Bootstrap.

```scss
@use 'ng-hub-ui-board/styles/mixins/board-theme' as *;

.sprint-board {
	@include hub-board-theme(
		$accent: var(--hub-sys-color-success),
		$column-bg: #f6f8fa,
		$card-border-radius: 0.75rem,
		$columns-gap: 1.25rem
	);
}
```

Los parámetros disponibles cubren el acento, los colores del contenedor/columnas/tarjetas, los bordes y el radio, el espaciado entre columnas, y el padding y la sombra de las tarjetas.

### 🎛 Ejemplo de personalización rápida (independiente del framework)

```scss
.hub-board {
	--hub-board-columns-gap: 1.25rem;
	--hub-board-column-bg: #f8f9fa;
	--hub-board-card-bg: #ffffff;
	--hub-board-card-border-color: #d0d7de;
	--hub-board-placeholder-border-color: #0d6efd;
}
```

### 🔌 Integración con Bootstrap (opcional)

```scss
.hub-board {
	--hub-board-column-bg: var(--bs-light);
	--hub-board-card-bg: var(--bs-body-bg);
	--hub-board-card-border-color: var(--bs-border-color);
	--hub-board-placeholder-border-color: var(--bs-primary);
}
```

## Casos de uso reales

El componente `ng-hub-ui-board` es versátil y se ha utilizado en una gran variedad de aplicaciones reales, como por ejemplo:

- **Herramientas de gestión de proyectos** – Visualiza el progreso de las tareas a través de distintas etapas (To Do, In Progress, Done).
- **Tableros de tickets de soporte** – Organiza los tickets de soporte por urgencia, equipo o estado.
- **Pipelines de selección de personal** – Realiza el seguimiento de candidatos a través de las distintas fases de contratación.
- **Sistemas CRM** – Gestiona leads y clientes en flujos de trabajo tipo pipeline.
- **Calendarios editoriales** – Planifica y organiza el contenido por estado de publicación.

Cada caso se beneficia de columnas, plantillas de tarjetas y outputs de eventos personalizables para integrarse con la lógica de tu aplicación.

## Solución de problemas

Aquí tienes algunos problemas comunes y cómo resolverlos:

### 🔄 El arrastrar y soltar no funciona

- **Comprueba las dependencias**: Asegúrate de que la peer dependency `ng-hub-ui-utils` está instalada (`npm install ng-hub-ui-utils`)
- **Datos reactivos**: Verifica que los datos de tu tablero son reactivos (usando `signal()`, `Observable` o una detección de cambios adecuada)
- **Compatibilidad del navegador**: Asegúrate de que tus navegadores objetivo soportan la API HTML5 de arrastrar y soltar

### 📏 La detección de scroll no dispara `reachedEnd`

- **Restricciones de altura**: El elemento `<hub-board>` o su contenedor padre debe tener un `max-height` o una altura fija
- **Configuración de overflow**: Asegúrate de aplicar `overflow: auto` u `overflow-y: scroll` para habilitar el scroll
- **Longitud del contenido**: Asegúrate de que hay suficiente contenido para disparar realmente el scroll

### 🎨 Los estilos no se aplican

- **No hay nada que importar**: el componente se estila solo. Si tu `styles.scss` global todavía tiene `@use 'ng-hub-ui-board/src/lib/styles/board.scss'` de una versión anterior a la `21.1.0`, bórralo — ese fichero ya no se publica.
- **Propiedades personalizadas de CSS**: Comprueba que tus variables CSS personalizadas siguen la convención de nomenclatura `--hub-*`
- **Especificidad de los estilos**: Asegúrate de que tus estilos personalizados tienen suficiente especificidad para sobrescribir los valores por defecto

### 🧩 Las plantillas no se renderizan

- **Importa las directivas**: Cuando uses componentes standalone, importa las directivas de plantilla:
    ```typescript
    imports: [HubBoardComponent, HubCardTemplateDirective, HubBoardColumnHeaderDirective];
    ```
- **Sintaxis de plantilla**: Verifica que estás usando los selectores de plantilla correctos (`cardTpt`, `columnHeaderTpt`, `columnFooterTpt`)

### 🛠️ Errores en tiempo de ejecución

- **"Cannot read property 'cards' of undefined"**: Inicializa correctamente tu signal del tablero:
    ```typescript
    board = signal<Board>({ title: 'My Board', columns: [] });
    ```
- **Errores de tipo**: Asegúrate de que tus datos coinciden con las interfaces `Board`, `BoardColumn` y `BoardCard`
- **Actualizaciones de signal**: Usa los métodos `.set()` o `.update()` para modificar los valores del signal

### 🎯 Problemas de rendimiento

- **Conjuntos de datos grandes**: Considera implementar scroll virtual para columnas con muchas tarjetas
- **Fugas de memoria**: Asegura una limpieza adecuada de los listeners de eventos y las suscripciones
- **Detección de cambios**: Usa la estrategia de detección de cambios `OnPush` siempre que sea posible

Si los problemas persisten, abre una incidencia en: https://github.com/hub-env/hub-ui/issues

## Contribuir

¡Las contribuciones son bienvenidas! Así es como puedes ayudar:

1. Haz un fork del repositorio
2. Crea tu rama de funcionalidad: `git checkout -b feature/my-new-feature`
3. Confirma tus cambios: `git commit -am 'Add some feature'`
4. Sube la rama: `git push origin feature/my-new-feature`
5. Envía una pull request

## Apoya el proyecto

Si este proyecto te resulta útil y quieres apoyar su desarrollo, puedes invitarme a un café:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://buymeacoffee.com/carlosmorcillo)

¡Tu apoyo es muy apreciado y ayuda a mantener y mejorar este proyecto!

## Licencia

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)

Se relicenció desde CC BY 4.0 en la `22.5.0`; las versiones publicadas antes conservan la licencia con la que salieron. Para los detalles completos, consulta el archivo [LICENSE](LICENSE).

---

Hecho con ❤️ por [Carlos Morcillo Fernández](https://www.carlosmorcillo.com/)
