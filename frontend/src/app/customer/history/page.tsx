'use client'

import { Download, Eye, Calendar, DollarSign, CheckCircle } from 'lucide-react'

export default function CustomerHistoryPage() {
  const history = [
    {
      id: 1,
      date: 'Nov 20, 2024',
      service: 'Regular Maintenance',
      dealership: 'Bangalore EV Service Center',
      cost: '₹12,500',
      status: 'completed',
      invoice: 'INV-2024-001',
    },
    {
      id: 2,
      date: 'Oct 15, 2024',
      service: 'Brake Pad Replacement',
      dealership: 'Whitefield Tata Service',
      cost: '₹7,499',
      status: 'completed',
      invoice: 'INV-2024-002',
    },
    {
      id: 3,
      date: 'Sep 10, 2024',
      service: 'Battery Health Check',
      dealership: 'Bangalore EV Service Center',
      cost: '₹0',
      status: 'completed',
      invoice: 'INV-2024-003',
    },
    {
      id: 4,
      date: 'Aug 5, 2024',
      service: 'Air Filter Replacement',
      dealership: 'Koramangala Auto Care',
      cost: '₹1,999',
      status: 'completed',
      invoice: 'INV-2024-004',
    },
  ]

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Service History</h1>
        <p className="text-gray-400">View all past service records and invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card-dark p-6 rounded-xl border-l-4 border-electric-blue">
          <p className="text-sm text-gray-400 mb-2">Total Services</p>
          <p className="text-3xl font-bold text-text-light">12</p>
        </div>
        <div className="glass-card-dark p-6 rounded-xl border-l-4 border-neon-green">
          <p className="text-sm text-gray-400 mb-2">Total Spent</p>
          <p className="text-3xl font-bold text-neon-green">₹21,998</p>
        </div>
        <div className="glass-card-dark p-6 rounded-xl border-l-4 border-warning-yellow">
          <p className="text-sm text-gray-400 mb-2">Last Service</p>
          <p className="text-3xl font-bold text-warning-yellow">20 days ago</p>
        </div>
      </div>

      {/* Filter and Export */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <input
          type="text"
          placeholder="Search by service or invoice..."
          className="flex-1 min-w-64 px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light placeholder-gray-500 focus:outline-none focus:border-opacity-100 transition-all"
        />
        <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold hover:scale-105 transition-transform flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* History Table */}
      <div className="glass-card-dark rounded-xl overflow-hidden border border-electric-blue border-opacity-20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-electric-blue border-opacity-20 bg-card-dark bg-opacity-50">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Date</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Service</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Dealership</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Cost</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-electric-blue border-opacity-10 hover:bg-card-dark hover:bg-opacity-50 transition-all"
                >
                  <td className="py-4 px-6 text-text-light">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      {item.date}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-light">{item.service}</td>
                  <td className="py-4 px-6 text-gray-400">{item.dealership}</td>
                  <td className="py-4 px-6 text-text-light">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-electric-blue" />
                      {item.cost}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="badge badge-success flex items-center gap-1 w-fit">
                      <CheckCircle className="w-3 h-3" />
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue hover:bg-opacity-50 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-card-dark border border-neon-green text-neon-green hover:bg-opacity-50 transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
