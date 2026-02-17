import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "../pages/Login.jsx";

test("shows error on invalid login", () => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText("intern@demo.com"), {
    target: { value: "wrong@test.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("intern123"), {
    target: { value: "wrongpass" },
  });

  fireEvent.click(screen.getByText("Sign in"));

  expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
});