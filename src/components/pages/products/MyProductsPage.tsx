"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, SidebarItem } from "@/components/app/AppShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { apiFetch } from "@/lib/api-fetch";

type ProductRow = {
  id: string;
  name: string;
  price: string | number;
  quantity: number;
  createdAt: string;
  shareLink?: string | null;
};

type SaleRow = {
  id: string;
  buyer: string;
  pricePaid: string | number;
  createdAt: string;
  status: "CONFIRMED" | "PENDING";
};

type SalesSummary = {
  totalSales: number;
  revenue: number;
  sales: SaleRow[];
};

export function MyProductsPage() {
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "My Products", href: "/products", icon: "inventory_2" },
      { label: "Create Product", href: "/products/new", icon: "add_box" },
      { label: "Purchase History", href: "/purchase-history", icon: "history" },
    ],
    []
  );

  const [products, setProducts] = useState<ProductRow[]>([]);
  const [salesFor, setSalesFor] = useState<ProductRow | null>(null);
  const [sales, setSales] = useState<SalesSummary | null>(null);
  const [loadingSales, setLoadingSales] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch<ProductRow[]>("/api/me/items")
      .then((data) => {
        if (cancelled) return;
        setProducts(data);
      })
      .catch((e) => {
        if (e?.status === 401) {
          setUnauthorized(true);
          setProducts([]);
        } else {
          setProducts([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function openSales(p: ProductRow) {
    setSalesFor(p);
    setLoadingSales(true);
    try {
      const res = await apiFetch<SalesSummary>(`/api/items/${p.id}/sales`);
      setSales(res);
    } catch {
      setSales({
        totalSales: 0,
        revenue: 0,
        sales: [],
      });
    } finally {
      setLoadingSales(false);
    }
  }

  async function deleteProduct(p: ProductRow) {
    const ok = window.confirm(`Delete "${p.name}"?`);
    if (!ok) return;
    await apiFetch(`/api/items/${p.id}`, { method: "DELETE" }).catch(() => { });
    setProducts((prev) => prev.filter((x) => x.id !== p.id));
  }

  const totalProducts = products.length;
  const activeListings = products.filter((p) => p.quantity > 0).length;
  const outOfStock = products.filter((p) => p.quantity <= 0).length;
  const totalInventory = products.reduce((acc, p) => acc + p.quantity, 0);

  return (
    <AppShell
      activeHref="/products"
      sidebarTitle="Seller Console"
      sidebarItems={sidebarItems}
      searchPlaceholder="Search inventory..."
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-white font-black text-2xl">My Products</div>
        <ButtonLink
          href="/products/new"
          leftIcon={<Icon name="add" className="text-[18px]" />}
        >
          Add Product
        </ButtonLink>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Products" value={String(totalProducts)} />
        <StatCard title="Active Listings" value={String(activeListings)} />
        <StatCard title="Out of Stock" value={String(outOfStock)} />
        <StatCard title="Total Inventory" value={String(totalInventory)} />
      </div>

      <Card>
        <CardBody className="p-0">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <div className="text-white font-bold">Inventory</div>
          </div>
          <Table className="rounded-none border-0">
            <THead>
              <tr>
                <TH>Name</TH>
                <TH>Price</TH>
                <TH>Quantity</TH>
                <TH>Created At</TH>
                <TH>Status</TH>
                <TH className="text-right">Actions</TH>
              </tr>
            </THead>
            <TBody>
              {unauthorized ? (
                <TR>
                  <TD colSpan={6} className="text-slate-500">
                    You must be signed in to view your products.
                  </TD>
                </TR>
              ) : null}
              {products.map((p) => {
                const inStock = p.quantity > 0;
                return (
                  <TR key={p.id}>
                    <TD className="text-white font-semibold">{p.name}</TD>
                    <TD className="text-primary font-mono font-bold">
                      ${Number(p.price).toFixed(2)}
                    </TD>
                    <TD>{p.quantity}</TD>
                    <TD className="text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TD>
                    <TD>
                      <Badge variant={inStock ? "success" : "warning"}>
                        {inStock ? "Active" : "Out"}
                      </Badge>
                    </TD>
                    <TD className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openSales(p)}
                          leftIcon={<Icon name="history" className="text-[18px]" />}
                        >
                          Sales
                        </Button>
                        <ButtonLink
                          href={`/products/${p.id}/edit`}
                          variant="ghost"
                          size="sm"
                          leftIcon={<Icon name="edit" className="text-[18px]" />}
                        >
                          Edit
                        </ButtonLink>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            p.shareLink
                              ? window.open(p.shareLink, "_blank")
                              : navigator.clipboard.writeText(window.location.href)
                          }
                          leftIcon={<Icon name="open_in_new" className="text-[18px]" />}
                        >
                          Share
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => deleteProduct(p)}
                          leftIcon={<Icon name="delete" className="text-[18px]" />}
                        >
                          Delete
                        </Button>
                      </div>
                    </TD>
                  </TR>
                );
              })}
              {products.length === 0 ? (
                <TR>
                  <TD colSpan={6} className="text-slate-500">
                    {unauthorized ? " " : "No products yet."}
                  </TD>
                </TR>
              ) : null}
            </TBody>
          </Table>
        </CardBody>
      </Card>

      <SalesHistoryModal
        open={!!salesFor}
        product={salesFor}
        sales={sales}
        loading={loadingSales}
        onClose={() => {
          setSalesFor(null);
          setSales(null);
        }}
      />
    </AppShell>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardBody className="p-6">
        <div className="text-sm font-bold uppercase tracking-widest text-slate-500">
          {title}
        </div>
        <div className="mt-3 text-4xl font-black text-white">{value}</div>
      </CardBody>
    </Card>
  );
}

function SalesHistoryModal({
  open,
  product,
  sales,
  loading,
  onClose,
}: {
  open: boolean;
  product: ProductRow | null;
  sales: SalesSummary | null;
  loading: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} title="Sales History" onClose={onClose} className="max-w-4xl">
      <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4">
        <div>
          <div className="text-white font-black text-xl">
            Sales History: {product?.name ?? ""}
          </div>
          <div className="text-slate-500 text-sm">Recent sales and status.</div>
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

      <div className="p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass-card rounded-2xl p-5">
            <div className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Total sales
            </div>
            <div className="mt-2 text-3xl font-black text-white">
              {sales?.totalSales ?? 0}
            </div>
          </div>
          <div className="glass-card rounded-2xl p-5">
            <div className="text-sm font-bold uppercase tracking-widest text-slate-500">
              Revenue
            </div>
            <div className="mt-2 text-3xl font-black text-white">
              ${Number(sales?.revenue ?? 0).toFixed(2)}
            </div>
          </div>
        </div>

        <Table>
          <THead>
            <tr>
              <TH>Buyer</TH>
              <TH>Price Paid</TH>
              <TH>Date</TH>
              <TH>Status</TH>
            </tr>
          </THead>
          <TBody>
            {loading ? (
              <TR>
                <TD colSpan={4} className="text-slate-500">
                  Loading...
                </TD>
              </TR>
            ) : sales && sales.sales.length > 0 ? (
              sales.sales.map((s) => (
                <TR key={s.id}>
                  <TD className="text-slate-200">@{s.buyer}</TD>
                  <TD className="text-primary font-mono font-bold">
                    ${Number(s.pricePaid).toFixed(2)}
                  </TD>
                  <TD className="text-slate-400">
                    {new Date(s.createdAt).toLocaleString()}
                  </TD>
                  <TD>
                    <Badge variant={s.status === "CONFIRMED" ? "success" : "warning"}>
                      {s.status}
                    </Badge>
                  </TD>
                </TR>
              ))
            ) : (
              <TR>
                <TD colSpan={4} className="text-slate-500">
                  No sales for this product yet.
                </TD>
              </TR>
            )}
          </TBody>
        </Table>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (!product) return;
              window.open(`/api/items/${product.id}/sales/export`, "_blank");
            }}
            leftIcon={<Icon name="download" className="text-[18px]" />}
          >
            Export CSV
          </Button>
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
