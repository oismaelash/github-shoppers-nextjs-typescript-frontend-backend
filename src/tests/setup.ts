import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/link", () => {
  return {
    default: ({
      href,
      children,
      ...props
    }: {
      href: string;
      children: React.ReactNode;
    }) => (
      React.createElement("a", { href, ...props }, children)
    ),
  };
});

vi.mock("next-auth/react", () => {
  return {
    signIn: vi.fn(),
  };
});
