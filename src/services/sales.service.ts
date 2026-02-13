import { ItemRepository } from "@/repositories/item.repository";
import { PurchaseRepository } from "@/repositories/purchase.repository";

export type SalesSummary = {
  totalSales: number;
  revenue: number;
  sales: Array<{
    id: string;
    buyer: string;
    pricePaid: number;
    createdAt: Date;
    status: "CONFIRMED" | "PENDING";
  }>;
};

export class SalesService {
  private itemRepository: ItemRepository;
  private purchaseRepository: PurchaseRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
    this.purchaseRepository = new PurchaseRepository();
  }

  async getSalesForItem(userId: string, itemId: string): Promise<SalesSummary> {
    const item = await this.itemRepository.findById(itemId);
    if (!item) throw new Error("Item not found");
    if (item.userId !== userId) throw new Error("Forbidden");

    const purchases = await this.purchaseRepository.findByItemId(itemId);

    const sales: SalesSummary["sales"] = purchases.map((p) => ({
      id: p.id,
      buyer: p.githubLogin,
      pricePaid: Number(p.pricePaid ?? 0),
      createdAt: p.createdAt,
      status: p.status === "CONFIRMED" ? "CONFIRMED" : "PENDING",
    }));

    const revenue = sales.reduce((acc, s) => acc + s.pricePaid, 0);

    return {
      totalSales: sales.length,
      revenue,
      sales,
    };
  }
}
