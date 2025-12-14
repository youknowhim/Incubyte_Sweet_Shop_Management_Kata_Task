import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";

it("renders login form", () => {
  render(<Login />);
  expect(
  screen.getByRole("heading", { name: /login/i })
).toBeInTheDocument();

});
