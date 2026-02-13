import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

export interface CreatePurchaseParams {
  itemId: string;
  githubLogin: string;
}

export class PurchaseRepository {
  async create(data: CreatePurchaseParams, tx: Prisma.TransactionClient) {
    return await tx.purchase.create({
      data: {
        itemId: data.itemId,
        githubLogin: data.githubLogin,
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
