"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, SidebarItem } from "@/components/app/AppShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { apiFetch } from "@/lib/api-fetch";
import { cn } from "@/lib/cn";

type MarketplaceItem = {
  id: string;
  name: string;
  description: string;
  price: string | number;
  quantity: number;
  createdAt: string;
  shareLink?: string | null;
  sellerGithubLogin?: string | null;
};

type PurchaseResponse = {
  id: string;
  itemId: string;
  githubLogin: string;
  createdAt: string;
};

type StatusFilter = "all" | "in_stock" | "out_of_stock";
type SortOption = "newest" | "price_asc" | "price_desc" | "qty_left";

export function MarketplacePage() {
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Products", href: "/products", icon: "inventory_2" },
      { label: "Create Product", href: "/products/new", icon: "add_box" },
      { label: "Marketplace", href: "/marketplace", icon: "storefront" },
      { label: "Purchase History", href: "/purchase-history", icon: "history" },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [selected, setSelected] = useState<MarketplaceItem | null>(null);
  const [success, setSuccess] = useState<PurchaseResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch<MarketplaceItem[]>("/api/items")
      .then((data) => {
        if (cancelled) return;
        setItems(data);
      })
      .catch(() => {
        if (cancelled) return;
        setItems([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((i) => {
      const matchesQuery =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q);

      const inStock = i.quantity > 0;
      const matchesStatus =
        status === "all" ||
        (status === "in_stock" && inStock) ||
        (status === "out_of_stock" && !inStock);

      return matchesQuery && matchesStatus;
    });

    list = list.sort((a, b) => {
      if (sort === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sort === "price_asc") return Number(a.price) - Number(b.price);
      if (sort === "price_desc") return Number(b.price) - Number(a.price);
      if (sort === "qty_left") return b.quantity - a.quantity;
      return 0;
    });

    return list;
  }, [items, query, sort, status]);

  const pixCode = useMemo(() => {
    if (!selected) return "";
    const raw = `${selected.id}:${selected.price}:${selected.createdAt}`;
    return `pix_${btoa(raw).slice(0, 32)}`;
  }, [selected]);

  async function verifyPayment() {
    if (!selected) return;
    setIsVerifying(true);
    try {
      const res = await apiFetch<PurchaseResponse>("/api/purchases", {
        method: "POST",
        body: JSON.stringify({ itemId: selected.id }),
      });
      setSelected(null);
      setSuccess(res);
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <AppShell
      activeHref="/marketplace"
      sidebarTitle="Seller Console"
      sidebarItems={sidebarItems}
      searchPlaceholder="Search marketplace..."
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value="all">All</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
            <option value="newest">Newest</option>
            <option value="price_asc">Price Low→High</option>
            <option value="price_desc">Price High→Low</option>
            <option value="qty_left">Quantity Left</option>
          </Select>
        </div>
        <div className="w-full lg:max-w-md">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search marketplace..."
            leftSlot={<Icon name="search" className="text-[18px]" />}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <MarketplaceCard key={item.id} item={item} onBuy={() => setSelected(item)} />
        ))}
        {filtered.length === 0 ? (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardBody>
              <div className="text-slate-400">No products found.</div>
            </CardBody>
          </Card>
        ) : null}
      </div>

      <PaymentModal
        open={!!selected}
        item={selected}
        pixCode={pixCode}
        onClose={() => setSelected(null)}
        onVerify={verifyPayment}
        isVerifying={isVerifying}
      />

      <PaymentSuccessModal
        open={!!success}
        purchase={success}
        onClose={() => setSuccess(null)}
        onViewHistory={() => {
          window.location.href = "/purchase-history";
        }}
        onBackToMarketplace={() => setSuccess(null)}
      />
    </AppShell>
  );
}

function MarketplaceCard({
  item,
  onBuy,
}: {
  item: MarketplaceItem;
  onBuy: () => void;
}) {
  const inStock = item.quantity > 0;
  return (
    <Card className="overflow-hidden">
      <CardBody className="p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-white font-bold text-lg truncate">{item.name}</div>
            <div className="text-slate-500 text-sm line-clamp-2">{item.description}</div>
          </div>
          <div className="text-primary font-mono font-bold text-sm">
            ${Number(item.price).toFixed(2)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-xs text-slate-400">@{item.sellerGithubLogin ?? "seller"}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Quantity left:{" "}
              <span className={cn(inStock ? "text-slate-200" : "text-slate-500")}>
                {item.quantity}
              </span>
            </div>
          </div>
          <Badge variant={inStock ? "success" : "warning"}>
            {inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Listed {new Date(item.createdAt).toLocaleDateString()}
          </div>
          <Button
            type="button"
            size="sm"
            disabled={!inStock}
            onClick={onBuy}
            leftIcon={<Icon name="shopping_cart" className="text-[18px]" />}
          >
            Buy Now
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

function PaymentModal({
  open,
  item,
  pixCode,
  onClose,
  onVerify,
  isVerifying,
}: {
  open: boolean;
  item: MarketplaceItem | null;
  pixCode: string;
  onClose: () => void;
  onVerify: () => void;
  isVerifying: boolean;
}) {
  return (
    <Modal open={open} title="Complete Your Purchase" onClose={onClose} className="max-w-3xl">
      <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4">
        <div>
          <div className="text-white font-black text-xl">Complete Your Purchase</div>
          <div className="text-slate-500 text-sm">Order #{item?.id.slice(0, 8) ?? "-"}</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white"
          aria-label="Close"
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="text-sm font-bold uppercase tracking-widest text-slate-500">
            Product
          </div>
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-xl border border-white/10 bg-white/[0.02] flex items-center justify-center">
              <Icon name="shopping_bag" className="text-primary text-2xl" />
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold truncate">{item?.name}</div>
              <div className="text-slate-500 text-sm">
                by @{item?.sellerGithubLogin ?? "seller"}
              </div>
              <div className="mt-2 text-primary font-mono font-bold">
                ${Number(item?.price ?? 0).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Pix Payment
            </div>
            <Badge variant="primary">PIX</Badge>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex items-center justify-center">
            <div className="text-slate-500 text-sm">QR code placeholder</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Pix Hash Code
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs text-slate-200 overflow-hidden">
                {pixCode}
              </div>
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => navigator.clipboard.writeText(pixCode)}
                leftIcon={<Icon name="content_copy" className="text-[18px]" />}
              >
                Copy
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              onClick={onVerify}
              disabled={isVerifying || !item}
              leftIcon={<Icon name="check_circle" className="text-[18px]" />}
              className="flex-1"
            >
              {isVerifying ? "Verifying..." : "Verify Payment"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel and return to marketplace
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function PaymentSuccessModal({
  open,
  purchase,
  onClose,
  onViewHistory,
  onBackToMarketplace,
}: {
  open: boolean;
  purchase: PurchaseResponse | null;
  onClose: () => void;
  onViewHistory: () => void;
  onBackToMarketplace: () => void;
}) {
  return (
    <Modal open={open} title="Payment Successful!" onClose={onClose} className="max-w-xl">
      <div className="p-8 text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <Icon name="check" className="text-green-300 text-3xl" />
        </div>
        <div>
          <div className="text-white font-black text-2xl">Payment Successful!</div>
          <div className="text-slate-400 mt-2">
            Your purchase is now linked to your GitHub identity.
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 text-left space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-500">Transaction ID</div>
            <div className="text-slate-200 font-mono">{purchase?.id.slice(0, 12)}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-500">Date</div>
            <div className="text-slate-200">{new Date().toLocaleString()}</div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-500">Status</div>
            <Badge variant="success">Verified</Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button type="button" onClick={onViewHistory} className="flex-1">
            View in Purchase History
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onBackToMarketplace}
            className="flex-1"
          >
            Back to Marketplace
          </Button>
        </div>
      </div>
    </Modal>
  );
}
