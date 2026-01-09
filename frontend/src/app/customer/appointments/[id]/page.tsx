'use client'

import { MapPin, Calendar, Clock, Phone, AlertCircle, CheckCircle2, Edit2, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AppointmentDetailsPage({ params }: { params: { id: string } }) {
  const appointmentData = {
    id: params.id,
    service: 'Brake Pad Replacement',
    dealership: 'Bangalore EV Service Center',
    address: '123 Tech Park, Bangalore, Karnataka 560001',
    phone: '+91 80 4040 4040',
    date: 'December 18, 2024',
    time: '10:00 AM',
    status: 'confirmed',
    estimatedCost: '₹7,499',
    duration: '2-3 hours',
    technician: 'Rajesh Kumar',
    createdDate: 'November 29, 2024',
    notes: 'Please arrive 10 minutes early. Bring your vehicle keys and ID.',
  }

  const statusColors = {
    confirmed: 'badge-success',
    pending: 'badge-warning',
    completed: 'badge-info',
    cancelled: 'badge-danger',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark p-6 md:p-8">
      {/* Back Button */}
      <Link href="/customer/appointments" className="inline-flex items-center gap-2 text-electric-blue hover:text-electric-cyan transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Appointments
      </Link>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-light mb-2">{appointmentData.service}</h1>
            <p className="text-gray-400">Appointment ID: {appointmentData.id}</p>
          </div>
          <span className={`badge ${statusColors[appointmentData.status as keyof typeof statusColors]}`}>
            {appointmentData.status.charAt(0).toUpperCase() + appointmentData.status.slice(1)}
          </span>
        </div>

        {/* Status Timeline */}
        <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30 mb-8">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-neon-green" />
                <div>
                  <p className="font-semibold text-text-light">Appointment Confirmed</p>
                  <p className="text-sm text-gray-400">Booked on {appointmentData.createdDate}</p>
                </div>
              </div>
              <div className="h-12 w-1 bg-gradient-to-b from-neon-green to-electric-blue ml-3"></div>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-electric-blue" />
                <div>
                  <p className="font-semibold text-text-light">Scheduled for {appointmentData.date}</p>
                  <p className="text-sm text-gray-400">Awaiting service date</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Date & Time */}
          <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-electric-blue" />
              <h3 className="text-lg font-semibold text-text-light">Date & Time</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="text-lg font-semibold text-text-light">{appointmentData.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Time</p>
                <p className="text-lg font-semibold text-text-light">{appointmentData.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-lg font-semibold text-text-light">{appointmentData.duration}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-warning-yellow" />
              <h3 className="text-lg font-semibold text-text-light">Service Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">Service Type</p>
                <p className="text-lg font-semibold text-text-light">{appointmentData.service}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Estimated Cost</p>
                <p className="text-lg font-semibold text-neon-green">{appointmentData.estimatedCost}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Technician</p>
                <p className="text-lg font-semibold text-text-light">{appointmentData.technician}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Service Center Details */}
        <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-electric-blue" />
            <h3 className="text-lg font-semibold text-text-light">Service Center</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Center Name</p>
              <p className="text-lg font-semibold text-text-light">{appointmentData.dealership}</p>
            </div>

            <div>
              <p className="text-sm text-gray-400 mb-1">Address</p>
              <p className="text-text-light">{appointmentData.address}</p>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-electric-blue border-opacity-20">
              <Phone className="w-5 h-5 text-electric-blue" />
              <a href={`tel:${appointmentData.phone}`} className="text-electric-blue hover:text-electric-cyan transition-colors font-semibold">
                {appointmentData.phone}
              </a>
            </div>

            {/* Map Placeholder */}
            <div className="mt-6 h-48 bg-gradient-to-br from-electric-blue to-electric-cyan opacity-10 rounded-lg flex items-center justify-center border border-electric-blue border-opacity-20">
              <MapPin className="w-12 h-12 text-electric-blue opacity-50" />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30 mb-8">
          <h3 className="text-lg font-semibold text-text-light mb-4">Important Notes</h3>
          <div className="p-4 rounded-lg bg-gradient-to-r from-warning-yellow to-electric-cyan bg-opacity-10 border border-warning-yellow border-opacity-40">
            <p className="text-text-light">{appointmentData.notes}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
            <Edit2 className="w-5 h-5" />
            Reschedule
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-card-dark border border-warning-yellow text-warning-yellow font-semibold hover:bg-opacity-50 transition-all">
            <Trash2 className="w-5 h-5" />
            Cancel Appointment
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-10 border border-electric-blue border-opacity-40">
          <p className="text-text-light mb-4">
            <span className="font-semibold">Need help?</span> Contact our support team or visit the service center directly.
          </p>
          <Link href="/customer/support" className="text-electric-blue hover:text-electric-cyan transition-colors font-semibold">
            Go to Support →
          </Link>
        </div>
      </div>
    </div>
  )
}
