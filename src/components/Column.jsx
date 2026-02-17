import TaskCard from "./TaskCard.jsx";

export default function Column({ title, tasks = [], onAdd, onEdit, onDelete }) {
  return (
    <div style={{ flex: 1, border: "1px solid #ddd", borderRadius: 12, padding: 12, minHeight: 450 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <button onClick={onAdd} style={{ fontSize: 12 }}>
          + Add
        </button>
      </div>

      {tasks.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No tasks</p>
      ) : (
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
      )}
    </div>
  );
}