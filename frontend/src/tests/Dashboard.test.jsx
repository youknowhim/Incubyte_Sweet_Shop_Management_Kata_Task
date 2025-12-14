import { render, screen } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";

test("renders dashboard heading", () => {
  localStorage.setItem("token", "fake");
  render(<Dashboard />);
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search sweets/i)).toBeInTheDocument();

});
