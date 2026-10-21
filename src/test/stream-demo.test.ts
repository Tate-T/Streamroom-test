import { describe, expect, it } from "vitest";
import { createMessage } from "../lib/stream-demo";

describe("Local chat", () => {
  it("rejects empty messages", () => {
    expect(createMessage("   ", 1, "12:00")).toBeNull();
  });
  it("creates a trimmed message attributed to the current demo user", () => {
    expect(createMessage("  Привіт!  ", 7, "12:01")).toEqual({ id: 7, author: "Ти", text: "Привіт!", time: "12:01" });
  });
});