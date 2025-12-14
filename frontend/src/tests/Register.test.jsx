import { render, screen } from "@testing-library/react";
import Register from "../pages/Register";

test("renders register form", () => {
  render(<Register />);

  expect(screen.getByText(/register/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
});
