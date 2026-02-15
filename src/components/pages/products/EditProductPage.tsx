"use client";

import { useEffect, useMemo, useState } from "react";
import { AppShell, SidebarItem } from "@/components/app/AppShell";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
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

type EnhanceResponse = {
  improvedTitle: string;
  improvedDescription: string;
};



function formatError(error: any): string {
  if (typeof error === "string") return error;
  if (error?.error?._errors) {
    const zodError = error.error;
    const messages: string[] = [];
    if (zodError.name?._errors?.[0]) messages.push(`Name: ${zodError.name._errors[0]}`);
    if (zodError.description?._errors?.[0]) messages.push(`Description: ${zodError.description._errors[0]}`);
    if (zodError.price?._errors?.[0]) messages.push(`Price: ${zodError.price._errors[0]}`);
    if (zodError.quantity?._errors?.[0]) messages.push(`Quantity: ${zodError.quantity._errors[0]}`);
    return messages.join(", ") || "Validation failed";
  }
  return error?.message || "An unexpected error occurred";
}

export function EditProductPage({ id }: { id: string }) {
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "My Products", href: "/products", icon: "inventory_2" },
      { label: "Create Product", href: "/products/new", icon: "add_box" },
      { label: "Purchase History", href: "/purchase-history", icon: "history" },
    ],
    []
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

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
      .catch((e: any) => {
        setError(formatError(e));
      })
      .finally(() => setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function enhance() {
    setEnhancing(true);
    setError(null);
    try {
      const res = await apiFetch<EnhanceResponse>("/api/ai/enhance", {
        method: "POST",
        body: JSON.stringify({ title: name, description }),
      });
      setName(res.improvedTitle);
      setDescription(res.improvedDescription);
    } catch (e: any) {
      setError(formatError(e));
    } finally {
      setEnhancing(false);
    }
  }



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
      window.location.href = "/products";
    } catch (e) {
      setError(formatError(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <DashboardHeader />
      <AppShell
        activeHref="/products"
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

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-white">Description</div>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary/40"
                      rows={6}
                      placeholder="Write a detailed description (Markdown supported)."
                    />
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={enhance}
                    disabled={enhancing || !description.trim()}
                    leftIcon={<Icon name="auto_awesome" className="text-[18px]" />}
                    className="w-full sm:w-auto"
                  >
                    {enhancing ? "Enhancing..." : "Enhance with AI"}
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => (window.location.href = "/products")}
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
    </>
  );
}
