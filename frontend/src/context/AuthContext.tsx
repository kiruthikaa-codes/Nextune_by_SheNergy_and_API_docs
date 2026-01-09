'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface Customer {
  customer_id: string
  name: string
  email: string
  phone: string
  username: string
}

interface AuthContextValue {
  customer: Customer | null
  setCustomer: (customer: Customer | null) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'shen_auth_customer'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomerState] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null
      if (stored) {
        setCustomerState(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false)
    }
  }, [])

  const setCustomer = (value: Customer | null) => {
    setCustomerState(value)
    try {
      if (typeof window === 'undefined') return
      if (value) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore storage errors
    }
  }

  return (
    <AuthContext.Provider value={{ customer, setCustomer, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
