'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import NextuneAssist from '@/components/SheNergyAssistV3'
import { AuthProvider, useAuth } from '@/context/AuthContext'

function InnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/'
  const { customer } = useAuth()

  const primaryVehicle = useMemo(
    () => (customer as any)?.vehicles?.[0] as { vin: string } | undefined,
    [customer]
  )

  return (
    <>
      {children}
      {!isLoginPage && (
        <NextuneAssist
          customerId={customer?.customer_id}
          vin={primaryVehicle?.vin}
        />
      )}
    </>
  )
}

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  )
}
