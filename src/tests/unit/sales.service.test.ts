import { describe, expect, it, vi } from "vitest";
import { SalesService } from "@/services/sales.service";

const mockFindById = vi.fn();
const mockFindByItemId = vi.fn();

vi.mock("@/repositories/item.repository", () => {
  return {
    ItemRepository: class {
      findById = mockFindById;
    },
  };
});

vi.mock("@/repositories/purchase.repository", () => {
  return {
    PurchaseRepository: class {
      findByItemId = mockFindByItemId;
    },
  };
});

describe("SalesService", () => {
  it("retorna resumo de vendas do item", async () => {
    mockFindById.mockResolvedValue({
      id: "i1",
      userId: "u1",
      name: "Item",
      description: "Desc",
      price: 10,
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockFindByItemId.mockResolvedValue([
      {
        id: "p1",
        githubLogin: "buyer1",
        pricePaid: "10.00",
        createdAt: new Date("2026-02-13T10:00:00.000Z"),
        status: "CONFIRMED",
      },
    ]);

    const service = new SalesService();
    const summary = await service.getSalesForItem("u1", "i1");
    expect(summary.totalSales).toBe(1);
    expect(summary.revenue).toBe(10);
    expect(summary.sales[0].buyer).toBe("buyer1");
  });

  it("nega quando item não pertence ao usuário", async () => {
    mockFindById.mockResolvedValue({ id: "i1", userId: "u1" });
    const service = new SalesService();
    await expect(service.getSalesForItem("u2", "i1")).rejects.toThrow("Forbidden");
  });

  it("retorna erro quando item não existe", async () => {
    mockFindById.mockResolvedValue(null);
    const service = new SalesService();
    await expect(service.getSalesForItem("u1", "i1")).rejects.toThrow("Item not found");
  });
});
