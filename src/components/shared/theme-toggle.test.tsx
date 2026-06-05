import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";
import React from "react";

// Локальный мок next-themes для проверки клика
vi.mock("next-themes", () => {
  const setThemeMock = vi.fn();
  return {
    useTheme: () => ({
      theme: "light",
      setTheme: setThemeMock,
      resolvedTheme: "light",
    }),
  };
});

describe("ThemeToggle Component", () => {
  it("renders the toggle button", () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /Зміна теми/i });
    expect(button).toBeInTheDocument();
  });

  it("calls setTheme with the opposite theme when clicked", () => {
    const { setTheme } = useTheme();
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /Зміна теми/i });
    fireEvent.click(button);
    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
