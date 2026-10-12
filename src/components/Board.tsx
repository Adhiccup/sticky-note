
import type { ReactNode } from "react";

interface BoardProps {
  children: ReactNode;
}

export default function Board({
  children,
}: BoardProps) {
  return (
    <main
      className="board"
      id="sticky-board"
    >
      {children}
    </main>
  );
}
