import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";

test("redirects to login if no token", () => {
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
