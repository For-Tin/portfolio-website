import { render, screen, fireEvent, act } from "@testing-library/react";
import Home from "./page";
import { describe, it, expect, vi } from "vitest";

describe("Home page", () => {
  it("renders the hero section correctly", () => {
    render(<Home />);
    expect(screen.getByText(/Маленький крок для людини./i)).toBeInTheDocument();
    expect(screen.getByText(/Створюю преміальних ботів/i)).toBeInTheDocument();
  });

  it("renders projects section", () => {
    render(<Home />);
    expect(screen.getByText("Власні проєкти")).toBeInTheDocument();
  });

  it("renders skills section", () => {
    render(<Home />);
    expect(screen.getByText("Про мене")).toBeInTheDocument();
    expect(screen.getByText("Веб-технології")).toBeInTheDocument();
    expect(screen.getByText("Інструменти / Інше")).toBeInTheDocument();
  });

  it("renders contact form", () => {
    render(<Home />);
    expect(screen.getByText("Зв'язатися зі мною")).toBeInTheDocument();
    expect(screen.getByLabelText("Ім'я")).toBeInTheDocument();
    expect(screen.getByLabelText("Електронна пошта")).toBeInTheDocument();
    expect(screen.getByLabelText("Повідомлення")).toBeInTheDocument();
  });

  it("submits the form and shows success message temporarily", () => {
    vi.useFakeTimers();
    render(<Home />);
    
    const nameInput = screen.getByLabelText("Ім'я");
    const emailInput = screen.getByLabelText("Електронна пошта");
    const messageInput = screen.getByLabelText("Повідомлення");
    const submitButton = screen.getByRole("button", { name: /Надіслати повідомлення/i });

    // Fill form
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hello, world!" } });

    // Submit form
    act(() => {
      fireEvent.click(submitButton);
    });

    // Verify success message
    expect(screen.getByText("Повідомлення надіслано!")).toBeInTheDocument();

    // Fast forward timers
    act(() => {
      vi.advanceTimersByTime(3500); // 3500 just to be safe
    });

    // Verify button resets back to original state
    expect(screen.queryByText("Повідомлення надіслано!")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Надіслати повідомлення/i })).toBeInTheDocument();

    vi.useRealTimers();
  });
});
