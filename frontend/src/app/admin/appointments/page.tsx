'use client'

import { Calendar, Phone, Plus } from 'lucide-react'

export default function AdminAppointmentsPage() {
  const appointments = [
    {
      id: 1,
      customer: 'Priya Sharma',
      vehicle: '2024 Tata Nexon EV',
      date: 'Dec 18, 2024',
      time: '10:00 AM',
      service: 'Regular Maintenance',
      status: 'confirmed',
      phone: '+91 98765 43210',
    },
    {
      id: 2,
      customer: 'Rajesh Kumar',
      vehicle: '2023 MG ZS EV',
      date: 'Dec 18, 2024',
      time: '2:30 PM',
      service: 'Brake Pad Replacement',
      status: 'pending',
      phone: '+91 99876 54321',
    },
    {
      id: 3,
      customer: 'Anjali Patel',
      vehicle: '2024 Hyundai Kona Electric',
      date: 'Dec 19, 2024',
      time: '9:30 AM',
      service: 'Battery Health Check',
      status: 'confirmed',
      phone: '+91 98765 12345',
    },
  ]

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-light mb-2">Appointments</h1>
          <p className="text-gray-400">Manage customer service appointments</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
          <Plus className="w-5 h-5" />
          New Appointment
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 mb-8 flex-wrap">
        <input
          type="text"
          placeholder="Search customer or vehicle..."
          className="flex-1 min-w-64 px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light placeholder-gray-500 focus:outline-none focus:border-opacity-100 transition-all"
        />
        <select className="px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all">
          <option>All Status</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Appointments Table */}
      <div className="glass-card-dark rounded-xl overflow-hidden border border-electric-blue border-opacity-20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-electric-blue border-opacity-20 bg-card-dark bg-opacity-50">
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Customer</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Vehicle</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Date & Time</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Service</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Status</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b border-electric-blue border-opacity-10 hover:bg-card-dark hover:bg-opacity-50 transition-all"
                >
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-text-light font-medium">{appointment.customer}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Phone className="w-3 h-3" />
                        {appointment.phone}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-light">{appointment.vehicle}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-text-light">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p>{appointment.date}</p>
                        <p className="text-xs text-gray-400">{appointment.time}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-text-light">{appointment.service}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`badge ${
                        appointment.status === 'confirmed' ? 'badge-success' : 'badge-warning'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark text-xs font-semibold hover:scale-105 transition-transform">
                        Check In
                      </button>
                      <button className="px-3 py-1 rounded-lg bg-card-dark border border-electric-blue text-electric-blue text-xs font-semibold hover:bg-opacity-50 transition-all">
                        Edit
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
