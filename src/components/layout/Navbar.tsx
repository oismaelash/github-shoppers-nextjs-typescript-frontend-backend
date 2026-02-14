"use client";

import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Logo";

type NavItem = {
    label: string;
    href: string;
};

const navItems: NavItem[] = [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Ledger", href: "/ledger" },
    { label: "Features", href: "/#features" },
    { label: "Documentation", href: "/#documentation" },
    { label: "Pricing", href: "/#pricing" },
];

export function Navbar({ activeHref }: { activeHref?: string }) {
    const { data: session } = useSession();

    return (
        <nav className="sticky top-0 z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Brand />
                <DesktopNav activeHref={activeHref} />
                <div className="flex items-center gap-4">
                    {session ? (
                        <Button
                            onClick={() => (window.location.href = "/dashboard")}
                            size="sm"
                            variant="secondary"
                            leftIcon={<Icon name="dashboard" className="text-[20px]" />}
                        >
                            Dashboard
                        </Button>
                    ) : (
                        <AuthButtons />
                    )}
                </div>
            </div>
        </nav>
    );
}

function Brand() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                <LogoMark className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
                GitHub Shoppers
            </span>
        </Link>
    );
}

function DesktopNav({ activeHref }: { activeHref?: string }) {
    return (
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        className={
                            isActive
                                ? "text-primary border-b-2 border-primary pb-1"
                                : "text-slate-400 hover:text-primary transition-colors"
                        }
                    >
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );
}

function AuthButtons() {
    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                className="hidden sm:flex text-sm font-semibold px-4 py-2 text-slate-200 hover:text-primary transition-colors"
            >
                Sign In
            </button>
            <Button
                onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
                size="sm"
                leftIcon={<Icon name="login" className="text-[20px]" />}
            >
                Continue with GitHub
            </Button>
        </div>
    );
}
