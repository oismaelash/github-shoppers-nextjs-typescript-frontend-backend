import { NextRequest, NextResponse } from "next/server";
import { ItemService } from "@/services/item.service";
import { CreateItemSchema } from "@/dto/item.dto";
import { getAuthSession } from "@/lib/auth/utils";

export class ItemController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  async create(req: NextRequest) {
    try {
      const session = await getAuthSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await req.json();
      const validation = CreateItemSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json({ error: validation.error.format() }, { status: 400 });
      }

      const item = await this.itemService.createItem(validation.data);
      return NextResponse.json(item, { status: 201 });
    } catch (error) {
      console.error("Create Item Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async getAll(req: NextRequest) {
    try {
      const items = await this.itemService.getAllItems();
      return NextResponse.json(items, { status: 200 });
    } catch (error) {
      console.error("Get All Items Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
