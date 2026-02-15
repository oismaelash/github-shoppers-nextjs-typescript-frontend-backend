import { prisma } from "@/lib/prisma";

export type LedgerEntry = {
  id: string;
  product: string;
  seller: string;
  buyer: string;
  price: number;
  createdAt: Date;
  status: "VERIFIED" | "PENDING";
};

export class LedgerService {
  async list(query?: string): Promise<LedgerEntry[]> {
    const q = query?.trim();
    const purchases = await prisma.purchase.findMany({
      include: {
        item: { select: { name: true, price: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const entries: LedgerEntry[] = purchases.map((p) => ({
      id: p.id,
      product: p.item.name,
      seller: p.sellerGithubLogin ?? "seller",
      buyer: p.githubLogin,
      price: Number(p.pricePaid ?? p.item.price),
      createdAt: p.createdAt,
      status: p.status === "CONFIRMED" ? "VERIFIED" : "PENDING",
    }));

    if (!q) return entries;
    const ql = q.toLowerCase();
    return entries.filter(
      (e) =>
        e.product.toLowerCase().includes(ql) ||
        e.seller.toLowerCase().includes(ql) ||
        e.buyer.toLowerCase().includes(ql)
    );
  }
}
