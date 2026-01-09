import Navigation from '@/components/Navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark">
      <Navigation userType="admin" />
      <main className="flex-1 md:ml-64 w-full">
        {children}
      </main>
    </div>
  )
}
