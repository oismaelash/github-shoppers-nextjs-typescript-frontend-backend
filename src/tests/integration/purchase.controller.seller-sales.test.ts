import { describe, it, expect, vi, beforeEach } from "vitest";
import { PurchaseController } from "@/controllers/purchase.controller";
import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/utils";

const mockGetSalesForSeller = vi.fn();

vi.mock("@/services/purchase.service", () => {
    return {
        PurchaseService: class {
            getSalesForSeller = mockGetSalesForSeller;
        },
    };
});

vi.mock("@/lib/auth/utils", () => ({
    getAuthSession: vi.fn(),
}));

describe("PurchaseController listSellerSales", () => {
    let controller: PurchaseController;

    beforeEach(() => {
        vi.clearAllMocks();
        controller = new PurchaseController();
    });

    it("returns sales for the logged-in seller", async () => {
        (getAuthSession as any).mockResolvedValue({ user: { id: "seller-1" } });
        mockGetSalesForSeller.mockResolvedValue([
            { id: "p1", item: { name: "Item 1", price: 10 } },
        ]);

        const req = new NextRequest("http://localhost/api/me/sales", { method: "GET" });
        const res = await controller.listSellerSales(req);

        expect(res.status).toBe(200);
        const data = await res.json();
        expect(data).toHaveLength(1);
        expect(data[0].id).toBe("p1");
        expect(mockGetSalesForSeller).toHaveBeenCalledWith("seller-1");
    });

    it("returns 401 if unauthorized", async () => {
        (getAuthSession as any).mockResolvedValue(null);

        const req = new NextRequest("http://localhost/api/me/sales", { method: "GET" });
        const res = await controller.listSellerSales(req);

        expect(res.status).toBe(401);
    });
});
