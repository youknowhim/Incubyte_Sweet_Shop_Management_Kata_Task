import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddSweet from "../pages/AddSweet";

describe("AddSweet Page", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("role", "admin");
  });

  it("renders add sweet form", () => {
    render(
      <MemoryRouter>
        <AddSweet />
      </MemoryRouter>
    );

    expect(
    screen.getByRole("heading", { name: /add sweet/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/category/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/quantity/i)).toBeInTheDocument();
  });
});
