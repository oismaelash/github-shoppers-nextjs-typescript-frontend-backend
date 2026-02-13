import { PurchaseController } from "@/controllers/purchase.controller";
import { NextRequest } from "next/server";

const purchaseController = new PurchaseController();

export async function POST(req: NextRequest) {
  return purchaseController.create(req);
}

export async function GET(req: NextRequest) {
  return purchaseController.list(req);
}
