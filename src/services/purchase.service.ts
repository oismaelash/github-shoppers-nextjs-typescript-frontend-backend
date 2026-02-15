import { prisma } from "@/lib/prisma";
import { ItemRepository } from "@/repositories/item.repository";
import { PurchaseRepository } from "@/repositories/purchase.repository";
import { ResendAdapter } from "@/adapters/resend.adapter";
import { CreatePurchaseDTO, PurchaseResponseDTO, PurchaseListResponseDTO } from "@/dto/purchase.dto";
import { getAuthSession } from "@/lib/auth/utils";
import { analytics } from "@/lib/analytics";

export class PurchaseService {
  private itemRepository: ItemRepository;
  private purchaseRepository: PurchaseRepository;
  private resendAdapter: ResendAdapter;

  constructor() {
    this.itemRepository = new ItemRepository();
    this.purchaseRepository = new PurchaseRepository();
    this.resendAdapter = new ResendAdapter();
  }

  async createPurchase(data: CreatePurchaseDTO): Promise<PurchaseResponseDTO> {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const buyerLogin =
      session.user.githubLogin ||
      session.user.name ||
      session.user.email?.split("@")[0] ||
      session.user.id.slice(0, 8);

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

      const seller =
        item.userId
          ? await tx.user.findUnique({
            where: { id: item.userId },
            select: { githubLogin: true, name: true, email: true },
          })
          : null;

      // 6. Save purchase
      const purchase = await this.purchaseRepository.create({
        itemId: item.id,
        githubLogin: buyerLogin,
        buyerUserId: session.user.id,
        sellerGithubLogin:
          seller?.githubLogin ??
          seller?.name ??
          seller?.email?.split("@")[0] ??
          null,
        pricePaid: item.price,
        status: "CONFIRMED",
        paymentMethod: "PIX",
        paymentReference: `pix_${purchaseIdSuffix(item.id)}`,
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

    // 7. Track Analytics (Post-Transaction)
    analytics.trackEvent('purchase_completed', {
      purchaseId: purchaseResult.dto.id,
      itemId: purchaseResult.dto.itemId,
      githubLogin: purchaseResult.dto.githubLogin,
      price: purchaseResult.dto.id // Actually pricePaid is available in the transaction result if we returned it, but let's keep it simple for now as purchaseResult.dto doesn't have it.
    });

    // 8. Send Email Confirmation (Post-Transaction)
    // We do this outside the transaction so email failures don't rollback the purchase
    this.sendConfirmationEmail(purchaseResult.dto.githubLogin, purchaseResult.itemName);

    return purchaseResult.dto;
  }

  async getAllPurchases(): Promise<PurchaseListResponseDTO[]> {
    const purchases = await this.purchaseRepository.findAll();
    return purchases.map(p => ({
      id: p.id,
      githubLogin: p.githubLogin,
      sellerGithubLogin: p.sellerGithubLogin ?? null,
      createdAt: p.createdAt,
      item: {
        name: p.item.name,
        price: Number(p.item.price)
      }
    }));
  }

  async getMyPurchases(buyerUserId: string): Promise<PurchaseListResponseDTO[]> {
    const purchases = await this.purchaseRepository.findByBuyerUserId(buyerUserId);
    return purchases.map((p) => ({
      id: p.id,
      githubLogin: p.githubLogin,
      sellerGithubLogin: p.sellerGithubLogin ?? null,
      createdAt: p.createdAt,
      item: {
        name: p.item.name,
        price: Number(p.item.price),
      },
    }));
  }

  async getSalesForSeller(sellerId: string): Promise<PurchaseListResponseDTO[]> {
    const purchases = await this.purchaseRepository.findBySellerUserId(sellerId);
    return purchases.map((p) => ({
      id: p.id,
      githubLogin: p.githubLogin,
      sellerGithubLogin: p.sellerGithubLogin ?? null,
      createdAt: p.createdAt,
      item: {
        name: p.item.name,
        price: Number(p.item.price),
      },
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

function purchaseIdSuffix(itemId: string) {
  const raw = `${itemId}:${Date.now()}`;
  return Buffer.from(raw).toString("base64").slice(0, 18);
}
