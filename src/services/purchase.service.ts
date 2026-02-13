import prisma from "@/lib/prisma";
import { ItemRepository } from "@/repositories/item.repository";
import { PurchaseRepository } from "@/repositories/purchase.repository";
import { GitHubUserAdapter } from "@/adapters/github-user.adapter";
import { CreatePurchaseDTO, PurchaseResponseDTO } from "@/dto/purchase.dto";

export class PurchaseService {
  private itemRepository: ItemRepository;
  private purchaseRepository: PurchaseRepository;
  private githubUserAdapter: GitHubUserAdapter;

  constructor() {
    this.itemRepository = new ItemRepository();
    this.purchaseRepository = new PurchaseRepository();
    this.githubUserAdapter = new GitHubUserAdapter();
  }

  async createPurchase(data: CreatePurchaseDTO): Promise<PurchaseResponseDTO> {
    // 1. Start Transaction
    return await prisma.$transaction(async (tx) => {
      // 2. Lock item row (SELECT FOR UPDATE)
      // Using queryRaw in repository to ensure row locking
      const item = await this.itemRepository.findByIdWithLock(data.itemId, tx);

      if (!item) {
        throw new Error("Item not found");
      }

      // 3. Validate quantity > 0
      if (item.quantity <= 0) {
        throw new Error("Item out of stock"); // Will be caught by controller to return 409
      }

      // 4. Decrement quantity
      await this.itemRepository.updateQuantity(item.id, item.quantity - 1, tx);

      // 5. Fetch random GitHub user
      // Note: If this fails, the transaction aborts automatically
      const githubUser = await this.githubUserAdapter.getRandomUser();

      // 6. Save purchase
      const purchase = await this.purchaseRepository.create({
        itemId: item.id,
        githubLogin: githubUser.login,
      }, tx);

      return {
        id: purchase.id,
        itemId: purchase.itemId,
        githubLogin: purchase.githubLogin,
        createdAt: purchase.createdAt
      };
    });
  }
}
