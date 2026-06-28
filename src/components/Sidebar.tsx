"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Globe,
  User,
  Folder,
  Plus,
  Sun,
  Moon,
  Boxes,
  CreditCard,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

const navItems = [
  { label: "Overview",  href: "/",          icon: LayoutDashboard },
  { label: "Portfolio", href: "/portfolio", icon: BarChart3 },
  { label: "Pricing",   href: "/pricing",   icon: CreditCard },
  { label: "Community", href: "/community", icon: Globe },
  { label: "Account",   href: "/account",   icon: User },
];

const files = ["Communication", "Affiliates", "Marketing"];

function isActiveHref(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)] px-4 py-6 dark:border-[var(--border)] dark:bg-[var(--surface)]">
      <Link href="/" className="flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
          <Boxes size={18} />
        </div>
        <span className="text-lg font-semibold tracking-tight">MarketCap</span>
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = isActiveHref(pathname, href);
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--primary-soft)] text-[var(--text)] dark:bg-[var(--primary-soft-hover)] dark:text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] dark:text-[var(--text-subtle)] dark:hover:bg-[var(--surface-hover)] dark:hover:text-white"
              }`}
            >
              <Icon size={18} className={active ? "text-[var(--primary)]" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 flex items-center justify-between px-3">
        <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-subtle)]">
          Files
        </span>
        <button className="text-[var(--text-subtle)] hover:text-[var(--text)] dark:hover:text-white">
          <Plus size={16} />
        </button>
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {files.map((file) => (
          <button
            key={file}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)] dark:text-[var(--text-subtle)] dark:hover:bg-[var(--surface-hover)] dark:hover:text-white"
          >
            <Folder size={18} />
            {file}
          </button>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <div className="flex items-center rounded-full bg-[var(--bg)] p-1 text-sm font-medium dark:bg-[var(--surface-hover)]">
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 ${
              theme === "light"
                ? "bg-[var(--surface)] shadow-sm dark:bg-[var(--surface-hover)] dark:text-white"
                : "text-[var(--text-subtle)]"
            }`}
          >
            <Sun size={14} /> Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-1.5 ${
              theme === "dark"
                ? "bg-[var(--surface)] shadow-sm dark:bg-[var(--surface-hover)] dark:text-white"
                : "text-[var(--text-subtle)]"
            }`}
          >
            <Moon size={14} /> Dark
          </button>
        </div>
      </div>
    </aside>
  );
}
