
import type { Note } from "../types/note";

interface StickyNoteProps {
  note: Note;
}

export default function StickyNote({
  note,
}: StickyNoteProps) {
  return (
    <div
      className={`sticky-note sticky-note--${note.color}`}
      style={{
        position: "absolute",
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        zIndex: note.zIndex,
      }}
    >
      <div className="note-header">
        <span>Sticky Note</span>
      </div>

      <div className="note-content">
        {note.text || "New note"}
      </div>

      <div className="resize-handle" />
    </div>
  );
}
