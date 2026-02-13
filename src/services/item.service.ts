import { ItemRepository } from "@/repositories/item.repository";
import { CreateItemDTO, ItemResponseDTO } from "@/dto/item.dto";

export class ItemService {
  private itemRepository: ItemRepository;

  constructor() {
    this.itemRepository = new ItemRepository();
  }

  async createItem(data: CreateItemDTO): Promise<ItemResponseDTO> {
    // Business logic can be added here (e.g., validation beyond types, triggering events)
    return await this.itemRepository.create(data);
  }

  async getAllItems(): Promise<ItemResponseDTO[]> {
    return await this.itemRepository.findAll();
  }
}
