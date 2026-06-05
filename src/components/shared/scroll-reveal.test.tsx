import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollReveal } from "./scroll-reveal";
import React from "react";

describe("ScrollReveal Component", () => {
  it("renders wrapped children content successfully", () => {
    render(
      <ScrollReveal>
        <p data-testid="reveal-child">Скролл контент</p>
      </ScrollReveal>
    );
    expect(screen.getByTestId("reveal-child")).toBeInTheDocument();
    expect(screen.getByText("Скролл контент")).toBeInTheDocument();
  });
});
