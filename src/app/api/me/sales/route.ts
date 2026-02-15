import { PurchaseController } from "@/controllers/purchase.controller";
import type { NextRequest } from "next/server";

const purchaseController = new PurchaseController();

export async function GET(req: NextRequest) {
    return purchaseController.listSellerSales(req);
}
