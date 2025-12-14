import { render, screen } from "@testing-library/react";
import SearchSweets from "../SearchSweets";

beforeEach(() => {
  localStorage.setItem("token", "fake-token");
});

test("renders search form", () => {
  render(<SearchSweets />);

  expect(screen.getByText(/search sweets/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
});
