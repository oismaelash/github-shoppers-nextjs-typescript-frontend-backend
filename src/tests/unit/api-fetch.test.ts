import { describe, expect, it, vi } from "vitest";
import { apiFetch, ApiError } from "@/lib/api-fetch";

describe("apiFetch", () => {
  it("retorna JSON quando ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ ok: true }),
      })
    );

    await expect(apiFetch<{ ok: boolean }>("/api/x")).resolves.toEqual({ ok: true });
  });

  it("lança ApiError com status e payload", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ error: "Bad request" }),
      })
    );

    await expect(apiFetch("/api/x")).rejects.toBeInstanceOf(ApiError);
    await apiFetch("/api/x").catch((e) => {
      expect(e).toBeInstanceOf(ApiError);
      const err = e as ApiError;
      expect(err.status).toBe(400);
      expect(err.message).toBe("Bad request");
    });
  });

  it("retorna texto bruto quando resposta não é JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => "plain",
      })
    );

    await expect(apiFetch<string>("/api/x")).resolves.toBe("plain");
  });

  it("usa mensagem padrão quando erro não tem campo error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "oops",
      })
    );

    await apiFetch("/api/x").catch((e) => {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).message).toContain("status 500");
    });
  });

  it("converte error não-string em string", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        text: async () => JSON.stringify({ error: { code: "X" } }),
      })
    );
    await apiFetch("/api/y").catch((e) => {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).message).toContain("[object Object]");
    });
  });
});
