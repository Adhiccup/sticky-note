
import { useState } from "react";
import Board from "./components/Board";
import StickyNote from "./components/StickyNote";
import type { Note } from "./types/note";

function App() {
  const [notes, setNotes] = useState<Note[]>([]);

  function createNote() {
    const newNote: Note = {
      id: crypto.randomUUID(),
      x: 50 + notes.length * 30,
      y: 50 + notes.length * 30,
      width: 220,
      height: 180,
      text: "",
      color: "yellow",
      zIndex: notes.length + 1,
    };

    setNotes((prevNotes) => [
      ...prevNotes,
      newNote,
    ]);
  }

  return (
    <div className="app">
      <header className="toolbar">
        <h1>Sticky Notes</h1>

        <button
          type="button"
          onClick={createNote}
        >
          + New Note
        </button>
      </header>

      <Board>
        {notes.length === 0 && (
          <p>Click New Note to get started.</p>
        )}

        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
          />
        ))}
      </Board>
    </div>
  );
}

export default App;
