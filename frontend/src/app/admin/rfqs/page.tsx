'use client'

import { Plus, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminRFQsPage() {
  const rfqs = [
    {
      id: 1,
      rfqNumber: 'RFQ-2024-001',
      parts: ['Brake Pads (Front)', 'Brake Pads (Rear)'],
      vendor: 'Tesla Parts',
      date: 'Dec 10, 2024',
      dueDate: 'Dec 15, 2024',
      status: 'pending',
      quantity: 5,
    },
    {
      id: 2,
      rfqNumber: 'RFQ-2024-002',
      parts: ['Battery Module'],
      vendor: 'Tesla Energy',
      date: 'Dec 8, 2024',
      dueDate: 'Dec 20, 2024',
      status: 'responded',
      quantity: 1,
    },
    {
      id: 3,
      rfqNumber: 'RFQ-2024-003',
      parts: ['Air Filter', 'Cabin Filter'],
      vendor: 'OEM Supplier',
      date: 'Dec 5, 2024',
      dueDate: 'Dec 12, 2024',
      status: 'completed',
      quantity: 10,
    },
  ]

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-light mb-2">Request for Quotation (RFQ)</h1>
          <p className="text-gray-400">Manage vendor quotation requests</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
          <Plus className="w-5 h-5" />
          Create RFQ
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card-dark p-6 rounded-xl border-l-4 border-warning-yellow">
          <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pending
          </p>
          <p className="text-3xl font-bold text-warning-yellow">1</p>
        </div>
        <div className="glass-card-dark p-6 rounded-xl border-l-4 border-electric-blue">
          <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Responded
          </p>
          <p className="text-3xl font-bold text-electric-blue">1</p>
        </div>
        <div className="glass-card-dark p-6 rounded-xl border-l-4 border-neon-green">
          <p className="text-sm text-gray-400 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Completed
          </p>
          <p className="text-3xl font-bold text-neon-green">1</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <input
          type="text"
          placeholder="Search by RFQ number or vendor..."
          className="flex-1 min-w-64 px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light placeholder-gray-500 focus:outline-none focus:border-opacity-100 transition-all"
        />
        <select className="px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all">
          <option>All Status</option>
          <option>Pending</option>
          <option>Responded</option>
          <option>Completed</option>
        </select>
      </div>

      {/* RFQs List */}
      <div className="space-y-4">
        {rfqs.map((rfq) => (
          <div
            key={rfq.id}
            className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-light mb-1">{rfq.rfqNumber}</h3>
                    <p className="text-sm text-gray-400 mb-2">Vendor: {rfq.vendor}</p>
                    <div className="space-y-1">
                      {rfq.parts.map((part, i) => (
                        <p key={i} className="text-sm text-gray-400">
                          • {part}
                        </p>
                      ))}
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      rfq.status === 'pending'
                        ? 'badge-warning'
                        : rfq.status === 'responded'
                        ? 'badge-info'
                        : 'badge-success'
                    }`}
                  >
                    {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Right Side */}
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Created</p>
                    <p className="text-sm text-text-light">{rfq.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Due Date</p>
                    <p className="text-sm text-text-light">{rfq.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Quantity</p>
                    <p className="text-sm text-text-light">{rfq.quantity} units</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold hover:bg-opacity-50 transition-all">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
