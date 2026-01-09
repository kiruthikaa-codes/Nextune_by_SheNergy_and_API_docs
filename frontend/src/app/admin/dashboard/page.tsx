'use client'

import { Calendar, Package, FileText, Wrench, TrendingUp, AlertCircle } from 'lucide-react'

export default function AdminDashboardPage() {
  const stats = [
    {
      title: 'Upcoming Appointments',
      value: '12',
      icon: Calendar,
      color: 'from-electric-blue to-electric-cyan',
      trend: '+3 this week',
    },
    {
      title: 'Pending RFQs',
      value: '8',
      icon: FileText,
      color: 'from-warning-yellow to-orange-500',
      trend: '+2 today',
    },
    {
      title: 'Parts Low in Stock',
      value: '5',
      icon: Package,
      color: 'from-red-500 to-red-600',
      trend: 'Urgent',
    },
    {
      title: "Today's Services",
      value: '6',
      icon: Wrench,
      color: 'from-neon-green to-electric-cyan',
      trend: '2 completed',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card-dark bg-opacity-80 backdrop-blur-md border-b border-electric-blue border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-light">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Bangalore EV Service Center</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-electric-blue border-opacity-20 bg-card-dark bg-opacity-50 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {['Dashboard', 'Appointments', 'Parts', 'RFQs', 'Technicians'].map((tab) => (
              <button
                key={tab}
                className={`py-4 px-2 border-b-2 font-medium transition-all ${
                  tab === 'Dashboard'
                    ? 'border-electric-blue text-electric-blue'
                    : 'border-transparent text-gray-400 hover:text-text-light'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.title}
                className="glass-card-dark p-6 rounded-xl border-l-4 border-electric-blue hover:shadow-glow transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-glow`}>
                    <Icon className="w-6 h-6 text-primary-dark" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-neon-green" />
                </div>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-text-light mb-2">{stat.value}</p>
                <p className="text-xs text-electric-blue">{stat.trend}</p>
              </div>
            )
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Upcoming Appointments */}
          <div className="lg:col-span-2 glass-card-dark p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-light">Upcoming Appointments</h2>
              <button className="text-electric-blue hover:text-electric-cyan text-sm font-medium transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-card-dark rounded-lg border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary-dark" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-text-light">2024 Tata Nexon EV</p>
                      <p className="text-sm text-gray-400">Priya Sharma • 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="badge badge-success">Ready</span>
                    <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark text-sm font-semibold hover:scale-105 transition-transform">
                      Check In
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card-dark p-6 rounded-2xl">
            <h2 className="text-xl font-bold text-text-light mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
                New Appointment
              </button>
              <button className="w-full py-3 px-4 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold hover:bg-opacity-50 transition-all">
                Check Inventory
              </button>
              <button className="w-full py-3 px-4 rounded-lg bg-card-dark border border-neon-green text-neon-green font-semibold hover:bg-opacity-50 transition-all">
                Create RFQ
              </button>
              <button className="w-full py-3 px-4 rounded-lg bg-card-dark border border-warning-yellow text-warning-yellow font-semibold hover:bg-opacity-50 transition-all">
                Assign Technician
              </button>
            </div>
          </div>
        </div>

        {/* Parts Inventory */}
        <div className="glass-card-dark p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-light">Parts Inventory Status</h2>
            <button className="text-electric-blue hover:text-electric-cyan text-sm font-medium transition-colors">
              Manage Inventory
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-electric-blue border-opacity-20">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Part Name</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Vendor</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Brake Pads', stock: 3, status: 'Low', vendor: 'Tata Parts India' },
                  { name: 'Air Filter', stock: 12, status: 'Good', vendor: 'OEM Supplier' },
                  { name: 'Battery Module', stock: 1, status: 'Critical', vendor: 'Tata Energy' },
                  { name: 'Suspension Kit', stock: 5, status: 'Good', vendor: 'Premium Auto Parts' },
                ].map((part, i) => (
                  <tr key={i} className="border-b border-electric-blue border-opacity-10 hover:bg-card-dark hover:bg-opacity-50 transition-all">
                    <td className="py-3 px-4 text-text-light">{part.name}</td>
                    <td className="py-3 px-4 text-text-light">{part.stock} units</td>
                    <td className="py-3 px-4">
                      <span
                        className={`badge ${
                          part.status === 'Good'
                            ? 'badge-success'
                            : part.status === 'Low'
                            ? 'badge-warning'
                            : 'badge-danger'
                        }`}
                      >
                        {part.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{part.vendor}</td>
                    <td className="py-3 px-4">
                      <button className="text-electric-blue hover:text-electric-cyan font-medium transition-colors">
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="glass-card-dark p-6 rounded-2xl">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 text-warning-yellow" />
            <h2 className="text-xl font-bold text-text-light">System Alerts</h2>
          </div>

          <div className="space-y-3">
            {[
              { message: 'Brake pads stock running low - 3 units remaining', severity: 'warning' },
              { message: 'Battery module critical - only 1 unit in stock', severity: 'danger' },
              { message: 'RFQ #2024-001 awaiting vendor response', severity: 'info' },
            ].map((alert, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'danger'
                    ? 'bg-red-500 bg-opacity-10 border-red-500'
                    : alert.severity === 'warning'
                    ? 'bg-warning-yellow bg-opacity-10 border-warning-yellow'
                    : 'bg-electric-blue bg-opacity-10 border-electric-blue'
                }`}
              >
                <p
                  className={`text-sm ${
                    alert.severity === 'danger'
                      ? 'text-red-400'
                      : alert.severity === 'warning'
                      ? 'text-warning-yellow'
                      : 'text-electric-blue'
                  }`}
                >
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
