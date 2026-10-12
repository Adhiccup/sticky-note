
import { useState } from "react";
import type { FormEvent } from "react";
import type { NoteColor } from "../types/note";

export interface NewNoteData {
  x: number;
  y: number;
  width: number;
  height: number;
  color: NoteColor;
}

interface NewNoteFormProps {
  onCreate: (data: NewNoteData) => void;
  onCancel: () => void;
}

export default function NewNoteForm({
  onCreate,
  onCancel,
}: NewNoteFormProps) {
  const [x, setX] = useState(100);
  const [y, setY] = useState(100);
  const [width, setWidth] = useState(220);
  const [height, setHeight] = useState(180);
  const [color, setColor] =
    useState<NoteColor>("yellow");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !Number.isFinite(x) ||
      !Number.isFinite(y) ||
      !Number.isFinite(width) ||
      !Number.isFinite(height) ||
      x < 0 ||
      y < 0 ||
      width < 150 ||
      height < 120
    ) {
      alert("Please enter valid note dimensions.");
      return;
    }

    onCreate({
      x,
      y,
      width,
      height,
      color,
    });
  }

  return (
    <div className="form-overlay">
      <form
        className="note-form"
        onSubmit={handleSubmit}
      >
        <h2>Create New Note</h2>

        <label>
          X Position
          <input
            type="number"
            min="0"
            required
            value={x}
            onChange={(e) =>
              setX(e.target.valueAsNumber)
            }
          />
        </label>

        <label>
          Y Position
          <input
            type="number"
            min="0"
            required
            value={y}
            onChange={(e) =>
              setY(e.target.valueAsNumber)
            }
          />
        </label>

        <label>
          Width
          <input
            type="number"
            min="150"
            required
            value={width}
            onChange={(e) =>
              setWidth(e.target.valueAsNumber)
            }
          />
        </label>

        <label>
          Height
          <input
            type="number"
            min="120"
            required
            value={height}
            onChange={(e) =>
              setHeight(e.target.valueAsNumber)
            }
          />
        </label>

        <label>
          Color
          <select
            value={color}
            onChange={(e) =>
              setColor(e.target.value as NoteColor)
            }
          >
            <option value="yellow">Yellow</option>
            <option value="pink">Pink</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </label>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button type="submit">
            Create Note
          </button>
        </div>
      </form>
    </div>
  );
}
