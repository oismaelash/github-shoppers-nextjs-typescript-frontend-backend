import { ItemController } from "@/controllers/item.controller";
import type { NextRequest } from "next/server";

const itemController = new ItemController();

export async function GET(req: NextRequest) {
  return itemController.getMine(req);
}

