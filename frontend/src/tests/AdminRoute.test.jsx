import { test, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminRoute from "../routes/AdminRoute";

it("blocks non-admin users", () => {
  localStorage.setItem("token", "fake");
  localStorage.setItem("role", "user");

  const { container } = render(
    <MemoryRouter>
      <AdminRoute>
        <div>Admin</div>
      </AdminRoute>
    </MemoryRouter>
  );

  expect(container.innerHTML).toBe("");
});
