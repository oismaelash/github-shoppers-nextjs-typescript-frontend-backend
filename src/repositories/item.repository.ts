import prisma from "@/lib/prisma";
import { CreateItemDTO, ItemResponseDTO } from "@/dto/item.dto";
import { Prisma } from "@prisma/client";

export class ItemRepository {
  async create(data: CreateItemDTO): Promise<ItemResponseDTO> {
    const item = await prisma.item.create({
      data: {
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return items.map(item => ({
      ...item,
      price: Number(item.price)
    }));
  }

  async findById(id: string, tx?: Prisma.TransactionClient): Promise<ItemResponseDTO | null> {
    const client = tx || prisma;
    const item = await client.item.findUnique({
      where: { id },
    });

    if (!item) return null;

    return {
      ...item,
      price: Number(item.price)
    };
  }

  // New method for locking
  async findByIdWithLock(id: string, tx: Prisma.TransactionClient): Promise<ItemResponseDTO | null> {
    // Prisma doesn't support SELECT FOR UPDATE directly via findUnique in all versions cleanly without raw query or extensions,
    // but for PostgreSQL, we can use $queryRaw if needed, or rely on update atomic operations.
    // However, the requirement is "Lock item row (SELECT FOR UPDATE)".
    // The most robust way in Prisma for this specific "Read then Update" pattern is often raw query for the lock.
    
    const items = await tx.$queryRaw<any[]>`SELECT * FROM "items" WHERE "id" = ${id} FOR UPDATE`;
    
    if (items.length === 0) return null;
    const item = items[0];

    return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        quantity: item.quantity,
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
}
