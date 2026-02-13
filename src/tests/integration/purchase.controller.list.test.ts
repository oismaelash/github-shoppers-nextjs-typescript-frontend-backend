import { describe, it, expect, vi, beforeEach } from "vitest";
import { PurchaseController } from "@/controllers/purchase.controller";
import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/utils";

const mockGetAllPurchases = vi.fn();
const mockGetMyPurchases = vi.fn();

vi.mock("@/services/purchase.service", () => {
  return {
    PurchaseService: class {
      createPurchase = vi.fn();
      getAllPurchases = mockGetAllPurchases;
      getMyPurchases = mockGetMyPurchases;
    },
  };
});

vi.mock("@/lib/auth/utils", () => ({
  getAuthSession: vi.fn(),
}));

describe("PurchaseController list", () => {
  let controller: PurchaseController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new PurchaseController();
  });

  it("lista compras (admin) com sessão", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetAllPurchases.mockResolvedValue([]);
    const req = new NextRequest("http://localhost/api/purchases", { method: "GET" });
    const res = await controller.list(req);
    expect(res.status).toBe(200);
  });

  it("lista minhas compras com sessão", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetMyPurchases.mockResolvedValue([]);
    const req = new NextRequest("http://localhost/api/me/purchases", { method: "GET" });
    const res = await controller.listMine(req);
    expect(res.status).toBe(200);
    expect(mockGetMyPurchases).toHaveBeenCalledWith("u1");
  });
});

