'use client'

import { Home, Calendar, Package, FileText, Settings, LogOut, Menu, X, MessageCircle, BarChart3, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

interface NavigationProps {
  userType: 'customer' | 'admin'
}

export default function Navigation({ userType }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { setCustomer } = useAuth()

  const customerLinks = [
    { href: '/customer/home', label: 'Home', icon: Home },
    { href: '/customer/appointments', label: 'Appointments', icon: Calendar },
    { href: '/customer/history', label: 'History', icon: FileText },
    { href: '/customer/support', label: 'Support', icon: HelpCircle },
    { href: '/customer/settings', label: 'Settings', icon: Settings },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/inventory', label: 'Inventory', icon: Package },
    { href: '/admin/rfqs', label: 'RFQs', icon: FileText },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const links = userType === 'customer' ? customerLinks : adminLinks

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-2 rounded-lg bg-card-dark border border-electric-blue md:hidden"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-electric-blue" />
        ) : (
          <Menu className="w-6 h-6 text-electric-blue" />
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-card-dark md:border-r md:border-electric-blue md:border-opacity-20 md:flex md:flex-col md:z-40">
        <div className="p-6 border-b border-electric-blue border-opacity-20">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-cyan bg-clip-text text-transparent">
            Nextune
          </h1>
          <p className="text-xs text-gray-400 mt-1">{userType === 'customer' ? 'Customer Portal' : 'Admin Dashboard'}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow'
                    : 'text-gray-400 hover:text-text-light hover:bg-card-dark hover:bg-opacity-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-electric-blue border-opacity-20">
          <button
            onClick={() => {
              setCustomer(null)
              router.push('/')
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-400 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black bg-opacity-50">
          <div className="absolute left-0 top-0 h-screen w-64 bg-card-dark border-r border-electric-blue border-opacity-20 flex flex-col">
            <div className="p-6 border-b border-electric-blue border-opacity-20">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-electric-blue to-electric-cyan bg-clip-text text-transparent">
                Nextune
              </h1>
              <p className="text-xs text-gray-400 mt-1">{userType === 'customer' ? 'Customer Portal' : 'Admin Dashboard'}</p>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow'
                        : 'text-gray-400 hover:text-text-light hover:bg-card-dark hover:bg-opacity-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-4 border-t border-electric-blue border-opacity-20">
              <button
                onClick={() => {
                  setCustomer(null)
                  setIsOpen(false)
                  router.push('/')
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-400 hover:text-red-400 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
