import prisma from "@/lib/prisma";
import { ItemRepository } from "@/repositories/item.repository";
import { PurchaseRepository } from "@/repositories/purchase.repository";
import { GitHubUserAdapter } from "@/adapters/github-user.adapter";
import { ResendAdapter } from "@/adapters/resend.adapter";
import { CreatePurchaseDTO, PurchaseResponseDTO, PurchaseListResponseDTO } from "@/dto/purchase.dto";
import { getAuthSession } from "@/lib/auth/utils";

export class PurchaseService {
  private itemRepository: ItemRepository;
  private purchaseRepository: PurchaseRepository;
  private githubUserAdapter: GitHubUserAdapter;
  private resendAdapter: ResendAdapter;

  constructor() {
    this.itemRepository = new ItemRepository();
    this.purchaseRepository = new PurchaseRepository();
    this.githubUserAdapter = new GitHubUserAdapter();
    this.resendAdapter = new ResendAdapter();
  }

  async createPurchase(data: CreatePurchaseDTO): Promise<PurchaseResponseDTO> {
    // 1. Start Transaction
    const purchaseResult = await prisma.$transaction(async (tx) => {
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

      // Return both purchase and item name for email
      return {
        dto: {
            id: purchase.id,
            itemId: purchase.itemId,
            githubLogin: purchase.githubLogin,
            createdAt: purchase.createdAt
        },
        itemName: item.name
      };
    });

    // 7. Send Email Confirmation (Post-Transaction)
    // We do this outside the transaction so email failures don't rollback the purchase
    this.sendConfirmationEmail(purchaseResult.dto.githubLogin, purchaseResult.itemName);

    return purchaseResult.dto;
  }

  async getAllPurchases(): Promise<PurchaseListResponseDTO[]> {
    const purchases = await this.purchaseRepository.findAll();
    return purchases.map(p => ({
      id: p.id,
      githubLogin: p.githubLogin,
      createdAt: p.createdAt,
      item: {
        name: p.item.name,
        price: Number(p.item.price)
      }
    }));
  }

  private async sendConfirmationEmail(githubLogin: string, itemName: string) {
      try {
          const session = await getAuthSession();
          const userEmail = session?.user?.email;

          if (userEmail) {
              await this.resendAdapter.sendPurchaseConfirmation({
                  to: userEmail,
                  itemName: itemName,
                  githubLogin: githubLogin
              });
          }
      } catch (error) {
          console.error("Failed to send confirmation email:", error);
          // Suppress error so we don't affect the HTTP response
      }
  }
}
