import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardPage } from "@/components/pages/dashboard/DashboardPage";
import { MarketplacePage } from "@/components/pages/marketplace/MarketplacePage";
import { MyProductsPage } from "@/components/pages/products/MyProductsPage";
import { CreateProductPage } from "@/components/pages/products/CreateProductPage";
import { EditProductPage } from "@/components/pages/products/EditProductPage";
import { PurchaseHistoryPage } from "@/components/pages/purchases/PurchaseHistoryPage";
import { PublicLedgerPage } from "@/components/pages/ledger/PublicLedgerPage";
import { SignInPage } from "@/components/pages/auth/SignInPage";

function mockFetchRouter(responders: Array<(url: string) => any>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: any) => {
      const url = String(input);
      for (const responder of responders) {
        const res = responder(url);
        if (res) return res;
      }
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify([]),
      };
    })
  );
}

describe("Pages smoke", () => {
  it("renderiza Dashboard", async () => {
    mockFetchRouter([
      (url) =>
        url.includes("/api/purchases")
          ? {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify([
                {
                  id: "p1",
                  githubLogin: "buyer",
                  createdAt: new Date().toISOString(),
                  item: { name: "Item A", price: 10 },
                },
              ]),
          }
          : null,
      (url) =>
        url.includes("/api/items")
          ? {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify([{ id: "i1", quantity: 2, createdAt: new Date().toISOString() }]),
          }
          : null,
    ]);

    render(<DashboardPage />);
    expect(await screen.findByText("Recent Purchases")).toBeInTheDocument();
    expect(await screen.findByText("Item A")).toBeInTheDocument();
  });

  it("renderiza Marketplace e abre modal de pagamento", async () => {
    mockFetchRouter([
      (url) =>
        url.includes("/api/items")
          ? {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify([
                {
                  id: "i1",
                  name: "Item A",
                  description: "Desc",
                  price: 10,
                  quantity: 1,
                  createdAt: new Date().toISOString(),
                  sellerGithubLogin: "seller1",
                },
              ]),
          }
          : null,
      (url) =>
        url.includes("/api/purchases")
          ? {
            ok: true,
            status: 201,
            text: async () =>
              JSON.stringify({
                id: "p1",
                itemId: "i1",
                githubLogin: "buyer1",
                createdAt: new Date().toISOString(),
              }),
          }
          : null,
    ]);

    render(<MarketplacePage />);
    expect(await screen.findByText("Item A")).toBeInTheDocument();
    fireEvent.click(await screen.findByText("Buy Now"));
    expect(await screen.findByText("Complete Your Purchase")).toBeInTheDocument();
  });

  it("renderiza My Products e abre Sales modal", async () => {
    mockFetchRouter([
      (url) =>
        url.includes("/api/me/items")
          ? {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify([
                {
                  id: "i1",
                  name: "Item A",
                  price: 10,
                  quantity: 2,
                  createdAt: new Date().toISOString(),
                  shareLink: null,
                },
              ]),
          }
          : null,
      (url) =>
        url.includes("/api/items/i1/sales")
          ? {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify({
                totalSales: 1,
                revenue: 10,
                sales: [
                  {
                    id: "p1",
                    buyer: "buyer1",
                    pricePaid: 10,
                    createdAt: new Date().toISOString(),
                    status: "CONFIRMED",
                  },
                ],
              }),
          }
          : null,
    ]);

    render(<MyProductsPage />);
    expect((await screen.findAllByText("My Products")).length).toBeGreaterThan(0);
    fireEvent.click(await screen.findByText("Sales"));
    expect(await screen.findByText(/Sales History:/)).toBeInTheDocument();
  });

  it("renderiza Edit Product e realiza PATCH", async () => {
    mockFetchRouter([
      (url) =>
        url.endsWith("/api/items/i1")
          ? {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify({
                id: "i1",
                name: "Item A",
                description: "Desc",
                price: 10,
                quantity: 2,
              }),
          }
          : null,
    ]);
    render(<EditProductPage id="i1" />);
    expect(await screen.findByDisplayValue("Item A")).toBeInTheDocument();
  });

  it("renderiza Create Product", async () => {
    render(<CreateProductPage />);
    expect(screen.getAllByText("Create Product").length).toBeGreaterThan(0);
    expect(screen.getByText("Product Name")).toBeInTheDocument();
  });

  it("renderiza Purchase History", async () => {
    mockFetchRouter([
      (url) =>
        url.includes("/api/me/purchases")
          ? {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify([
                {
                  id: "p1",
                  githubLogin: "buyer1",
                  sellerGithubLogin: "seller1",
                  createdAt: new Date().toISOString(),
                  item: { name: "Item A", price: 10 },
                },
              ]),
          }
          : null,
    ]);

    render(<PurchaseHistoryPage />);
    expect((await screen.findAllByText("Purchase History")).length).toBeGreaterThan(0);
    expect(await screen.findByText(/seller1/)).toBeInTheDocument();
  });

  it("renderiza Purchase History não autenticado", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ error: "Unauthorized" }),
      }))
    );
    render(<PurchaseHistoryPage />);
    expect((await screen.findAllByText("Purchase History")).length).toBeGreaterThan(0);
    expect(await screen.findByText("You must be signed in to view your purchase history.")).toBeInTheDocument();
  });

  it("renderiza My Products não autenticado", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ error: "Unauthorized" }),
      }))
    );
    render(<MyProductsPage />);
    expect((await screen.findAllByText("My Products")).length).toBeGreaterThan(0);
    expect(await screen.findByText("You must be signed in to view your products.")).toBeInTheDocument();
  });

  it("renderiza Public Ledger", async () => {
    mockFetchRouter([
      (url) =>
        url.includes("/api/ledger")
          ? {
            ok: true,
            status: 200,
            text: async () =>
              JSON.stringify([
                {
                  id: "l1",
                  product: "Item A",
                  seller: "seller1",
                  buyer: "buyer1",
                  price: 10,
                  createdAt: new Date().toISOString(),
                  status: "VERIFIED",
                },
              ]),
          }
          : null,
    ]);

    render(<PublicLedgerPage />);
    expect(await screen.findByText("Public Ledger")).toBeInTheDocument();
    expect(await screen.findByText("Item A")).toBeInTheDocument();
  });

  it("renderiza SignIn", async () => {
    render(<SignInPage />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Continue with GitHub")).toBeInTheDocument();
  });
});
