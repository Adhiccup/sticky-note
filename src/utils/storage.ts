
import type { Note, NoteColor } from "../types/note";

const STORAGE_KEY = "sticky-notes-v1";

const NOTE_COLORS: NoteColor[] = [
  "yellow",
  "pink",
  "blue",
  "green",
];

function isValidNote(value: unknown): value is Note {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const note = value as Record<string, unknown>;

  return (
    typeof note.id === "string" &&
    typeof note.x === "number" &&
    Number.isFinite(note.x) &&
    note.x >= 0 &&
    typeof note.y === "number" &&
    Number.isFinite(note.y) &&
    note.y >= 0 &&
    typeof note.width === "number" &&
    Number.isFinite(note.width) &&
    note.width >= 150 &&
    typeof note.height === "number" &&
    Number.isFinite(note.height) &&
    note.height >= 120 &&
    typeof note.text === "string" &&
    typeof note.color === "string" &&
    NOTE_COLORS.some(
      (color) => color === note.color
    ) &&
    typeof note.zIndex === "number" &&
    Number.isSafeInteger(note.zIndex) &&
    note.zIndex >= 0
  );
}

export function loadNotes(): Note[] {
  try {
    const savedData =
      localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
      return [];
    }

    const parsed: unknown = JSON.parse(savedData);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidNote);
  } catch (error) {
    console.error("Failed to load notes:", error);
    return [];
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(notes)
    );
  } catch (error) {
    console.error("Failed to save notes:", error);
  }
}
