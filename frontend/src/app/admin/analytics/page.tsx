'use client'

import { TrendingUp, Users, Zap, DollarSign, Calendar, AlertCircle, Star } from 'lucide-react'

export default function AdminAnalyticsPage() {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,000',
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-neon-green to-electric-cyan',
    },
    {
      title: 'Total Appointments',
      value: '156',
      change: '+8.2%',
      icon: Calendar,
      color: 'from-electric-blue to-electric-cyan',
    },
    {
      title: 'Active Customers',
      value: '892',
      change: '+5.1%',
      icon: Users,
      color: 'from-warning-yellow to-electric-cyan',
    },
    {
      title: 'Avg Rating',
      value: '4.7/5',
      change: '+0.3',
      icon: Star,
      color: 'from-neon-green to-warning-yellow',
    },
  ]

  const topServices = [
    { name: 'Brake Pad Replacement', count: 45, revenue: '₹3,37,455' },
    { name: 'Battery Health Check', count: 38, revenue: '₹0' },
    { name: 'Air Filter Replacement', count: 32, revenue: '₹63,968' },
    { name: 'Oil Change', count: 28, revenue: '₹1,39,720' },
    { name: 'Tire Rotation', count: 13, revenue: '₹1,03,987' },
  ]

  const dealershipPerformance = [
    {
      name: 'Bangalore EV Service Center',
      appointments: 45,
      revenue: '₹3,37,455',
      rating: 4.8,
      satisfaction: '98%',
    },
    {
      name: 'Whitefield Tata Service',
      appointments: 32,
      revenue: '₹2,39,968',
      rating: 4.5,
      satisfaction: '94%',
    },
    {
      name: 'Koramangala Auto Care',
      appointments: 28,
      revenue: '₹2,09,720',
      rating: 4.6,
      satisfaction: '96%',
    },
    {
      name: 'Indiranagar Service Hub',
      appointments: 18,
      revenue: '₹1,34,857',
      rating: 4.3,
      satisfaction: '91%',
    },
    {
      name: 'Jayanagar Service Point',
      appointments: 33,
      revenue: '₹2,47,000',
      rating: 4.4,
      satisfaction: '93%',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Analytics & Reports</h1>
        <p className="text-gray-400">Track performance and insights across your platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-glow`}>
                  <Icon className="w-6 h-6 text-primary-dark" />
                </div>
                <span className="text-neon-green text-sm font-semibold">{stat.change}</span>
              </div>
              <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-text-light">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Top Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-electric-blue" />
            <h2 className="text-xl font-bold text-text-light">Top Services</h2>
          </div>

          <div className="space-y-4">
            {topServices.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-card-dark to-primary-dark border border-electric-blue border-opacity-20">
                <div className="flex-1">
                  <p className="font-semibold text-text-light">{service.name}</p>
                  <p className="text-sm text-gray-400">{service.count} bookings</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neon-green">{service.revenue}</p>
                  <p className="text-xs text-gray-400">{service.count} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-electric-blue" />
            <h2 className="text-xl font-bold text-text-light">Key Metrics</h2>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400">Booking Completion Rate</p>
                <span className="text-neon-green font-semibold">94%</span>
              </div>
              <div className="w-full h-2 bg-card-dark rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-gradient-to-r from-neon-green to-electric-cyan"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400">Customer Satisfaction</p>
                <span className="text-neon-green font-semibold">95%</span>
              </div>
              <div className="w-full h-2 bg-card-dark rounded-full overflow-hidden">
                <div className="h-full w-[95%] bg-gradient-to-r from-neon-green to-electric-cyan"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400">Dealership Utilization</p>
                <span className="text-neon-green font-semibold">87%</span>
              </div>
              <div className="w-full h-2 bg-card-dark rounded-full overflow-hidden">
                <div className="h-full w-[87%] bg-gradient-to-r from-neon-green to-electric-cyan"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-400">On-time Completion</p>
                <span className="text-neon-green font-semibold">92%</span>
              </div>
              <div className="w-full h-2 bg-card-dark rounded-full overflow-hidden">
                <div className="h-full w-[92%] bg-gradient-to-r from-neon-green to-electric-cyan"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dealership Performance */}
      <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30">
        <h2 className="text-xl font-bold text-text-light mb-6">Dealership Performance</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-electric-blue border-opacity-20">
                <th className="text-left py-3 px-4 text-gray-400 font-semibold">Service Center</th>
                <th className="text-center py-3 px-4 text-gray-400 font-semibold">Appointments</th>
                <th className="text-right py-3 px-4 text-gray-400 font-semibold">Revenue</th>
                <th className="text-center py-3 px-4 text-gray-400 font-semibold">Rating</th>
                <th className="text-center py-3 px-4 text-gray-400 font-semibold">Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {dealershipPerformance.map((dealership, i) => (
                <tr key={i} className="border-b border-electric-blue border-opacity-10 hover:bg-card-dark transition-colors">
                  <td className="py-4 px-4 text-text-light font-semibold">{dealership.name}</td>
                  <td className="py-4 px-4 text-center text-electric-blue">{dealership.appointments}</td>
                  <td className="py-4 px-4 text-right text-neon-green font-semibold">{dealership.revenue}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-warning-yellow to-electric-cyan bg-opacity-20 border border-warning-yellow border-opacity-40">
                      <Star className="w-4 h-4 text-warning-yellow fill-warning-yellow" />
                      <span className="text-text-light font-semibold">{dealership.rating}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center text-neon-green font-semibold">{dealership.satisfaction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-warning-yellow to-electric-cyan bg-opacity-10 border border-warning-yellow border-opacity-40">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-warning-yellow flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-text-light mb-2">Performance Alert</h3>
            <p className="text-gray-300 text-sm">
              Indiranagar Service Hub has lower satisfaction rate (91%). Consider reaching out to improve service quality.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
