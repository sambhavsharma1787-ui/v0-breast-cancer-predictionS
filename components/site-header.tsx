"use client"

import { useState } from "react"
import { Heart, Menu, X } from "lucide-react"

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Symptoms", href: "#symptoms" },
  { label: "Prediction", href: "#prediction" },
  { label: "Prevention", href: "#prevention" },
]

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-white/95 backdrop-blur-lg shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="#" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
            <Heart className="h-5 w-5 fill-primary text-primary" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            BreastCare
          </span>
        </a>

        <nav className="hidden items-center gap-10 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted-foreground transition-all hover:text-primary relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-border/50 bg-white/50 px-6 py-4 md:hidden backdrop-blur-sm" aria-label="Mobile navigation">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
