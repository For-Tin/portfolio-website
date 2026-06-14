import { render, screen, fireEvent, act } from "@testing-library/react";
import Home from "./page";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockResolvedValue({ data: [{ key: "forms_enabled", value: "true" }], error: null }),
    insert: vi.fn().mockResolvedValue({ error: null }),
  }),
}));

vi.mock("@/components/sections/projects-section", () => ({
  ProjectsSection: () => <div>Власні проєкти</div>,
}));

vi.mock("@/app/actions", () => ({
  sendTelegramMessage: vi.fn().mockResolvedValue({ success: true }),
}));

describe("Home page", () => {
  it("renders the hero section correctly", async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    expect(screen.getByText(/Маленький крок для людини./i)).toBeInTheDocument();
    expect(screen.getByText(/Створюю преміальних ботів/i)).toBeInTheDocument();
  });

  it("renders projects section", async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    expect(screen.getByText("Власні проєкти")).toBeInTheDocument();
  });

  it("renders skills section", async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    expect(screen.getByText("Про мене")).toBeInTheDocument();
    expect(screen.getByText("Веб-технології")).toBeInTheDocument();
    expect(screen.getByText("Інструменти / Інше")).toBeInTheDocument();
  });

  it("renders contact form", async () => {
    const ResolvedHome = await Home();
    render(ResolvedHome);
    expect(screen.getByText("Зв'язатися зі мною")).toBeInTheDocument();
    expect(screen.getByLabelText(/Ім'я/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Електронна пошта/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Повідомлення/i)).toBeInTheDocument();
  });

  it("submits the form and shows success message temporarily", async () => {
    vi.useFakeTimers();
    const ResolvedHome = await Home();
    render(ResolvedHome);
    
    const nameInput = screen.getByLabelText(/Ім'я/i);
    const emailInput = screen.getByLabelText(/Електронна пошта/i);
    const messageInput = screen.getByLabelText(/Повідомлення/i);
    const submitButton = screen.getByRole("button", { name: /Надіслати повідомлення/i });

    // Fill form
    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hello, world!" } });

    // Advance timer to bypass anti-spam check
    act(() => {
      vi.advanceTimersByTime(3500);
    });

    // Submit form
    await act(async () => {
      fireEvent.click(submitButton);
    });

    // Verify success message (wait for it to appear)
    expect(screen.getByText("Повідомлення надіслано!")).toBeInTheDocument();

    // The button should show success message
    expect(screen.getByText("Повідомлення надіслано!")).toBeInTheDocument();

    vi.useRealTimers();
  });
});
