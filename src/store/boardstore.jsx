import { getStorageItem, setStorageItem } from "../utils/storage";

const BOARD_KEY = "taskboard_board_v1";

export const DEFAULT_BOARD = {
  columns: {
    todo: [],
    doing: [],
    done: [],
  },
};

export function loadBoard() {
  // Handle empty/missing storage safely (assignment requirement)
  const board = getStorageItem(BOARD_KEY, null);
  if (!board || typeof board !== "object" || !board.columns) return DEFAULT_BOARD;

  // Ensure required columns exist
  return {
    columns: {
      todo: Array.isArray(board.columns.todo) ? board.columns.todo : [],
      doing: Array.isArray(board.columns.doing) ? board.columns.doing : [],
      done: Array.isArray(board.columns.done) ? board.columns.done : [],
    },
  };
}

export function saveBoard(board) {
  setStorageItem(BOARD_KEY, board);
}

export function resetBoard() {
  setStorageItem(BOARD_KEY, DEFAULT_BOARD);
  return DEFAULT_BOARD;
}