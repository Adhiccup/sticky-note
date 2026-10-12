import { useRef, type PointerEvent } from "react";
import type { Note } from "../types/note";

interface StickyNoteProps {
  note: Note;
  onMove: (id: string, x: number, y: number) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDragMove: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;

  onDragEnd: (
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;

  onDragCancel: () => void;

  onTextChange: (id: string, text: string) => void;
  onBringToFront: (id: string) => void;
}

interface ResizeStart {
  pointerId: number;
  pointerX: number;
  pointerY: number;
  width: number;
  height: number;
}

interface DragStart {
  pointerId: number;
  pointerX: number;
  pointerY: number;
  noteX: number;
  noteY: number;
}

export default function StickyNote({
  note,
  onMove,
  onResize,
  onDragMove,
  onDragEnd,
  onDragCancel,
  onTextChange,
  onBringToFront,
}: StickyNoteProps) {
  const dragStart = useRef<DragStart | null>(null);

  const resizeStart = useRef<ResizeStart | null>(null);

  const MIN_WIDTH = 150;
  const MIN_HEIGHT = 120;

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    event.preventDefault();

    dragStart.current = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      noteX: note.x,
      noteY: note.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = dragStart.current;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.pointerX;
    const deltaY = event.clientY - start.pointerY;

    const newX = start.noteX + deltaX;
    const newY = start.noteY + deltaY;

    // Move the note.
    onMove(note.id, newX, newY);

    // Check whether it overlaps the trash.
    onDragMove(note.id, newX, newY, note.width, note.height);
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = dragStart.current;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.pointerX;
    const deltaY = event.clientY - start.pointerY;

    const finalX = start.noteX + deltaX;
    const finalY = start.noteY + deltaY;

    dragStart.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    onDragEnd(note.id, finalX, finalY, note.width, note.height);
  }

  function handlePointerCancel(event: PointerEvent<HTMLDivElement>) {
    if (dragStart.current?.pointerId === event.pointerId) {
      dragStart.current = null;
      onDragCancel();
    }
  }

  function handleResizeStart(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    resizeStart.current = {
      pointerId: event.pointerId,
      pointerX: event.clientX,
      pointerY: event.clientY,
      width: note.width,
      height: note.height,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleResizeMove(event: PointerEvent<HTMLDivElement>) {
    const start = resizeStart.current;

    if (!start || start.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - start.pointerX;

    const deltaY = event.clientY - start.pointerY;

    const board = document.getElementById("sticky-board");

    if (!board) return;

    const maxWidth = board.clientWidth - note.x;

    const maxHeight = board.clientHeight - note.y;

    const newWidth = Math.min(
      Math.max(MIN_WIDTH, start.width + deltaX),
      maxWidth,
    );

    const newHeight = Math.min(
      Math.max(MIN_HEIGHT, start.height + deltaY),
      maxHeight,
    );

    onResize(note.id, newWidth, newHeight);
  }

  function handleResizeEnd(event: PointerEvent<HTMLDivElement>) {
    if (resizeStart.current?.pointerId !== event.pointerId) {
      return;
    }

    resizeStart.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function handleResizeCancel(event: PointerEvent<HTMLDivElement>) {
    if (resizeStart.current?.pointerId === event.pointerId) {
      resizeStart.current = null;
    }
  }

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
      onPointerDown={() => onBringToFront(note.id)}
    >
      <div
        className="note-header"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <span>Sticky Note</span>
      </div>

      <div className="note-content">
        <textarea
          className="note-textarea"
          value={note.text}
          placeholder="Write your note here..."
          onChange={(event) => onTextChange(note.id, event.target.value)}
          aria-label="Sticky note text"
          spellCheck={true}
        />
      </div>

      <div
        className="resize-handle"
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
        onPointerCancel={handleResizeCancel}
      />
    </div>
  );
}
