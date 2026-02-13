import prisma from "@/lib/prisma";
import { CreateItemDTO, ItemResponseDTO } from "@/dto/item.dto";

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

  async findById(id: string): Promise<ItemResponseDTO | null> {
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) return null;

    return {
      ...item,
      price: Number(item.price)
    };
  }
}
