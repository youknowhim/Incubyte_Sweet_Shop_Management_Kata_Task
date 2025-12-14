import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { MemoryRouter } from "react-router-dom";

it("renders dashboard heading", () => {
  localStorage.setItem("token", "fake");
  render(
  <MemoryRouter>
    <Dashboard />
    </MemoryRouter>);
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search sweets/i)).toBeInTheDocument();

});
