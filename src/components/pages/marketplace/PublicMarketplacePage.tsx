"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Icon } from "@/components/ui/Icon";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { apiFetch } from "@/lib/api-fetch";
import { cn } from "@/lib/cn";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

type SortOption = "newest" | "price_asc" | "price_desc";

export function PublicMarketplacePage() {
    const [query, setQuery] = useState("");
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
            return (
                !q ||
                i.name.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q)
            );
        });

        list = list.sort((a, b) => {
            if (sort === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sort === "price_asc") return Number(a.price) - Number(b.price);
            if (sort === "price_desc") return Number(b.price) - Number(a.price);
            return 0;
        });

        return list;
    }, [items, query, sort]);

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
        } catch (err) {
            console.error("Payment verification failed", err);
        } finally {
            setIsVerifying(false);
        }
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
            {/* Top Navigation Bar */}
            <Navbar activeHref="/marketplace" />

            <main className="flex-grow">
                {/* Hero Header */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
                            Public Marketplace
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl">
                            Browse developer-created tools and assets, verified by GitHub identity. Find the perfect components for your next project.
                        </p>
                    </div>
                </section>

                {/* Search & Filter Controls */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                    <div className="flex flex-col gap-4">
                        {/* Search Bar */}
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search tools, assets, and libraries..."
                            leftSlot={<Icon name="search" className="text-xl" />}
                            className="w-full"
                        />
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2">
                            <FilterButton label="All Categories" />
                            <FilterDropdown
                                label={sort === "newest" ? "Newest" : sort === "price_asc" ? "Price: Low to High" : "Price: High to Low"}
                                options={[
                                    { label: "Newest", value: "newest" },
                                    { label: "Price: Low to High", value: "price_asc" },
                                    { label: "Price: High to Low", value: "price_desc" },
                                ]}
                                value={sort}
                                onChange={(val) => setSort(val as SortOption)}
                            />
                            <FilterButton label="Rating: 4+ Stars" />
                            <FilterButton label="Verified Sellers" />
                            <div className="ml-auto hidden lg:flex items-center gap-2 text-sm text-slate-500">
                                <span>Showing {filtered.length} results</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map((item) => (
                            <PublicProductCard key={item.id} item={item} onBuy={() => setSelected(item)} />
                        ))}
                    </div>
                    {filtered.length === 0 && (
                        <div className="text-center py-20 bg-white/[0.02] rounded-2xl border border-white/5">
                            <Icon name="inventory_2" className="text-5xl text-slate-700 mb-4" />
                            <p className="text-slate-500">No products found matching your search.</p>
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <Footer />

            {/* Modals */}
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
        </div>
    );
}

function FilterButton({ label }: { label: string }) {
    return (
        <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/[0.05] transition-colors text-slate-300">
            <span>{label}</span>
            <Icon name="expand_more" className="text-[18px]" />
        </button>
    );
}

function FilterDropdown({
    label,
    options,
    value,
    onChange
}: {
    label: string,
    options: { label: string, value: string }[],
    value: string,
    onChange: (val: string) => void
}) {
    return (
        <div className="relative group/dropdown">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/[0.05] transition-colors text-slate-300">
                <span>{label}</span>
                <Icon name="expand_more" className="text-[18px]" />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a2b34] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-50 overflow-hidden">
                {options.map(opt => (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={cn(
                            "w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-colors",
                            value === opt.value ? "text-primary font-bold bg-primary/5" : "text-slate-400"
                        )}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

function PublicProductCard({ item, onBuy }: { item: MarketplaceItem; onBuy: () => void }) {
    const inStock = item.quantity > 0;
    return (
        <div className="group bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-primary/50 transition-all flex flex-col">
            <div className="h-48 w-full bg-[#162127] overflow-hidden relative">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-blue-900/10">
                    <Icon name="shopping_bag" className="text-5xl text-primary/30 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="absolute top-3 right-3">
                    <Badge variant={inStock ? "success" : "warning"}>
                        {inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-white mb-2 truncate">{item.name}</h3>
                <p className="text-slate-500 text-xs mb-4 line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                        <Icon name="person" className="text-[16px] text-slate-500" />
                    </div>
                    <span className="text-xs text-slate-400 truncate">
                        Sold by <span className="text-primary font-medium">@{item.sellerGithubLogin ?? "dev"}</span>
                    </span>
                    <Icon name="verified" className="text-primary text-[14px] fill-1" />
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xl font-black text-white">${Number(item.price).toFixed(2)}</span>
                    <Button
                        onClick={onBuy}
                        disabled={!inStock}
                        size="sm"
                        variant={inStock ? "primary" : "secondary"}
                    >
                        Buy Now
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Logic reused from old MarketplacePage.tsx
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
                <div className="glass-card rounded-2xl p-5 space-y-4 bg-white/[0.02] border border-white/10">
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

                <div className="glass-card rounded-2xl p-5 space-y-4 bg-white/[0.02] border border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-bold uppercase tracking-widest text-slate-500">
                            Pix Payment
                        </div>
                        <Badge variant="primary">PIX</Badge>
                    </div>

                    <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-6 flex flex-col items-center justify-center gap-4">
                        <Icon name="qr_code_2" className="text-6xl text-slate-300" />
                        <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Scan with your bank app</div>
                    </div>

                    <div className="space-y-2">
                        <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Pix Hash Code
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 font-mono text-xs text-slate-200 overflow-hidden truncate">
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

                    <div className="flex flex-col gap-3 pt-2">
                        <Button
                            type="button"
                            onClick={onVerify}
                            disabled={isVerifying || !item}
                            leftIcon={<Icon name="check_circle" className="text-[18px]" />}
                            className="w-full"
                        >
                            {isVerifying ? "Verifying..." : "Verify Payment"}
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

                <div className="glass-card rounded-2xl p-5 text-left space-y-2 bg-white/[0.02] border border-white/10">
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
