"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/graph", label: "Graph" },
  { href: "/tags", label: "Tags" },
  { href: "/changelog", label: "Changelog" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav
      style={{
        background: "var(--color-surface)",
        borderBottom: "2px solid var(--color-border)",
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-12">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="font-serif text-lg font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            🪴 shubhi&apos;s digital garden
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1 list-none">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded border-2 transition-all duration-200"
                  style={
                    isActive(link.href)
                      ? {
                          background: "var(--color-text-primary)",
                          color: "var(--color-surface)",
                          borderColor: "var(--color-text-primary)",
                        }
                      : {
                          color: "var(--color-text-secondary)",
                          borderColor: "transparent",
                        }
                  }
                  onMouseEnter={(e) => {
                    if (!isActive(link.href)) {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "var(--color-text-primary)";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href)) {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor =
                        "transparent";
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--color-text-secondary)";
                    }
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="md:hidden p-2"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            className="md:hidden pb-3 pt-2"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors"
                style={
                  isActive(link.href)
                    ? { color: "var(--color-text-primary)" }
                    : { color: "var(--color-text-secondary)" }
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
