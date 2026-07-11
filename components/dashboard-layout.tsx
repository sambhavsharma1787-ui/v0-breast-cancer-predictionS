'use client'

import React, { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, History, Settings, BarChart3, LogOut, FileText, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/new-prediction', label: 'New Prediction', icon: Zap },
    { href: '/history', label: 'History', icon: History },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/reports', label: 'Reports', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 flex flex-col border-r border-slate-800`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen && <span className="text-xl font-bold">BreastCare</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === href
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
              </button>
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <LogOut size={18} />
            {sidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Breast Cancer Risk Assessment</h1>
          <div className="text-sm text-slate-600">Welcome back</div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-slate-50 p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
