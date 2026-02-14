"use client";

import { useMemo, useState } from "react";
import { AppShell, SidebarItem } from "@/components/app/AppShell";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { apiFetch } from "@/lib/api-fetch";

type EnhanceResponse = {
  improvedTitle: string;
  improvedDescription: string;
};

export function CreateProductPage() {
  const sidebarItems: SidebarItem[] = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
      { label: "My Products", href: "/products", icon: "inventory_2" },
      { label: "Create Product", href: "/products/new", icon: "add_box" },
      { label: "Purchase History", href: "/purchase-history", icon: "history" },
    ],
    []
  );

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [description, setDescription] = useState("");
  const [seo, setSeo] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to enhance");
    } finally {
      setEnhancing(false);
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      let finalName = name;
      let finalDescription = description;
      if (seo) {
        const res = await apiFetch<EnhanceResponse>("/api/ai/enhance", {
          method: "POST",
          body: JSON.stringify({ title: name, description }),
        }).catch(() => null);
        if (res) {
          finalName = res.improvedTitle;
          finalDescription = res.improvedDescription;
        }
      }

      await apiFetch("/api/items", {
        method: "POST",
        body: JSON.stringify({
          name: finalName,
          description: finalDescription,
          price: Number(price),
          quantity: Number(quantity),
        }),
      });

      window.location.href = "/products";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create product");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell
      activeHref="/products/new"
      sidebarTitle="Seller Console"
      sidebarItems={sidebarItems}
      searchPlaceholder="Search inventory..."
    >
      <div className="text-white font-black text-2xl">Create Product</div>

      <Card className="max-w-3xl">
        <CardBody className="p-8 space-y-6">
          {error ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <div className="text-sm font-bold text-white">Product Name</div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React Component Kit"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={enhance}
                disabled={enhancing || (!name && !description)}
                leftIcon={<Icon name="auto_awesome" className="text-[18px]" />}
                className="shrink-0"
              >
                {enhancing ? "Enhancing..." : "Enhance with AI"}
              </Button>
            </div>
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

          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4">
            <input
              type="checkbox"
              checked={seo}
              onChange={(e) => setSeo(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            <div>
              <div className="text-white font-bold">SEO Optimization</div>
              <div className="text-sm text-slate-500">
                Enhance title and description with AI before publishing.
              </div>
            </div>
          </label>

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
              onClick={submit}
              disabled={submitting || !name || !price || !description}
              leftIcon={<Icon name="add_box" className="text-[18px]" />}
            >
              {submitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </AppShell>
  );
}

