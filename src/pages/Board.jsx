import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { DndContext } from "@dnd-kit/core";

import Column from "../components/Column.jsx";
import TaskFormModal from "../components/TaskFormModal.jsx";

import { logout } from "../store/authstore.jsx";
import { loadBoard, saveBoard, resetBoard } from "../store/boardStore";

import ActivityLog from "../components/ActivityLog.jsx";
import {
  loadLog,
  saveLog,
  addLogEntry,
  resetLog,
} from "../store/activityStore";

export default function Board() {
  const navigate = useNavigate();
  const [board, setBoard] = useState(() => loadBoard());
  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortDue, setSortDue] = useState("none");

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // create | edit
  const [activeColumn, setActiveColumn] = useState("todo");
  const [editingTask, setEditingTask] = useState(null);
  const [logs, setLogs] = useState(() => loadLog());

  useEffect(() => {
    saveBoard(board);
  }, [board]);

  useEffect(() => {
    saveLog(logs);
  }, [logs]);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleReset() {
    const ok = window.confirm("Reset board? This will delete all tasks.");
    if (!ok) return;
    setBoard(resetBoard());
    setLogs(resetLog());
  }

  function openCreate(columnKey) {
    setActiveColumn(columnKey);
    setEditingTask(null);
    setModalMode("create");
    setModalOpen(true);
  }

  function openEdit(task) {
    setEditingTask(task);
    setModalMode("edit");
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleSaveTask(data) {
    if (modalMode === "create") {
      const newTask = {
        id: nanoid(),
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        tags: data.tags,
        createdAt: new Date().toISOString(),
      };

      setBoard((prev) => ({
        columns: {
          ...prev.columns,
          [activeColumn]: [newTask, ...prev.columns[activeColumn]],
        },
      }));

      setLogs(
        addLogEntry({
          type: "created",
          message: `Task "${newTask.title}" created`,
        }),
      );
    } else {
      // edit: find and update task in any column
      setBoard((prev) => {
        const next = structuredClone(prev);

        for (const colKey of ["todo", "doing", "done"]) {
          const idx = next.columns[colKey].findIndex(
            (t) => t.id === editingTask.id,
          );
          if (idx !== -1) {
            next.columns[colKey][idx] = {
              ...next.columns[colKey][idx],
              title: data.title,
              description: data.description,
              priority: data.priority,
              dueDate: data.dueDate,
              tags: data.tags,
            };
            break;
          }
        }

        return next;
      });
      setLogs(
        addLogEntry({ type: "edited", message: `Task "${data.title}" edited` }),
      );
    }

    setModalOpen(false);
  }

  function handleDeleteTask(task) {
    const ok = window.confirm(`Delete "${task.title}"?`);
    if (!ok) return;

    setBoard((prev) => {
      const next = structuredClone(prev);
      for (const colKey of ["todo", "doing", "done"]) {
        next.columns[colKey] = next.columns[colKey].filter(
          (t) => t.id !== task.id,
        );
      }
      return next;
    });
    setLogs(
      addLogEntry({ type: "deleted", message: `Task "${task.title}" deleted` }),
    );
  }

  function applyView(tasks) {
    let list = [...tasks];

    const q = searchText.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => (t.title || "").toLowerCase().includes(q));
    }

    if (priorityFilter !== "all") {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    if (sortDue !== "none") {
      list.sort((a, b) => {
        const aEmpty = !a.dueDate;
        const bEmpty = !b.dueDate;

        if (aEmpty && bEmpty) return 0;
        if (aEmpty) return 1;
        if (bEmpty) return -1;

        const aTime = new Date(a.dueDate).getTime();
        const bTime = new Date(b.dueDate).getTime();

        return sortDue === "asc" ? aTime - bTime : bTime - aTime;
      });
    }

    return list;
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const targetColumn = over.id;

    let sourceColumn = null;
    let movedTask = null;

    for (const colKey of ["todo", "doing", "done"]) {
      const task = board.columns[colKey].find((t) => t.id === taskId);
      if (task) {
        sourceColumn = colKey;
        movedTask = task;
        break;
      }
    }

    if (!sourceColumn || sourceColumn === targetColumn) return;

    setBoard((prev) => {
      const next = structuredClone(prev);

      next.columns[sourceColumn] = next.columns[sourceColumn].filter(
        (t) => t.id !== taskId,
      );

      next.columns[targetColumn].unshift(movedTask);

      return next;
    });

    const names = { todo: "Todo", doing: "Doing", done: "Done" };

    setLogs(
      addLogEntry({
        type: "moved",
        message: `Task "${movedTask.title}" moved to ${names[targetColumn]}`,
      }),
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h1 style={{ margin: 0 }}>Task Board</h1>
        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <input
            placeholder="Search by title..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ padding: 10 }}
          />

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select value={sortDue} onChange={(e) => setSortDue(e.target.value)}>
            <option value="none">No sort</option>
            <option value="asc">Earliest first</option>
            <option value="desc">Latest first</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleReset}>Reset Board</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Column
            columnKey="todo"
            title="Todo"
            tasks={applyView(board.columns.todo)}
            onAdd={() => openCreate("todo")}
            onEdit={openEdit}
            onDelete={handleDeleteTask}
          />

          <Column
            columnKey="doing"
            title="Doing"
            tasks={applyView(board.columns.doing)}
            onAdd={() => openCreate("doing")}
            onEdit={openEdit}
            onDelete={handleDeleteTask}
          />

          <Column
            columnKey="done"
            title="Done"
            tasks={applyView(board.columns.done)}
            onAdd={() => openCreate("done")}
            onEdit={openEdit}
            onDelete={handleDeleteTask}
          />
        </div>
      </DndContext>

      <TaskFormModal
        open={modalOpen}
        mode={modalMode}
        initialTask={editingTask}
        onClose={closeModal}
        onSave={handleSaveTask}
      />
      <ActivityLog logs={logs} />
    </div>
  );
}
