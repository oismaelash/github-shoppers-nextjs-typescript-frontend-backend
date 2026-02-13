import { describe, expect, it, vi } from "vitest";
import { LedgerService } from "@/services/ledger.service";

vi.mock("@/lib/prisma", () => {
  return {
    default: {
      purchase: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: "p1",
            githubLogin: "buyer1",
            sellerGithubLogin: "seller1",
            pricePaid: null,
            createdAt: new Date("2026-02-13T10:00:00.000Z"),
            status: "CONFIRMED",
            item: { name: "Item A", price: "10.00" },
          },
          {
            id: "p2",
            githubLogin: "buyer2",
            sellerGithubLogin: null,
            pricePaid: "5.00",
            createdAt: new Date("2026-02-13T09:00:00.000Z"),
            status: "PENDING",
            item: { name: "Item B", price: "7.00" },
          },
        ]),
      },
    },
  };
});

describe("LedgerService", () => {
  it("mapeia purchases para entries e aplica filtro", async () => {
    const service = new LedgerService();
    const all = await service.list();
    expect(all).toHaveLength(2);
    expect(all[0].status).toBe("VERIFIED");
    expect(all[1].status).toBe("PENDING");

    const filtered = await service.list("item b");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].product).toBe("Item B");
  });
});

