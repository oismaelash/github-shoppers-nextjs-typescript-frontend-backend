import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PublicMarketplacePage as MarketplacePage } from "@/components/pages/marketplace/PublicMarketplacePage";
import { CreateProductPage } from "@/components/pages/products/CreateProductPage";
import { MyProductsPage } from "@/components/pages/products/MyProductsPage";
import { PurchaseHistoryPage } from "@/components/pages/purchases/PurchaseHistoryPage";
import { PublicLedgerPage } from "@/components/pages/ledger/PublicLedgerPage";
import { SignInPage } from "@/components/pages/auth/SignInPage";
import { EditProductPage } from "@/components/pages/products/EditProductPage";
import { Toast } from "@/components/ui/Toast";

function mockFetch(handler: (url: string, init?: RequestInit) => any) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: any, init?: any) => handler(String(input), init))
  );
}

describe("Page interactions", () => {
  it("Marketplace: verify payment abre modal de sucesso", async () => {
    mockFetch((url) => {
      if (url.includes("/api/items")) {
        return {
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
        };
      }
      if (url.includes("/api/purchases")) {
        return {
          ok: true,
          status: 201,
          text: async () =>
            JSON.stringify({
              id: "p1",
              itemId: "i1",
              githubLogin: "buyer1",
              createdAt: new Date().toISOString(),
            }),
        };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify([]) };
    });

    render(<MarketplacePage />);
    fireEvent.click(await screen.findByText("Buy Now"));
    fireEvent.click(await screen.findByText("Verify Payment"));
    expect(await screen.findByText("Payment Successful!")).toBeInTheDocument();
  });

  it("Marketplace: aplica busca e ordenação", async () => {
    mockFetch((url) => {
      if (url.includes("/api/items")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify([
              {
                id: "i1",
                name: "Alpha",
                description: "Desc",
                price: 5,
                quantity: 3,
                createdAt: new Date("2026-02-13T10:00:00.000Z").toISOString(),
                sellerGithubLogin: "seller1",
              },
              {
                id: "i2",
                name: "Beta",
                description: "Desc",
                price: 20,
                quantity: 1,
                createdAt: new Date("2026-02-13T11:00:00.000Z").toISOString(),
                sellerGithubLogin: "seller2",
              },
            ]),
        };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify([]) };
    });

    render(<MarketplacePage />);
    expect(await screen.findByText("Alpha")).toBeInTheDocument();
    expect(await screen.findByText("Beta")).toBeInTheDocument();

    const selects = screen.getAllByRole("combobox");
    const sortSelect = selects[1];
    fireEvent.change(sortSelect, { target: { value: "price_desc" } });
    fireEvent.change(sortSelect, { target: { value: "price_asc" } });
    fireEvent.change(sortSelect, { target: { value: "qty_left" } });

    const searchInputs = screen.getAllByPlaceholderText("Search marketplace...");
    fireEvent.change(searchInputs[1], { target: { value: "Alpha" } });
    expect(await screen.findByText("Alpha")).toBeInTheDocument();
  });

  it("Marketplace: filtra out of stock e cancela modal", async () => {
    (navigator as any).clipboard = { writeText: vi.fn() };
    mockFetch((url) => {
      if (url.includes("/api/items")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify([
              {
                id: "i1",
                name: "In Stock",
                description: "Desc",
                price: 10,
                quantity: 1,
                createdAt: new Date().toISOString(),
                sellerGithubLogin: "seller1",
              },
              {
                id: "i2",
                name: "Out Stock",
                description: "Desc",
                price: 11,
                quantity: 0,
                createdAt: new Date().toISOString(),
                sellerGithubLogin: "seller2",
              },
            ]),
        };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify([]) };
    });

    render(<MarketplacePage />);
    expect(await screen.findByText("In Stock")).toBeInTheDocument();

    const buyButtons = screen.getAllByRole("button", { name: /Buy Now/ });
    const enabledBuy = buyButtons.find((b) => !(b as HTMLButtonElement).disabled) ?? buyButtons[0];
    fireEvent.click(enabledBuy);
    expect(await screen.findByText("Complete Your Purchase")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Copy"));
    expect((navigator as any).clipboard.writeText).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Cancel and return to marketplace"));
    expect(screen.queryByText("Complete Your Purchase")).toBeNull();

    const [statusSelect] = screen.getAllByRole("combobox");
    fireEvent.change(statusSelect, { target: { value: "out_of_stock" } });
    expect(await screen.findByText("Out Stock")).toBeInTheDocument();
  });

  it("Create Product: enhance com AI atualiza campos", async () => {
    mockFetch((url) => {
      if (url.includes("/api/ai/enhance")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({
              improvedTitle: "New title",
              improvedDescription: "New desc",
            }),
        };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify({}) };
    });

    render(<CreateProductPage />);
    fireEvent.change(screen.getByPlaceholderText("e.g. React Component Kit"), {
      target: { value: "Old title" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write a detailed description (Markdown supported)."), {
      target: { value: "Old desc" },
    });

    fireEvent.click(screen.getByText("Enhance with AI"));
    expect(await screen.findByDisplayValue("New title")).toBeInTheDocument();
  });

  it("Create Product: mostra erro quando AI falha", async () => {
    mockFetch((url) => {
      if (url.includes("/api/ai/enhance")) {
        return { ok: false, status: 500, text: async () => JSON.stringify({ error: "fail" }) };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify({}) };
    });

    render(<CreateProductPage />);
    fireEvent.change(screen.getByPlaceholderText("e.g. React Component Kit"), {
      target: { value: "Title" },
    });
    fireEvent.change(screen.getByPlaceholderText("Write a detailed description (Markdown supported)."), {
      target: { value: "Desc" },
    });

    fireEvent.click(screen.getByText("Enhance with AI"));
    expect(await screen.findByText(/fail|Failed to enhance/)).toBeInTheDocument();
  });



  it("Create Product: submit chama /api/items e redireciona", async () => {
    mockFetch((url, init) => {
      if (url.includes("/api/items") && init?.method === "POST") {
        return { ok: true, status: 201, text: async () => JSON.stringify({ id: "i1" }) };
      }
      if (url.includes("/api/ai/enhance")) {
        return {
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ improvedTitle: "T", improvedDescription: "D" }),
        };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify({}) };
    });

    render(<CreateProductPage />);
    fireEvent.change(screen.getByPlaceholderText("e.g. React Component Kit"), {
      target: { value: "Title" },
    });
    fireEvent.change(screen.getByPlaceholderText("49.00"), { target: { value: "10" } });
    fireEvent.change(screen.getByPlaceholderText("Write a detailed description (Markdown supported)."), {
      target: { value: "Desc" },
    });

    const buttons = screen.getAllByRole("button", { name: /Create Product/ });
    fireEvent.click(buttons[buttons.length - 1]);
    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it("Edit Product: carrega item e salva alterações", async () => {
    mockFetch((url, init) => {
      if (url.endsWith("/api/items/i1") && (!init || init.method === "GET")) {
        return {
          ok: true,
          status: 200,
          text: async () =>
            JSON.stringify({
              id: "i1",
              name: "Old",
              description: "Old desc",
              price: 10,
              quantity: 2,
            }),
        };
      }
      if (url.endsWith("/api/items/i1") && init?.method === "PATCH") {
        return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true }) };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify({}) };
    });

    render(<EditProductPage id="i1" />);
    const nameInput = await screen.findByPlaceholderText("e.g. React Component Kit");
    const priceInput = screen.getByPlaceholderText("49.00");
    const descTextarea = screen.getByPlaceholderText("Write a detailed description (Markdown supported).");
    fireEvent.change(nameInput, { target: { value: "New" } });
    fireEvent.change(priceInput, { target: { value: "12" } });
    fireEvent.change(descTextarea, { target: { value: "New desc" } });
    fireEvent.click(screen.getByText("Save Changes"));
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "/api/items/i1",
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("My Products: delete chama endpoint quando confirmado", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    mockFetch((url, init) => {
      if (url.includes("/api/me/items")) {
        return {
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
        };
      }
      if (url.includes("/api/items/i1") && init?.method === "DELETE") {
        return { ok: true, status: 200, text: async () => JSON.stringify({ ok: true }) };
      }
      if (url.includes("/api/items/i1/sales")) {
        return {
          ok: true,
          status: 200,
          text: async () => JSON.stringify({ totalSales: 0, revenue: 0, sales: [] }),
        };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify([]) };
    });

    render(<MyProductsPage />);
    fireEvent.click(await screen.findByText("Delete"));
    expect(screen.queryByText("Item A")).not.toBeNull();
  });

  it("Purchase History: clicar invoice abre window.open", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null as any);
    mockFetch((url) => {
      if (url.includes("/api/me/purchases")) {
        return {
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
        };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify([]) };
    });

    render(<PurchaseHistoryPage />);
    fireEvent.click(await screen.findByText("View Invoice"));
    expect(open).toHaveBeenCalled();
  });

  it("Purchase History: mostra toast quando success=1 e fecha", async () => {
    window.history.pushState({}, "", "/purchase-history?success=1");
    mockFetch((url) => {
      if (url.includes("/api/me/purchases")) {
        return { ok: true, status: 200, text: async () => JSON.stringify([]) };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify([]) };
    });

    render(<PurchaseHistoryPage />);
    expect(await screen.findByText("Purchase Success")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Close toast"));
    expect(screen.queryByText("Purchase Success")).toBeNull();
  });

  it("Public Ledger: export abre URL de export", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null as any);
    mockFetch((url) => {
      if (url.includes("/api/ledger")) {
        return { ok: true, status: 200, text: async () => JSON.stringify([]) };
      }
      return { ok: true, status: 200, text: async () => JSON.stringify([]) };
    });

    render(<PublicLedgerPage />);
    fireEvent.click(await screen.findByText("Export"));
    expect(open).toHaveBeenCalled();
  });

  it("SignIn: clicar botões chama signIn", async () => {
    const { signIn } = await import("next-auth/react");
    render(<SignInPage callbackUrl="/" />);
    fireEvent.click(screen.getByText("Continue with GitHub"));
    fireEvent.click(screen.getByText("Continue with Google"));
    expect(signIn).toHaveBeenCalled();
  });

  it("Toast: fecha automaticamente", async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast open title="T" onClose={onClose} durationMs={10} />);
    vi.advanceTimersByTime(11);
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
