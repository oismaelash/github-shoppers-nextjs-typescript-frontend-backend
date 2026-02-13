import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export interface CreatePurchaseParams {
  itemId: string;
  githubLogin: string;
  buyerUserId?: string | null;
  sellerGithubLogin?: string | null;
  pricePaid?: Prisma.Decimal | number | null;
  status?: "PENDING" | "CONFIRMED" | "FAILED" | "CANCELED";
  paymentMethod?: "PIX" | null;
  paymentReference?: string | null;
}

export class PurchaseRepository {
  async create(data: CreatePurchaseParams, tx: Prisma.TransactionClient) {
    return await tx.purchase.create({
      data: {
        itemId: data.itemId,
        githubLogin: data.githubLogin,
        buyerUserId: data.buyerUserId ?? null,
        sellerGithubLogin: data.sellerGithubLogin ?? null,
        pricePaid: data.pricePaid ?? null,
        status: data.status ?? "CONFIRMED",
        paymentMethod: data.paymentMethod ?? null,
        paymentReference: data.paymentReference ?? null,
      },
    });
  }

  async findAll() {
    return await prisma.purchase.findMany({
      include: {
        item: {
          select: {
            name: true,
            price: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByBuyerUserId(buyerUserId: string) {
    return await prisma.purchase.findMany({
      where: { buyerUserId },
      include: {
        item: {
          select: { id: true, name: true, price: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByItemId(itemId: string) {
    return await prisma.purchase.findMany({
      where: { itemId },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return await prisma.purchase.findUnique({
      where: { id },
      include: {
        item: { select: { name: true, price: true, id: true } },
      },
    });
  }
}
