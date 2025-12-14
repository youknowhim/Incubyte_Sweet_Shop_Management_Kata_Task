import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RestockSweet from "../pages/RestockSweet";

beforeEach(() => {
  localStorage.setItem("token", "fake");
  localStorage.setItem("role", "admin");
});

test("renders restock form for admin", () => {
  render(
    <MemoryRouter initialEntries={["/restock/1"]}>
      <Routes>
        <Route path="/restock/:id" element={<RestockSweet />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/restock sweet/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/amount/i)).toBeInTheDocument();
});
