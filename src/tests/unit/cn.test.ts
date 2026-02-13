import { describe, expect, it } from "vitest";
import { cn } from "@/lib/cn";

describe("cn", () => {
  it("junta classes e remove falsy", () => {
    expect(cn("a", false, "b", null, undefined, "c")).toBe("a b c");
  });
});

