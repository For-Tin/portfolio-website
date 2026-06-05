import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Helper to filter out framer-motion props before spreading to native elements
const filterMotionProps = (props: any) => {
  const {
    initial,
    animate,
    exit,
    whileInView,
    viewport,
    transition,
    variants,
    whileHover,
    whileTap,
    ...rest
  } = props;
  return rest;
};

// Mock next-themes
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: vi.fn(),
    resolvedTheme: "light",
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/font/google
vi.mock("next/font/google", () => ({
  Geist: () => ({
    variable: "--font-geist-sans",
  }),
  Geist_Mono: () => ({
    variable: "--font-geist-mono",
  }),
}));

// Mock framer-motion to simplify testing components with animations
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    motion: {
      div: React.forwardRef<HTMLDivElement, any>(({ children, ...props }, ref) => (
        <div ref={ref} {...filterMotionProps(props)}>{children}</div>
      )),
      button: React.forwardRef<HTMLButtonElement, any>(({ children, ...props }, ref) => (
        <button ref={ref} {...filterMotionProps(props)}>{children}</button>
      )),
      span: React.forwardRef<HTMLSpanElement, any>(({ children, ...props }, ref) => (
        <span ref={ref} {...filterMotionProps(props)}>{children}</span>
      )),
      h1: React.forwardRef<HTMLHeadingElement, any>(({ children, ...props }, ref) => (
        <h1 ref={ref} {...filterMotionProps(props)}>{children}</h1>
      )),
      p: React.forwardRef<HTMLParagraphElement, any>(({ children, ...props }, ref) => (
        <p ref={ref} {...filterMotionProps(props)}>{children}</p>
      )),
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useMotionValue: (initial: any) => ({
      get: () => initial,
      set: vi.fn(),
      onChange: vi.fn(),
    }),
    useSpring: (val: any) => val,
    useTransform: (val: any, fromRange: any, toRange: any) => {
      return val;
    },
  };
});
