import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login.jsx";

beforeEach(() => {
  localStorage.clear();
});

test("successful login stores auth in localStorage", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText("intern@demo.com"), {
    target: { value: "intern@demo.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("intern123"), {
    target: { value: "intern123" },
  });

  fireEvent.click(screen.getByText("Sign in"));

  const auth = JSON.parse(localStorage.getItem("taskboard_auth"));
  expect(auth.isLoggedIn).toBe(true);
});