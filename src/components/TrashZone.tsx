
interface TrashZoneProps {
  isActive: boolean;
}

export default function TrashZone({
  isActive,
}: TrashZoneProps) {
  return (
    <div
      id="trash-zone"
      className={`trash-zone ${
        isActive ? "trash-zone--active" : ""
      }`}
    >
      <span className="trash-icon">🗑️</span>
      <span>Drop here to delete</span>
    </div>
  );
}
