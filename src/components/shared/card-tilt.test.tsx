import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CardTilt } from "./card-tilt";
import React from "react";

describe("CardTilt Component", () => {
  it("renders wrapped children content successfully", () => {
    render(
      <CardTilt>
        <div data-testid="card-child">Контент карточки</div>
      </CardTilt>
    );
    expect(screen.getByTestId("card-child")).toBeInTheDocument();
    expect(screen.getByText("Контент карточки")).toBeInTheDocument();
  });
});
