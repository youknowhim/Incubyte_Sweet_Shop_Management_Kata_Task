import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard";

test("renders dashboard heading", () => {
  localStorage.setItem("token", "fake");
  render(<Dashboard />);
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});
