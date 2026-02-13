import { ItemRepository } from "@/repositories/item.repository";
import { CreateItemDTO, ItemResponseDTO } from "@/dto/item.dto";
import { aiEnhancementQueue } from "@/queues/ai-enhancement.queue";

export class ItemService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  async createItem(data: CreateItemDTO): Promise<ItemResponseDTO> {
    const item = await this.itemRepository.create(data);

    // Enqueue job for AI enhancement
    try {
        await aiEnhancementQueue.add('enhance-item', {
            itemId: item.id,
            name: item.name,
            description: item.description
        });
    } catch (error) {
        console.error("Failed to enqueue AI enhancement job:", error);
        // We don't block the response if queue fails
    }

    return item;
  }

  async getAllItems(): Promise<ItemResponseDTO[]> {
    return await this.itemRepository.findAll();
  }
}
