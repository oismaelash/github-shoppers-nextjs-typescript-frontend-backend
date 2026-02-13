import { ItemController } from "@/controllers/item.controller";
import { NextRequest } from "next/server";

const itemController = new ItemController();

export async function POST(req: NextRequest) {
  return itemController.create(req);
}

export async function GET(req: NextRequest) {
  return itemController.getAll(req);
}
