import { describe, it, expect, vi, beforeEach } from "vitest";
import { ItemController } from "@/controllers/item.controller";
import { NextRequest } from "next/server";
import { getAuthSession } from "@/lib/auth/utils";

const mockCreateItem = vi.fn();
const mockGetAllItems = vi.fn();
const mockGetMyItems = vi.fn();
const mockGetItemById = vi.fn();
const mockUpdateItem = vi.fn();
const mockDeleteItem = vi.fn();
const mockGetSalesForItem = vi.fn();

vi.mock("@/services/item.service", () => {
  return {
    ItemService: class {
      createItem = mockCreateItem;
      getAllItems = mockGetAllItems;
      getMyItems = mockGetMyItems;
      getItemById = mockGetItemById;
      updateItem = mockUpdateItem;
      deleteItem = mockDeleteItem;
    },
  };
});

vi.mock("@/services/sales.service", () => {
  return {
    SalesService: class {
      getSalesForItem = mockGetSalesForItem;
    },
  };
});

vi.mock("@/lib/auth/utils", () => ({
  getAuthSession: vi.fn(),
}));

describe("ItemController Integration Tests", () => {
  let controller: ItemController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new ItemController();
  });

  it("cria item com userId da sessão", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockCreateItem.mockResolvedValue({
      id: "i1",
      userId: "u1",
      name: "Item",
      description: "Desc",
      price: 10,
      quantity: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const req = new NextRequest("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ name: "Item", description: "Desc", price: 10, quantity: 1 }),
    });

    const res = await controller.create(req);
    expect(res.status).toBe(201);
    expect(mockCreateItem).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "u1", name: "Item" })
    );
  });

  it("retorna 401 ao criar item sem sessão", async () => {
    (getAuthSession as any).mockResolvedValue(null);

    const req = new NextRequest("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ name: "Item", description: "Desc", price: 10, quantity: 1 }),
    });

    const res = await controller.create(req);
    expect(res.status).toBe(401);
  });

  it("retorna 400 ao criar item inválido", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    const req = new NextRequest("http://localhost/api/items", {
      method: "POST",
      body: JSON.stringify({ name: "", description: "", price: -1, quantity: -1 }),
    });
    const res = await controller.create(req);
    expect(res.status).toBe(400);
  });

  it("lista meus itens com sessão", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetMyItems.mockResolvedValue([]);

    const req = new NextRequest("http://localhost/api/me/items", { method: "GET" });
    const res = await controller.getMine(req);
    expect(res.status).toBe(200);
    expect(mockGetMyItems).toHaveBeenCalledWith("u1");
  });

  it("retorna 401 ao listar meus itens sem sessão", async () => {
    (getAuthSession as any).mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/me/items", { method: "GET" });
    const res = await controller.getMine(req);
    expect(res.status).toBe(401);
  });

  it("busca item por id e retorna 404 quando não existe", async () => {
    mockGetItemById.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/items/i1", { method: "GET" });
    const res = await controller.getById(req, "i1");
    expect(res.status).toBe(404);
  });

  it("atualiza item com validação e ownership", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetItemById.mockResolvedValue({ id: "i1", userId: "u1" });
    mockUpdateItem.mockResolvedValue({ id: "i1", userId: "u1" });

    const req = new NextRequest("http://localhost/api/items/i1", {
      method: "PATCH",
      body: JSON.stringify({ name: "New" }),
    });
    const res = await controller.update(req, "i1");
    expect(res.status).toBe(200);
    expect(mockUpdateItem).toHaveBeenCalledWith("i1", expect.any(Object));
  });

  it("retorna 404 ao atualizar item inexistente", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetItemById.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/items/i1", {
      method: "PATCH",
      body: JSON.stringify({ name: "New" }),
    });
    const res = await controller.update(req, "i1");
    expect(res.status).toBe(404);
  });

  it("retorna 400 ao atualizar com payload inválido", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetItemById.mockResolvedValue({ id: "i1", userId: "u1" });
    const req = new NextRequest("http://localhost/api/items/i1", {
      method: "PATCH",
      body: JSON.stringify({ price: -1 }),
    });
    const res = await controller.update(req, "i1");
    expect(res.status).toBe(400);
  });

  it("nega update quando item não pertence ao usuário", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetItemById.mockResolvedValue({ id: "i1", userId: "u2" });
    const req = new NextRequest("http://localhost/api/items/i1", {
      method: "PATCH",
      body: JSON.stringify({ name: "New" }),
    });
    const res = await controller.update(req, "i1");
    expect(res.status).toBe(403);
  });

  it("deleta item com ownership", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetItemById.mockResolvedValue({ id: "i1", userId: "u1" });
    mockDeleteItem.mockResolvedValue(undefined);
    const req = new NextRequest("http://localhost/api/items/i1", { method: "DELETE" });
    const res = await controller.delete(req, "i1");
    expect(res.status).toBe(200);
    expect(mockDeleteItem).toHaveBeenCalledWith("i1");
  });

  it("retorna 404 ao deletar item inexistente", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetItemById.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/items/i1", { method: "DELETE" });
    const res = await controller.delete(req, "i1");
    expect(res.status).toBe(404);
  });

  it("retorna vendas do item para o owner", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetSalesForItem.mockResolvedValue({ totalSales: 0, revenue: 0, sales: [] });
    const req = new NextRequest("http://localhost/api/items/i1/sales", { method: "GET" });
    const res = await controller.sales(req, "i1");
    expect(res.status).toBe(200);
    expect(mockGetSalesForItem).toHaveBeenCalledWith("u1", "i1");
  });

  it("retorna 403 quando sales service acusa Forbidden", async () => {
    (getAuthSession as any).mockResolvedValue({ user: { id: "u1" } });
    mockGetSalesForItem.mockRejectedValue(new Error("Forbidden"));
    const req = new NextRequest("http://localhost/api/items/i1/sales", { method: "GET" });
    const res = await controller.sales(req, "i1");
    expect(res.status).toBe(403);
  });
});
