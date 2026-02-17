import { useEffect, useMemo, useState } from "react";

const PRIORITIES = ["low", "medium", "high"];

export default function TaskFormModal({ open, mode, initialTask, onClose, onSave }) {
  const isEdit = mode === "edit";

  const initial = useMemo(() => {
    return {
      title: initialTask?.title ?? "",
      description: initialTask?.description ?? "",
      priority: initialTask?.priority ?? "medium",
      dueDate: initialTask?.dueDate ?? "",
      tagsText: Array.isArray(initialTask?.tags) ? initialTask.tags.join(", ") : "",
    };
  }, [initialTask]);

  const [title, setTitle] = useState(initial.title);
  const [description, setDescription] = useState(initial.description);
  const [priority, setPriority] = useState(initial.priority);
  const [dueDate, setDueDate] = useState(initial.dueDate);
  const [tagsText, setTagsText] = useState(initial.tagsText);
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initial.title);
    setDescription(initial.description);
    setPriority(initial.priority);
    setDueDate(initial.dueDate);
    setTagsText(initial.tagsText);
    setError("");
  }, [initial]);

  if (!open) return null;

  function handleSave() {
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || "",
      tags,
    });
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "white",
          borderRadius: 12,
          padding: 16,
          boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>{isEdit ? "Edit Task" : "New Task"}</h2>

        <label style={{ display: "block", marginBottom: 6 }}>Title *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%", padding: 10 }} />

        <label style={{ display: "block", marginTop: 12, marginBottom: 6 }}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: 10 }}
        />

        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ width: "100%", padding: 10 }}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 6 }}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />
          </div>
        </div>

        <label style={{ display: "block", marginTop: 12, marginBottom: 6 }}>Tags (comma separated)</label>
        <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} style={{ width: "100%", padding: 10 }} />

        {error ? (
          <div style={{ marginTop: 12, background: "#ffe8e8", padding: 10, borderRadius: 8 }}>{error}</div>
        ) : null}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>{isEdit ? "Save Changes" : "Create Task"}</button>
        </div>
      </div>
    </div>
  );
}