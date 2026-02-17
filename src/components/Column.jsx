import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard.jsx";

export default function Column({
  columnKey,
  title,
  tasks = [],
  onAdd,
  onEdit,
  onDelete,
}) {

  // ✅ ADD THIS HERE (top of component)
  const { setNodeRef } = useDroppable({
    id: columnKey,
  });

  return (
    // ✅ attach ref here
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 12,
        minHeight: 400,
        background: "#fafafa",
      }}
    >

      {/* Column header */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <h2>{title}</h2>
        <button onClick={onAdd}>+ Add</button>
      </div>

      {/* Tasks */}
      <div style={{ display: "grid", gap: 10 }}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

    </div>
  );
}
