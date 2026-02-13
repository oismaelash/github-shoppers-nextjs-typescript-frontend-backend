import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/utils";
import { PurchaseRepository } from "@/repositories/purchase.repository";

const purchaseRepository = new PurchaseRepository();

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

