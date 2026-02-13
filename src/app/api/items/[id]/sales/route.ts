import { ItemController } from "@/controllers/item.controller";
import type { NextRequest } from "next/server";

const itemController = new ItemController();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return itemController.sales(req, id);
}

