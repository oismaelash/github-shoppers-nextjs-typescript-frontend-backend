import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/Input";

export type SidebarItem = {
  label: string;
  href: string;
  icon: string;
};

export function AppShell({
  activeHref,
  sidebarTitle,
  sidebarItems,
  searchPlaceholder,
  children,
}: {
  activeHref: string;
  sidebarTitle: string;
  sidebarItems: SidebarItem[];
  searchPlaceholder: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background-dark text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="lg:sticky lg:top-8 h-fit">
            <Sidebar
              activeHref={activeHref}
              sidebarTitle={sidebarTitle}
              items={sidebarItems}
            />
          </aside>
          <div className="min-w-0 space-y-8">
            <TopBar searchPlaceholder={searchPlaceholder} />
            {children}
          </div>
        </div>
      </div>
      <footer className="border-t border-white/5 py-10 text-center text-sm text-slate-500">
        © 2024 GitHub Shoppers. Not affiliated with GitHub, Inc.
      </footer>
    </div>
  );
}

function Sidebar({
  activeHref,
  sidebarTitle,
  items,
}: {
  activeHref: string;
  sidebarTitle: string;
  items: SidebarItem[];
}) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-primary/10 p-1 rounded-md">
          <Icon name="shopping_bag" className="text-primary" />
        </div>
        <div className="font-bold text-white">{sidebarTitle}</div>
      </div>
      <nav className="space-y-1">
        {items.map((item) => {
          const active = item.href === activeHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-slate-300 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <Icon name={item.icon} className="text-[20px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function TopBar({ searchPlaceholder }: { searchPlaceholder: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <Input
        placeholder={searchPlaceholder}
        leftSlot={<Icon name="search" className="text-[18px]" />}
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="h-11 w-11 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] flex items-center justify-center"
        >
          <Icon name="notifications" />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="h-11 w-11 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] flex items-center justify-center"
        >
          <Icon name="settings" />
        </button>
      </div>
    </div>
  );
}

