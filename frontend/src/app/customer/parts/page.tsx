'use client'

import { Package, ShoppingCart, Zap } from 'lucide-react'

export default function CustomerPartsPage() {
  const parts = [
    {
      id: 1,
      name: 'Brake Pads (Front)',
      category: 'Brakes',
      price: '₹7,499',
      availability: 'In Stock',
      status: 'recommended',
      description: 'OEM Tata brake pads for front axle',
    },
    {
      id: 2,
      name: 'Air Filter',
      category: 'Filters',
      price: '₹1,999',
      availability: 'In Stock',
      status: 'available',
      description: 'Cabin air filter replacement',
    },
    {
      id: 3,
      name: 'Battery Module',
      category: 'Battery',
      price: '₹1,99,999',
      availability: 'Order Only',
      status: 'premium',
      description: 'Tata battery module replacement',
    },
    {
      id: 4,
      name: 'Suspension Kit',
      category: 'Suspension',
      price: '₹49,999',
      availability: 'In Stock',
      status: 'available',
      description: 'Complete suspension upgrade kit',
    },
  ]

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Parts & Accessories</h1>
        <p className="text-gray-400">Browse and order genuine parts for your vehicle</p>
      </div>

      {/* Filter and Search */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <input
          type="text"
          placeholder="Search parts..."
          className="flex-1 min-w-64 px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light placeholder-gray-500 focus:outline-none focus:border-opacity-100 transition-all"
        />
        <button className="px-6 py-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold hover:bg-opacity-50 transition-all">
          Filter
        </button>
      </div>

      {/* Parts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parts.map((part) => (
          <div
            key={part.id}
            className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all hover:shadow-glow"
          >
            {/* Part Icon */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-dark" />
              </div>
              <span
                className={`badge ${
                  part.status === 'recommended'
                    ? 'badge-success'
                    : part.status === 'premium'
                    ? 'badge-danger'
                    : 'badge-info'
                }`}
              >
                {part.status.charAt(0).toUpperCase() + part.status.slice(1)}
              </span>
            </div>

            {/* Part Details */}
            <h3 className="text-lg font-bold text-text-light mb-1">{part.name}</h3>
            <p className="text-sm text-gray-400 mb-2">{part.category}</p>
            <p className="text-sm text-gray-500 mb-4">{part.description}</p>

            {/* Availability */}
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-electric-blue" />
              <span className="text-sm text-gray-400">{part.availability}</span>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-electric-blue">{part.price}</span>
              <button className="p-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark hover:scale-110 transition-transform">
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
