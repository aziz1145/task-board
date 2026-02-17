import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 10,
    background: "white",
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{task.title}</strong>

        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task)}>Delete</button>
        </div>
      </div>

      {task.description && (
        <div style={{ fontSize: 13 }}>{task.description}</div>
      )}

      <div style={{ fontSize: 12 }}>
        Priority: {task.priority || "—"}
      </div>

      <div style={{ fontSize: 12 }}>
        Due: {task.dueDate || "—"}
      </div>
    </div>
  );
}