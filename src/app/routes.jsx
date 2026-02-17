import { Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Board from "../pages/Board.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

export const routes = [
  { path: "/login", element: <Login /> },

  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Board />
      </ProtectedRoute>
    ),
  },

  // fallback
  { path: "*", element: <Navigate to="/" replace /> },
];