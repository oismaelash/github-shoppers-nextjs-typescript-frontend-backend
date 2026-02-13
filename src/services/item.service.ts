import { ItemRepository } from "@/repositories/item.repository";
import { CreateItemDTO, ItemResponseDTO } from "@/dto/item.dto";
import { aiEnhancementQueue } from "@/queues/ai-enhancement.queue";
import { ShareContentAdapter } from "@/adapters/share-content.adapter";
import { analytics } from "@/lib/analytics";

export class ItemService {
  private itemRepository: ItemRepository;
  private shareContentAdapter: ShareContentAdapter;

  constructor() {
    this.itemRepository = new ItemRepository();
    this.shareContentAdapter = new ShareContentAdapter();
  }

  async createItem(
    data: CreateItemDTO & { userId?: string | null }
  ): Promise<ItemResponseDTO> {
    const item = await this.itemRepository.create(data);

    // Track Event
    analytics.trackEvent('item_created', {
        itemId: item.id,
        name: item.name,
        price: item.price
    });

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

    // Generate Shareable Link (Async)
    this.generateShareLink(item.id, item.name);

    return item;
  }

  async getAllItems(): Promise<ItemResponseDTO[]> {
    return await this.itemRepository.findAll();
  }

  async getMyItems(userId: string): Promise<ItemResponseDTO[]> {
    return await this.itemRepository.findByUserId(userId);
  }

  async getItemById(id: string): Promise<ItemResponseDTO | null> {
    return await this.itemRepository.findById(id);
  }

  async updateItem(
    id: string,
    data: Partial<Pick<CreateItemDTO, "name" | "description" | "price" | "quantity">>
  ): Promise<ItemResponseDTO> {
    return await this.itemRepository.update(id, data);
  }

  async deleteItem(id: string): Promise<void> {
    await this.itemRepository.delete(id);
  }

  private async generateShareLink(itemId: string, itemName: string) {
      try {
          // Construct the full product URL (assuming a frontend route /items/:id)
          const productUrl = `${process.env.NEXTAUTH_URL}/items/${itemId}`;
          
          const shortUrl = await this.shareContentAdapter.generateShareLink(productUrl);

          if (shortUrl) {
              await this.itemRepository.updateShareLink(itemId, shortUrl);
          }
      } catch (error) {
          console.error("Failed to generate share link:", error);
          // Suppress error so we don't affect the HTTP response or other flows
      }
  }
}
