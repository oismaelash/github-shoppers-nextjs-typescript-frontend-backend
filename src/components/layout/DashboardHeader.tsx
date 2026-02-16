"use client";

import { useSession, signOut } from "next-auth/react";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import Link from "next/link";

export function DashboardHeader() {
    const { data: session } = useSession();
    const user = session?.user;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background-dark/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
                        <LogoMark className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white hidden sm:block">
                        GitHub Shoppers
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 py-1.5 pl-1.5 pr-4 rounded-3xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                        <div className="h-10 w-10 rounded-2xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name ?? "User"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                    <Icon name="person" className="text-slate-500" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-white truncate leading-tight">
                                {user?.name || "Anonymous User"}
                            </span>
                            <span className="text-[11px] font-medium text-primary/80 truncate uppercase tracking-wider leading-tight">
                                @{user?.githubLogin || "unknown"}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 transition-colors"
                        aria-label="Sair"
                    >
                        <Icon name="logout" className="text-[18px]" />
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
