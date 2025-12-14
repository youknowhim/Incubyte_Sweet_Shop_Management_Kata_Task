import { render, screen } from "@testing-library/react";
import AddSweet from "../AddSweet";

beforeEach(() => {
  localStorage.setItem("token", "fake-token");
  localStorage.setItem("role", "admin");
});

test("renders add sweet form", () => {
  render(<AddSweet />);

  expect(screen.getByText(/add sweet/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/category/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/price/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/quantity/i)).toBeInTheDocument();
});
