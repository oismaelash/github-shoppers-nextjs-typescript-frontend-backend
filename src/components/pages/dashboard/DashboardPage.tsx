"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, SidebarItem } from "@/components/app/AppShell";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { apiFetch } from "@/lib/api-fetch";

type DashboardPurchaseRow = {
  id: string;
  githubLogin: string;
  createdAt: string;
  item: { name: string; price: string | number };
};

type ItemRow = {
  id: string;
  quantity: number;
};

export function DashboardPage() {
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "My Products", href: "/products", icon: "inventory_2" },
      { label: "Create Product", href: "/products/new", icon: "add_box" },
      { label: "Purchase History", href: "/purchase-history", icon: "history" },
    ],
    []
  );

  const [purchases, setPurchases] = useState<DashboardPurchaseRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch<DashboardPurchaseRow[]>("/api/me/sales").catch(() => []),
      apiFetch<ItemRow[]>("/api/me/items").catch(() => []),
    ]).then(([p, i]) => {
      if (cancelled) return;
      setPurchases(p);
      setItems(i);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const totalProducts = items.length;
  const totalSales = purchases.length;
  const lowStock = items.filter((i) => i.quantity > 0 && i.quantity <= 3).length;

  return (
    <>
      <DashboardHeader />
      <AppShell
        activeHref="/dashboard"
        sidebarTitle="Seller Console"
        sidebarItems={sidebarItems}
        searchPlaceholder="Search orders..."
      >
        <div className="grid md:grid-cols-3 gap-6">
          <StatCard title="Total Products" value={String(totalProducts)} />
          <StatCard title="Total Sales" value={String(totalSales)} />
          <StatCard title="Low Stock" value={String(lowStock)} />
        </div>

        <Card>
          <CardBody className="p-0">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="text-white font-bold">Recent Sales</div>
              <div className="text-sm text-slate-400">View All</div>
            </div>
            <Table className="rounded-none border-0">
              <THead>
                <tr>
                  <TH>Item Name</TH>
                  <TH>Buyer</TH>
                  <TH>Price</TH>
                  <TH>Date</TH>
                </tr>
              </THead>
              <TBody>
                {purchases.slice(0, 7).map((p) => (
                  <TR key={p.id}>
                    <TD className="text-white font-semibold">{p.item.name}</TD>
                    <TD className="text-slate-300">@{p.githubLogin}</TD>
                    <TD className="text-primary font-mono font-bold">
                      ${Number(p.item.price).toFixed(2)}
                    </TD>
                    <TD className="text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </TD>
                  </TR>
                ))}
                {purchases.length === 0 ? (
                  <TR>
                    <TD colSpan={4} className="text-slate-500">
                      No purchases yet.
                    </TD>
                  </TR>
                ) : null}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </AppShell>
    </>
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

