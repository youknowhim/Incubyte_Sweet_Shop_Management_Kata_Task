import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "../pages/Login";
import { MemoryRouter } from "react-router-dom";

it("renders login form", () => {
  render(<MemoryRouter><Login /></MemoryRouter>);
  expect(
  screen.getByRole("heading", { name: /login/i })
).toBeInTheDocument();

});
