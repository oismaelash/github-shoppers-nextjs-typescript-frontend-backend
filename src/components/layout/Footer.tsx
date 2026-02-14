"use client";

import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";

type FooterNavItem = {
    label: string;
    href: string;
};

const footerLinks: FooterNavItem[] = [
    { label: "Terms", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Security", href: "#" },
    { label: "GitHub Repo", href: "#" },
];

export function Footer() {
    return (
        <footer className="border-t border-white/5 py-12 bg-background-dark text-slate-500 text-sm">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-1 rounded-md">
                        <LogoMark className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-bold text-white">GitHub Shoppers</span>
                </div>
                <div className="flex gap-8">
                    {footerLinks.map((link) => (
                        <Link
                            key={link.label}
                            className="hover:text-primary transition-colors"
                            href={link.href}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
                <p>© {new Date().getFullYear()} GitHub Shoppers. Not affiliated with GitHub, Inc.</p>
            </div>
        </footer>
    );
}
