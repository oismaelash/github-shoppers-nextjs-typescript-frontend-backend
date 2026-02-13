import { NextRequest, NextResponse } from "next/server";
import { ItemService } from "@/services/item.service";
import { CreateItemSchema, UpdateItemSchema } from "@/dto/item.dto";
import { getAuthSession } from "@/lib/auth/utils";
import { SalesService } from "@/services/sales.service";

export class ItemController {
  private itemService: ItemService;
  private salesService: SalesService;

  constructor() {
    this.itemService = new ItemService();
    this.salesService = new SalesService();
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

      const item = await this.itemService.createItem({
        ...validation.data,
        userId: session.user.id,
      });
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

  async getMine(req: NextRequest) {
    try {
      const session = await getAuthSession();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const items = await this.itemService.getMyItems(session.user.id);
      return NextResponse.json(items, { status: 200 });
    } catch (error) {
      console.error("Get My Items Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async getById(req: NextRequest, id: string) {
    try {
      const item = await this.itemService.getItemById(id);
      if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });
      return NextResponse.json(item, { status: 200 });
    } catch (error) {
      console.error("Get Item Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async update(req: NextRequest, id: string) {
    try {
      const session = await getAuthSession();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const existing = await this.itemService.getItemById(id);
      if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 });
      if (existing.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const body = await req.json();
      const validation = UpdateItemSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json({ error: validation.error.format() }, { status: 400 });
      }

      const updated = await this.itemService.updateItem(id, validation.data);
      return NextResponse.json(updated, { status: 200 });
    } catch (error) {
      console.error("Update Item Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async delete(req: NextRequest, id: string) {
    try {
      const session = await getAuthSession();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const existing = await this.itemService.getItemById(id);
      if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 });
      if (existing.userId !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      await this.itemService.deleteItem(id);
      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
      console.error("Delete Item Error:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  async sales(req: NextRequest, id: string) {
    try {
      const session = await getAuthSession();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const summary = await this.salesService.getSalesForItem(session.user.id, id);
      return NextResponse.json(summary, { status: 200 });
    } catch (error: unknown) {
      console.error("Sales Error:", error);
      if (error instanceof Error && error.message === "Item not found") {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }
      if (error instanceof Error && error.message === "Forbidden") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }
}
