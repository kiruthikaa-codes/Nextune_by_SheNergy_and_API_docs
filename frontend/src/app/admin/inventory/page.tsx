'use client'

import { Plus, Edit2, Trash2, AlertTriangle } from 'lucide-react'

export default function AdminInventoryPage() {
  const inventory = [
    {
      id: 1,
      name: 'Brake Pads (Front)',
      sku: 'BP-FRONT-001',
      stock: 3,
      minStock: 10,
      price: '$89.99',
      vendor: 'Tesla Parts',
      status: 'critical',
    },
    {
      id: 2,
      name: 'Air Filter',
      sku: 'AF-001',
      stock: 12,
      minStock: 5,
      price: '$24.99',
      vendor: 'OEM Supplier',
      status: 'good',
    },
    {
      id: 3,
      name: 'Battery Module',
      sku: 'BM-001',
      stock: 1,
      minStock: 2,
      price: '$2,499.99',
      vendor: 'Tesla Energy',
      status: 'critical',
    },
    {
      id: 4,
      name: 'Suspension Kit',
      sku: 'SK-001',
      stock: 5,
      minStock: 3,
      price: '$599.99',
      vendor: 'Premium Parts',
      status: 'good',
    },
    {
      id: 5,
      name: 'Windshield Wipers',
      sku: 'WW-001',
      stock: 8,
      minStock: 5,
      price: '$34.99',
      vendor: 'Auto Accessories',
      status: 'good',
    },
  ]

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-light mb-2">Inventory Management</h1>
          <p className="text-gray-400">Track and manage parts inventory</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
          <Plus className="w-5 h-5" />
          Add Part
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card-dark p-6 rounded-xl border-l-4 border-electric-blue">
          <p className="text-sm text-gray-400 mb-2">Total Parts</p>
          <p className="text-3xl font-bold text-text-light">5</p>
        </div>
        <div className="glass-card-dark p-6 rounded-xl border-l-4 border-neon-green">
          <p className="text-sm text-gray-400 mb-2">In Stock</p>
          <p className="text-3xl font-bold text-neon-green">29 units</p>
        </div>
        <div className="glass-card-dark p-6 rounded-xl border-l-4 border-warning-yellow">
          <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Low Stock Alert
          </p>
          <p className="text-3xl font-bold text-warning-yellow">2</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <input
          type="text"
          placeholder="Search by part name or SKU..."
          className="flex-1 min-w-64 px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light placeholder-gray-500 focus:outline-none focus:border-opacity-100 transition-all"
        />
        <select className="px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all">
          <option>All Status</option>
          <option>Good</option>
          <option>Low</option>
          <option>Critical</option>
        </select>
      </div>

      {/* Inventory Table */}
      <div className="glass-card-dark rounded-xl overflow-hidden border border-electric-blue border-opacity-20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-electric-blue border-opacity-20 bg-card-dark bg-opacity-50">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Part Name</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">SKU</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Stock</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Price</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Vendor</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-electric-blue border-opacity-10 hover:bg-card-dark hover:bg-opacity-50 transition-all"
                >
                  <td className="py-4 px-6 text-text-light font-medium">{item.name}</td>
                  <td className="py-4 px-6 text-gray-400">{item.sku}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-text-light font-medium">{item.stock} units</p>
                      <p className="text-xs text-gray-400">Min: {item.minStock}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-light">{item.price}</td>
                  <td className="py-4 px-6 text-gray-400">{item.vendor}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`badge ${
                        item.status === 'good'
                          ? 'badge-success'
                          : item.status === 'low'
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue hover:bg-opacity-50 transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-card-dark border border-red-500 text-red-500 hover:bg-opacity-50 transition-all">
                        <Trash2 className="w-4 h-4" />
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
