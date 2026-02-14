"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/Badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/Table";
import { apiFetch } from "@/lib/api-fetch";
import { Navbar } from "@/components/layout/Navbar";

type LedgerRow = {
  id: string;
  product: string;
  seller: string;
  buyer: string;
  price: string | number;
  createdAt: string;
  status: "VERIFIED" | "PENDING";
};

export function PublicLedgerPage() {
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<LedgerRow[]>([]);

  useEffect(() => {
    let cancelled = false;
    apiFetch<LedgerRow[]>(`/api/ledger?query=${encodeURIComponent(query)}`)
      .then((data) => {
        if (cancelled) return;
        setRows(data);
      })
      .catch(() => setRows([]));
    return () => {
      cancelled = true;
    };
  }, [query]);

  const visible = useMemo(() => rows.slice(0, 10), [rows]);

  return (
    <div className="min-h-screen bg-background-dark text-slate-100">
      <Navbar activeHref="/ledger" />

      <section className="relative pt-20 pb-10 overflow-hidden grid-pattern">
        <div className="absolute inset-0 hero-glow pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4">
              <Badge variant="primary">LIVE UPDATES</Badge>
              <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight">
                Public Ledger
              </h1>
              <p className="text-slate-400 max-w-2xl">
                Transparent records of marketplace activity, verified and searchable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pb-24 space-y-8">
        <Card>
          <CardBody className="p-6 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search product, buyer, or seller..."
                  leftSlot={<Icon name="search" className="text-[18px]" />}
                />
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  leftIcon={<Icon name="filter_alt" className="text-[18px]" />}
                  onClick={() => { }}
                >
                  Filter
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  leftIcon={<Icon name="download" className="text-[18px]" />}
                  onClick={() => window.open(`/api/ledger/export?query=${encodeURIComponent(query)}`)}
                >
                  Export
                </Button>
              </div>
            </div>

            <Table>
              <THead>
                <tr>
                  <TH>Product</TH>
                  <TH>Seller</TH>
                  <TH>Buyer</TH>
                  <TH>Price</TH>
                  <TH>Date/Time</TH>
                  <TH>Status</TH>
                </tr>
              </THead>
              <TBody>
                {visible.map((r) => (
                  <TR key={r.id}>
                    <TD className="text-white font-semibold">{r.product}</TD>
                    <TD className="text-slate-300">@{r.seller}</TD>
                    <TD className="text-slate-300">@{r.buyer}</TD>
                    <TD className="text-primary font-mono font-bold">
                      ${Number(r.price).toFixed(2)}
                    </TD>
                    <TD className="text-slate-400">
                      {new Date(r.createdAt).toLocaleString()}
                    </TD>
                    <TD>
                      <Badge variant={r.status === "VERIFIED" ? "success" : "warning"}>
                        {r.status}
                      </Badge>
                    </TD>
                  </TR>
                ))}
                {visible.length === 0 ? (
                  <TR>
                    <TD colSpan={6} className="text-slate-500">
                      No transactions found.
                    </TD>
                  </TR>
                ) : null}
              </TBody>
            </Table>

            <div className="text-sm text-slate-500">
              Showing 1-10 of {rows.length} transactions
            </div>
          </CardBody>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardBody className="p-6 space-y-3">
              <div className="text-white font-bold">Proof of Stake</div>
              <div className="text-slate-400 text-sm">
                Each transaction includes verifiable metadata linked to GitHub identity.
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="p-6 space-y-3">
              <div className="text-white font-bold">Public Access</div>
              <div className="text-slate-400 text-sm">
                Anyone can search and export ledger entries for transparency.
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
