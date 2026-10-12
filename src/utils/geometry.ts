
export interface Rectangle {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function rectanglesOverlap(
  a: Rectangle,
  b: Rectangle
): boolean {
  return (
    a.left < b.right &&
    a.right > b.left &&
    a.top < b.bottom &&
    a.bottom > b.top
  );
}
