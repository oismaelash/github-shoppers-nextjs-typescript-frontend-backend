"use client";

import { useMemo, useState } from "react";
import { AppShell, SidebarItem } from "@/components/app/AppShell";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { apiFetch } from "@/lib/api-fetch";

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
    } catch (e: any) {
      setError(formatError(e));
    } finally {
      setEnhancing(false);
    }
  }



  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch("/api/items", {
        method: "POST",
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
      setSubmitting(false);
    }
  }

  return (
    <>
      <DashboardHeader />
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
    </>
  );
}

