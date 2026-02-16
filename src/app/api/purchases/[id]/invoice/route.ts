import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/utils";
import { PurchaseRepository } from "@/repositories/purchase.repository";

const purchaseRepository = new PurchaseRepository();

/**
 * @swagger
 * /api/purchases/{id}/invoice:
 *   get:
 *     summary: Get purchase invoice
 *     description: Downloads a plain text invoice for a purchase. Only the buyer can access.
 *     tags:
 *       - Purchases
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Purchase ID
 *     responses:
 *       200:
 *         description: Plain text invoice
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *             example: |
 *               Invoice
 *
 *               Purchase ID: clx456def
 *               Item: Premium Widget (clx123abc)
 *               Amount: $29.99
 *               Buyer: octocat
 *               Seller: seller123
 *               Date: 2025-02-16T12:00:00.000Z
 *               Status: CONFIRMED
 *
 *               GitHub Shoppers
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - not the buyer
 *       404:
 *         description: Purchase not found
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const purchase = await purchaseRepository.findById(id);
  if (!purchase) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (purchase.buyerUserId && purchase.buyerUserId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = [
    `Invoice`,
    ``,
    `Purchase ID: ${purchase.id}`,
    `Item: ${purchase.item.name} (${purchase.item.id})`,
    `Amount: $${Number(purchase.pricePaid ?? purchase.item.price).toFixed(2)}`,
    `Buyer: ${purchase.githubLogin}`,
    `Seller: ${purchase.sellerGithubLogin ?? "-"}`,
    `Date: ${purchase.createdAt.toISOString()}`,
    `Status: ${purchase.status}`,
    ``,
    `GitHub Shoppers`,
  ].join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "content-disposition": `inline; filename="invoice-${purchase.id}.txt"`,
    },
  });
}

