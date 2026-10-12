import { useEffect, useState } from "react";
import Board from "./components/Board";
import StickyNote from "./components/StickyNote";
import type { Note } from "./types/note";
import { rectanglesOverlap } from "./utils/geometry";
import TrashZone from "./components/TrashZone";
import NewNoteForm, { type NewNoteData } from "./components/NewNoteForm";
import { loadNotes, saveNotes } from "./utils/storage";

function App() {
  const [notes, setNotes] = useState<Note[]>(() => loadNotes());
  const [noteOverTrash, setNoteOverTrash] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  function createNote(data: NewNoteData) {
    const board = document.getElementById("sticky-board");

    if (!board) return;

    const boardWidth = board.clientWidth;
    const boardHeight = board.clientHeight;

    if (
      data.x + data.width > boardWidth ||
      data.y + data.height > boardHeight
    ) {
      alert("The note must fit completely inside the board.");
      return;
    }

    const newNote: Note = {
      id: crypto.randomUUID(),
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
      text: "",
      color: data.color,
      zIndex: Math.max(0, ...notes.map((note) => note.zIndex)) + 1,
    };

    setNotes((prevNotes) => [...prevNotes, newNote]);

    setShowCreateForm(false);
  }

  function getConstrainedPosition(note: Note, x: number, y: number) {
    const board = document.getElementById("sticky-board");

    if (!board) {
      return { x: note.x, y: note.y };
    }

    const maxX = Math.max(0, board.clientWidth - note.width);

    const maxY = Math.max(0, board.clientHeight - note.height);

    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
    };
  }

  function moveNote(id: string, x: number, y: number) {
    setNotes((prevNotes) =>
      prevNotes.map((note) => {
        if (note.id !== id) return note;

        const position = getConstrainedPosition(note, x, y);

        return {
          ...note,
          ...position,
        };
      }),
    );
  }

  function resizeNote(id: string, width: number, height: number) {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, width, height } : note,
      ),
    );
  }

  function updateNoteText(id: string, text: string) {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, text } : note)),
    );
  }

  function bringNoteToFront(id: string) {
    setNotes((prevNotes) => {
      const selectedNote = prevNotes.find((note) => note.id === id);

      if (!selectedNote) {
        return prevNotes;
      }

      const maxZIndex = Math.max(0, ...prevNotes.map((note) => note.zIndex));

      if (selectedNote.zIndex === maxZIndex) {
        return prevNotes;
      }

      return prevNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              zIndex: maxZIndex + 1,
            }
          : note,
      );
    });
  }

  function isNoteOverTrash(
    x: number,
    y: number,
    width: number,
    height: number,
  ): boolean {
    const board = document.getElementById("sticky-board");

    const trash = document.getElementById("trash-zone");

    if (!board || !trash) {
      return false;
    }

    const boardRect = board.getBoundingClientRect();
    const trashRect = trash.getBoundingClientRect();

    const noteRect = {
      left: boardRect.left + x,
      top: boardRect.top + y,
      right: boardRect.left + x + width,
      bottom: boardRect.top + y + height,
    };

    return rectanglesOverlap(noteRect, trashRect);
  }

  function handleDragOverTrash(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    const position = getConstrainedPosition(
      { id, x, y, width, height, text: "", color: "yellow", zIndex: 0 },
      x,
      y,
    );

    setNoteOverTrash(
      isNoteOverTrash(position.x, position.y, width, height) ? id : null,
    );
  }

  function handleNoteDrop(
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) {
    const position = getConstrainedPosition(
      { id, x, y, width, height, text: "", color: "yellow", zIndex: 0 },
      x,
      y,
    );

    if (isNoteOverTrash(position.x, position.y, width, height)) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } else {
      moveNote(id, position.x, position.y);
    }

    setNoteOverTrash(null);
  }

  return (
    <div className="app">
      <header className="toolbar">
        <h1>Sticky Notes</h1>

        <button type="button" onClick={() => setShowCreateForm(true)}>
          + New Note
        </button>
      </header>

      <Board>
        {notes.length === 0 && <p>Click New Note to get started.</p>}

        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onMove={moveNote}
            onResize={resizeNote}
            onDragMove={handleDragOverTrash}
            onDragEnd={handleNoteDrop}
            onDragCancel={() => setNoteOverTrash(null)}
            onTextChange={updateNoteText}
            onBringToFront={bringNoteToFront}
          />
        ))}

        <TrashZone isActive={noteOverTrash !== null} />
      </Board>
      {showCreateForm && (
        <NewNoteForm
          onCreate={createNote}
          onCancel={() => setShowCreateForm(false)}
        />
      )}
    </div>
  );
}

export default App;
