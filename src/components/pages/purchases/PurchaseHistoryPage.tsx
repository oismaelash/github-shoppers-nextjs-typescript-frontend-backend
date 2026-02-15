"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, SidebarItem } from "@/components/app/AppShell";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pagination } from "@/components/ui/Pagination";
import { Toast } from "@/components/ui/Toast";
import { apiFetch } from "@/lib/api-fetch";

type PurchaseRow = {
  id: string;
  githubLogin: string;
  sellerGithubLogin?: string | null;
  createdAt: string;
  item: { id?: string; name: string; price: string | number };
};

export function PurchaseHistoryPage() {
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "Products", href: "/products", icon: "inventory_2" },
      { label: "Create Product", href: "/products/new", icon: "add_box" },
      { label: "Purchase History", href: "/purchase-history", icon: "history" },
    ],
    []
  );

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [rows, setRows] = useState<PurchaseRow[]>([]);
  const [showToast, setShowToast] = useState(() => {
    try {
      const u = new URL(window.location.href);
      return u.searchParams.get("success") === "1";
    } catch {
      return false;
    }
  });
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch<PurchaseRow[]>(`/api/me/purchases?page=${page}&pageSize=${pageSize}`)
      .then((data) => {
        if (cancelled) return;
        setRows(data);
      })
      .catch((e) => {
        if (e?.status === 401) {
          setUnauthorized(true);
          setRows([]);
        } else {
          setRows([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  const paged = rows.slice((page - 1) * pageSize, page * pageSize);
  const canPrev = page > 1;
  const canNext = rows.length > page * pageSize;

  return (
    <>
      <DashboardHeader />
      <AppShell
        activeHref="/purchase-history"
        sidebarTitle="Seller Console"
        sidebarItems={sidebarItems}
        searchPlaceholder="Search purchases..."
      >
        <div className="text-white font-black text-2xl">Purchase History</div>

        <Card>
          <CardBody className="p-0">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <div className="text-white font-bold">Purchases</div>
            </div>
            <Table className="rounded-none border-0">
              <THead>
                <tr>
                  <TH>Item Name</TH>
                  <TH>Seller GitHub Login</TH>
                  <TH>Price</TH>
                  <TH>Purchase Date</TH>
                  <TH className="text-right">Action</TH>
                </tr>
              </THead>
              <TBody>
                {unauthorized ? (
                  <TR>
                    <TD colSpan={5} className="text-slate-500">
                      You must be signed in to view your purchase history.
                    </TD>
                  </TR>
                ) : null}
                {paged.map((p) => (
                  <TR key={p.id}>
                    <TD className="text-white font-semibold">{p.item.name}</TD>
                    <TD className="text-slate-300">@{p.sellerGithubLogin ?? "seller"}</TD>
                    <TD className="text-primary font-mono font-bold">
                      ${Number(p.item.price).toFixed(2)}
                    </TD>
                    <TD className="text-slate-400">
                      {new Date(p.createdAt).toLocaleString()}
                    </TD>
                    <TD className="text-right">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => window.open(`/api/purchases/${p.id}/invoice`, "_blank")}
                        leftIcon={<Icon name="receipt_long" className="text-[18px]" />}
                      >
                        View Invoice
                      </Button>
                    </TD>
                  </TR>
                ))}
                {paged.length === 0 ? (
                  <TR>
                    <TD colSpan={5} className="text-slate-500">
                      {unauthorized ? " " : "No purchases found."}
                    </TD>
                  </TR>
                ) : null}
              </TBody>
            </Table>
          </CardBody>
        </Card>

        <Pagination
          canPrev={canPrev}
          canNext={canNext}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => p + 1)}
        />

        <Toast
          open={showToast}
          title="Purchase Success"
          message="Your purchase was completed successfully."
          onClose={() => setShowToast(false)}
        />
      </AppShell>
    </>
  );
}
