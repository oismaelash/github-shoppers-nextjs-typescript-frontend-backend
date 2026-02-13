import { NextRequest, NextResponse } from "next/server";
import { PurchaseService } from "@/services/purchase.service";
import { CreatePurchaseSchema } from "@/dto/purchase.dto";
import { getAuthSession } from "@/lib/auth/utils";

export class PurchaseController {
  private purchaseService: PurchaseService;

  constructor() {
    this.purchaseService = new PurchaseService();
  }

  async create(req: NextRequest) {
    try {
      // Auth check
      const session = await getAuthSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json();
      const validation = CreatePurchaseSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json({ error: validation.error.format() }, { status: 400 });
      }

      const purchase = await this.purchaseService.createPurchase(validation.data);
      return NextResponse.json(purchase, { status: 201 });
    } catch (error: any) {
      console.error("Create Purchase Error:", error);

      if (error.message === "Item out of stock") {
        return NextResponse.json({ error: "Item out of stock" }, { status: 409 });
      }

      if (error.message === "Item not found") {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }

      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async list(req: NextRequest) {
    try {
        // Auth check
        const session = await getAuthSession();
        if (!session) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const purchases = await this.purchaseService.getAllPurchases();
        return NextResponse.json(purchases, { status: 200 });
    } catch (error) {
        console.error("List Purchases Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
