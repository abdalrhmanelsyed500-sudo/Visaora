"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS, SITE_NAME } from "@/lib/constants";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="site-skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="header-inner">
        <Link className="brand" href="/" aria-label={`${SITE_NAME} home`} onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            <CompassMark />
          </span>
          <span>{SITE_NAME}</span>
        </Link>

        <nav className="main-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="header-search-button" href="/search" aria-label="Search Visaora">
            <Search size={15} aria-hidden="true" />
            <span>Search</span>
            <kbd aria-hidden="true">⌘ K</kbd>
          </Link>
          <button
            className="mobile-menu-button"
            type="button"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/search" onClick={() => setOpen(false)}>
            Search the directory
          </Link>
        </nav>
      ) : null}
    </header>
  );
}

function CompassMark() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" opacity=".42" />
      <path d="m15.7 8.3-2.2 5.2-5.2 2.2 2.2-5.2 5.2-2.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
