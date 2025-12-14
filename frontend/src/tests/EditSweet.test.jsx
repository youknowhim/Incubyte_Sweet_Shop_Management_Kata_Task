import { describe, test, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import EditSweet from "../pages/EditSweet";

describe("EditSweet Page", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    localStorage.setItem("role", "admin");
  });

  it("renders edit sweet form with all fields", () => {
    render(
      <MemoryRouter initialEntries={["/edit/1"]}>
        <Routes>
          <Route path="/edit/:id" element={<EditSweet />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/edit sweet/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/category/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/quantity/i)).toBeInTheDocument();
  });
});
