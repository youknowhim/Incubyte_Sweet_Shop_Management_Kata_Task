import { test, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute";

it("redirects to login if no token", () => {
  localStorage.clear();

  const { container } = render(
    <MemoryRouter>
      <PrivateRoute>
        <div>Protected</div>
      </PrivateRoute>
    </MemoryRouter>
  );

  expect(container.innerHTML).toBe("");
});
