import { ItemRepository } from "@/repositories/item.repository";
import { CreateItemDTO, ItemResponseDTO } from "@/dto/item.dto";
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
    const item = await this.itemRepository.update(id, data);

    // Track Event
    analytics.trackEvent('item_updated', {
      itemId: item.id,
      updates: Object.keys(data)
    });

    return item;
  }

  async deleteItem(id: string): Promise<void> {
    await this.itemRepository.delete(id);

    // Track Event
    analytics.trackEvent('item_deleted', {
      itemId: id
    });
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
