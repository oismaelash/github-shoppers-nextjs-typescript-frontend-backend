import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { CreateItemDTO, ItemResponseDTO } from "@/dto/item.dto";

export class ItemRepository {
  async create(
    data: CreateItemDTO & { userId?: string | null }
  ): Promise<ItemResponseDTO> {
    const item = await prisma.item.create({
      data: {
        userId: data.userId ?? null,
        name: data.name,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
      },
    });

    // Convert Decimal to number for DTO compatibility
    return {
      ...item,
      price: Number(item.price)
    };
  }

  async findAll(): Promise<ItemResponseDTO[]> {
    const items = await prisma.item.findMany({
      include: {
        user: { select: { githubLogin: true, image: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return items.map((item: any) => ({
      ...item,
      sellerGithubLogin: item.user?.githubLogin ?? null,
      sellerImage: item.user?.image ?? null,
      price: Number(item.price)
    }));
  }

  async findById(id: string, tx?: Prisma.TransactionClient): Promise<ItemResponseDTO | null> {
    const client = tx || prisma;
    const item = await client.item.findUnique({
      where: { id },
      include: { user: { select: { githubLogin: true, image: true } } },
    });

    if (!item) return null;

    return {
      ...item,
      sellerGithubLogin: item.user?.githubLogin ?? null,
      sellerImage: item.user?.image ?? null,
      price: Number(item.price)
    };
  }

  // New method for locking
  async findByIdWithLock(id: string, tx: Prisma.TransactionClient): Promise<ItemResponseDTO | null> {
    // Prisma doesn't support SELECT FOR UPDATE directly via findUnique in all versions cleanly without raw query or extensions,
    // but for PostgreSQL, we can use $queryRaw if needed, or rely on update atomic operations.
    // However, the requirement is "Lock item row (SELECT FOR UPDATE)".
    // The most robust way in Prisma for this specific "Read then Update" pattern is often raw query for the lock.
    type ItemRow = {
      id: string;
      user_id: string | null;
      name: string;
      description: string;
      price: Prisma.Decimal | number | string;
      quantity: number;
      share_link: string | null;
      created_at: string | Date;
      updated_at: string | Date;
    };
    const items = await tx.$queryRaw<ItemRow[]>`SELECT * FROM "items" WHERE "id" = ${id} FOR UPDATE`;

    if (items.length === 0) return null;
    const item = items[0];

    return {
      id: item.id,
      userId: item.user_id ?? null,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      quantity: item.quantity,
      shareLink: item.share_link ?? null,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    };
  }

  async updateQuantity(id: string, quantity: number, tx: Prisma.TransactionClient): Promise<void> {
    await tx.item.update({
      where: { id },
      data: { quantity },
    });
  }

  async updateDetails(id: string, name: string, description: string): Promise<void> {
    await prisma.item.update({
      where: { id },
      data: {
        name,
        description,
      },
    });
  }

  async updateShareLink(id: string, shareLink: string): Promise<void> {
    await prisma.item.update({
      where: { id },
      data: {
        shareLink,
      },
    });
  }

  async findByUserId(userId: string): Promise<ItemResponseDTO[]> {
    const items = await prisma.item.findMany({
      where: { userId },
      include: { user: { select: { githubLogin: true } } },
      orderBy: { createdAt: "desc" },
    });

    return items.map((item: any) => ({
      ...item,
      sellerGithubLogin: item.user?.githubLogin ?? null,
      sellerImage: item.user?.image ?? null,
      price: Number(item.price),
    }));
  }

  async update(
    id: string,
    data: Partial<Pick<CreateItemDTO, "name" | "description" | "price" | "quantity">>
  ): Promise<ItemResponseDTO> {
    const item = await prisma.item.update({
      where: { id },
      data,
    });

    return {
      ...item,
      price: Number(item.price),
    };
  }

  async delete(id: string): Promise<void> {
    await prisma.item.delete({ where: { id } });
  }
}
