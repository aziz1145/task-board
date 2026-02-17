import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Board from "../pages/Board.jsx";

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("taskboard_auth", JSON.stringify({ isLoggedIn: true, remember: true }));
  localStorage.setItem(
    "taskboard_board_v1",
    JSON.stringify({
      columns: {
        todo: [{ id: "1", title: "Test", createdAt: new Date().toISOString() }],
        doing: [],
        done: [],
      },
    })
  );
});

test("reset board clears tasks after confirmation", () => {
  // confirm() should return true in test
  vi.spyOn(window, "confirm").mockReturnValue(true);

  render(
    <BrowserRouter>
      <Board />
    </BrowserRouter>
  );

  fireEvent.click(screen.getByText(/reset board/i));

  const board = JSON.parse(localStorage.getItem("taskboard_board_v1"));
  expect(board.columns.todo.length).toBe(0);

  window.confirm.mockRestore();
});