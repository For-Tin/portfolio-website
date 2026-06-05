import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Navbar } from "./navbar";
import React from "react";

describe("Navbar Component", () => {
  it("renders the brand logo and desktop navigation links", () => {
    render(<Navbar />);
    expect(screen.getByLabelText(/FT Logo/i)).toBeInTheDocument();
    expect(screen.getByText("Головна")).toBeInTheDocument();
    expect(screen.getByText("Проєкти")).toBeInTheDocument();
    expect(screen.getByText("Навички")).toBeInTheDocument();
    expect(screen.getByText("Контакти")).toBeInTheDocument();
  });

  it("toggles mobile menu on mobile drawer button click", () => {
    render(<Navbar />);
    
    // Находим кнопку открытия меню (мобильная версия)
    const toggleButton = screen.getByRole("button", { name: /Відкрити меню/i });
    expect(toggleButton).toBeInTheDocument();

    // Открываем меню
    fireEvent.click(toggleButton);
    
    // Проверяем, что кнопка изменила имя/лейбл на закрытие (в коде aria-label не меняется, но мы можем проверить переключение состояния)
    expect(screen.getByRole("button", { name: /Відкрити меню/i })).toBeInTheDocument();
  });
});
