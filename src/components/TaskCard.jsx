import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({ task, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    border: "1px solid #eee",
    borderRadius: 12,
    padding: 10,
    background: "white",
    opacity: isDragging ? 0.6 : 1,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <strong style={{ wordBreak: "break-word" }}>{task.title}</strong>

        <div style={{ display: "flex", gap: 6 }}>
          {/* Drag handle (ONLY this part drags) */}
          <span
            {...listeners}
            {...attributes}
            title="Drag"
            style={{
              cursor: "grab",
              userSelect: "none",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "2px 8px",
              fontSize: 12,
            }}
          >
            Drag
          </span>

          {/* Buttons: stop drag from hijacking clicks */}
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onEdit(task)}
            style={{ fontSize: 12 }}
          >
            Edit
          </button>

          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onDelete(task)}
            style={{ fontSize: 12 }}
          >
            Delete
          </button>
        </div>
      </div>

      {task.description ? (
        <div style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>{task.description}</div>
      ) : null}

      <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap", fontSize: 12, opacity: 0.75 }}>
        {task.priority ? <span>Priority: {task.priority}</span> : null}
        <span>Due: {task.dueDate || "—"}</span>
      </div>
    </div>
  );
}