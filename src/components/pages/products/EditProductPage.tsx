"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, SidebarItem } from "@/components/app/AppShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { apiFetch } from "@/lib/api-fetch";

type ItemDTO = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  quantity: number;
};

export function EditProductPage({ locale, id }: { locale: string; id: string }) {
  const base = `/${locale}`;
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      { label: "Dashboard", href: base, icon: "dashboard" },
      { label: "My Products", href: `${base}/products`, icon: "inventory_2" },
      { label: "Create Product", href: `${base}/products/new`, icon: "add_box" },
      { label: "Marketplace", href: `${base}/marketplace`, icon: "storefront" },
      { label: "Purchase History", href: `${base}/purchase-history`, icon: "history" },
    ],
    [base]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiFetch<ItemDTO>(`/api/items/${id}`)
      .then((item) => {
        if (cancelled) return;
        setName(item.name);
        setDescription(item.description);
        setPrice(String(item.price));
        setQuantity(String(item.quantity));
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load product");
      })
      .finally(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await apiFetch(`/api/items/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          quantity: Number(quantity),
        }),
      });
      window.location.href = `${base}/products`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell
      activeHref={`${base}/products`}
      sidebarTitle="Seller Console"
      sidebarItems={sidebarItems}
      searchPlaceholder="Search inventory..."
    >
      <div className="text-white font-black text-2xl">Edit Product</div>

      <Card className="max-w-3xl">
        <CardBody className="p-8 space-y-6">
          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {loading ? (
            <div className="text-slate-500">Loading...</div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="text-sm font-bold text-white">Product Name</div>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. React Component Kit"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm font-bold text-white">Price (USD)</div>
                  <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    inputMode="decimal"
                    placeholder="49.00"
                    leftSlot={<span className="text-slate-500 font-bold">$</span>}
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-bold text-white">Quantity</div>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    inputMode="numeric"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-bold text-white">Description</div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary/40"
                  placeholder="Write a detailed description (Markdown supported)."
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => (window.location.href = `${base}/products`)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={save}
                  disabled={saving || !name || !price || !description}
                  leftIcon={<Icon name="save" className="text-[18px]" />}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </AppShell>
  );
}
