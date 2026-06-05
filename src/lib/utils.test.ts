import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility", () => {
  it("should merge simple class names", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should handle conditional class names", () => {
    expect(cn("class1", true && "class2", false && "class3")).toBe("class1 class2");
  });

  it("should merge tailwind conflicts correctly using tailwind-merge", () => {
    expect(cn("p-4 p-8")).toBe("p-8");
    expect(cn("text-red-500 text-blue-500")).toBe("text-blue-500");
  });
});
