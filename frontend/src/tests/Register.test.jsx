import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Register from "../pages/Register";

it("renders register form", () => {
  render(<Register />);

  expect(
  screen.getByRole("heading", { name: /register/i })
  ).toBeInTheDocument();

  expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});
