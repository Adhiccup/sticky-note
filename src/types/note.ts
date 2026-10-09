
export type NoteColor =
  | "yellow"
  | "pink"
  | "blue"
  | "green";

export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: NoteColor;
  zIndex: number;
}
