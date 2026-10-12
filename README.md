# Sticky Notes — React & TypeScript

A desktop-focused, single-page sticky notes application built for a front-end developer take-home assessment. Users can create, organize, edit, move, resize, and delete notes on a free-positioning board. The interactions are implemented with native browser APIs instead of ready-made drag-and-drop components.

## Features

### Core requirements

- **Create notes:** Choose a note's X/Y position, width, height, and color.
- **Move notes:** Drag a note by its header using Pointer Events.
- **Resize notes:** Drag the bottom-right resize handle, with minimum-size and board-boundary constraints.
- **Delete notes:** Drag and release a note over the predefined trash zone; the zone highlights on overlap.

### Additional features

- **Edit note text:** Write and edit multi-line content directly within notes.
- **Bring notes to front:** Click or interact with a note to place it above overlapping notes.
- **Multiple colors:** Choose yellow, pink, blue, or green.
- **Local persistence (optional):** The project includes a proposed `localStorage` implementation to save and restore notes. Keep this item in the submitted README **only after** integrating and testing `src/utils/storage.ts` and the `App.tsx` persistence effect.

**Not implemented:** REST API persistence (optional in the assessment).

## Tech stack

- React
- TypeScript
- Vite
- CSS (custom components and styling)
- Browser Pointer Events and DOM APIs
- Browser `localStorage` (if the persistence step is integrated)

## Getting started

### Prerequisites

- Node.js and npm, using a Node.js version supported by the installed Vite release

### Installation

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local URL displayed by Vite (typically `http://localhost:5173/`).

### Production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## How to use

1. Click **+ New Note** to open the creation form.
2. Enter an **X position**, **Y position**, **width**, and **height**, and select a color.
3. Click **Create Note**. The note appears at the requested location on the board, provided it fits.
4. Drag the note's **header** to move it.
5. Drag the **bottom-right corner** to resize it.
6. Click the text area to edit its contents.
7. Click a note to bring it in front of overlapping notes.
8. Drag a note onto the **trash zone** and release it to delete the note.
9. If persistence has been enabled, refresh to verify that your notes are restored.

## Project structure

```text
src/
├── components/
│   ├── Board.tsx          # Board/canvas layout
│   ├── StickyNote.tsx     # Note rendering, dragging, resizing, editing
│   ├── TrashZone.tsx      # Delete target and feedback
│   └── NewNoteForm.tsx    # Position, size, and color inputs
├── types/
│   └── note.ts            # Note and color types
├── utils/
│   ├── geometry.ts        # Rectangle overlap calculation
│   └── storage.ts         # Optional save/load helpers, if integrated
├── App.tsx                # Notes state and interaction callbacks
├── index.css              # Application styling
└── main.tsx               # React entry point
```

## Architecture

The application uses a component-based React architecture with TypeScript. `App.tsx` owns the notes collection and updates note data through immutable state transitions. `Board` provides the positioning area, `StickyNote` renders each note and handles user interaction, `NewNoteForm` collects creation parameters, and `TrashZone` displays the deletion target. A `Note` interface defines each note's identifier, position, dimensions, text, color, and stacking order.

Dragging and resizing are implemented with native Pointer Events and pointer capture, without third-party drag-and-drop libraries. Refs hold the initial pointer coordinates and note measurements during interactions, while callbacks request state updates in `App`. Boundary calculations constrain note position and dimensions, and a reusable rectangle-intersection utility checks whether a dragged note overlaps the trash zone before deletion on pointer release. The note's `zIndex` determines its stacking order.

UI components, domain types, and geometry logic are kept separate to make the code easier to maintain and test. The optional persistence layer serializes the notes collection to `localStorage` and validates saved data before restoring it on page load; this paragraph describes that design only if the storage code has been integrated. The application favors native web APIs, explicit TypeScript contracts, and lightweight custom styling to meet the assessment's emphasis on architecture, performance, code quality, static typing, and usability.

## Assessment requirements and testing

The assessment requests **at least three of four** core features; this project is designed to cover all four. It targets desktop displays with a **minimum resolution of 1024 × 768** and the latest **Google Chrome (Windows and macOS), Mozilla Firefox, and Microsoft Edge**.

Before submitting, manually verify:

- Create a note at the specified size and position; reject invalid or out-of-board values.
- Move and resize several notes, including near board edges.
- Drag a note over the trash zone, move it away, and drop it to test both keep and delete cases.
- Edit text without accidentally moving the note.
- Bring an overlapped note to the front.
- If enabled, save and restore notes after refresh and handle malformed storage gracefully.
- Test a desktop viewport of 1024 × 768 and each required browser.
- Run `npm run build` successfully.

## Scope and known limitations

- This is a client-side application; it does not provide a REST API or multi-user synchronization.
- Existing notes may need additional adjustment when the browser window is reduced in size; verify this scenario before submission.
- Notes saved in `localStorage`, if enabled, are specific to the browser and origin, not synced across devices.

## Assessment submission

Submit the complete source code, this README (including the three-paragraph architecture description), and the build instructions above. Keep code comments concise and in English.
