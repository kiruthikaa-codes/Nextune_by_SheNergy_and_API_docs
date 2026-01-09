'use client'

import { CheckCircle2, QrCode, MapPin, Calendar, Clock, Phone, Download, Share2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function BookingConfirmationPage() {
  const appointmentData = {
    id: 'APT-7K9M2X5Q',
    service: 'Brake Pad Replacement',
    dealership: 'Bangalore EV Service Center',
    address: '123 Tech Park, Bangalore, Karnataka 560001',
    phone: '+91 80 4040 4040',
    date: 'December 18, 2024',
    time: '10:00 AM',
    estimatedCost: '₹7,499',
    duration: '2-3 hours',
    technician: 'Rajesh Kumar',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark p-6 md:p-8">
      {/* Back Button */}
      <Link href="/customer/appointments" className="inline-flex items-center gap-2 text-electric-blue hover:text-electric-cyan transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Appointments
      </Link>

      {/* Main Container */}
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-green to-electric-cyan rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-neon-green to-electric-cyan flex items-center justify-center shadow-glow">
                <CheckCircle2 className="w-12 h-12 text-primary-dark animate-bounce" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-text-light mb-3">Appointment Confirmed!</h1>
          <p className="text-gray-400 text-lg">Your service is booked and ready</p>
        </div>

        {/* Appointment Details Card */}
        <div className="glass-card-dark p-8 rounded-2xl border border-electric-blue border-opacity-30 mb-8">
          {/* Appointment ID */}
          <div className="mb-8 pb-8 border-b border-electric-blue border-opacity-20">
            <p className="text-gray-400 text-sm mb-2">Appointment ID</p>
            <p className="text-2xl font-bold text-electric-blue font-mono">{appointmentData.id}</p>
            <p className="text-xs text-gray-500 mt-2">Save this ID for your records</p>
          </div>

          {/* Service Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-electric-blue border-opacity-20">
            <div>
              <p className="text-gray-400 text-sm mb-2">Service</p>
              <p className="text-lg font-semibold text-text-light">{appointmentData.service}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Estimated Cost</p>
              <p className="text-lg font-semibold text-neon-green">{appointmentData.estimatedCost}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Duration</p>
              <p className="text-lg font-semibold text-text-light">{appointmentData.duration}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Assigned Technician</p>
              <p className="text-lg font-semibold text-text-light">{appointmentData.technician}</p>
            </div>
          </div>

          {/* Dealership Info */}
          <div className="mb-8 pb-8 border-b border-electric-blue border-opacity-20">
            <p className="text-gray-400 text-sm mb-4">Service Center</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-electric-blue flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-text-light">{appointmentData.dealership}</p>
                  <p className="text-sm text-gray-400">{appointmentData.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-electric-blue flex-shrink-0" />
                <a href={`tel:${appointmentData.phone}`} className="text-electric-blue hover:text-electric-cyan transition-colors">
                  {appointmentData.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-10 border border-electric-blue border-opacity-30">
              <Calendar className="w-6 h-6 text-electric-blue flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="font-semibold text-text-light">{appointmentData.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-10 border border-electric-blue border-opacity-30">
              <Clock className="w-6 h-6 text-electric-blue flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-400">Time</p>
                <p className="font-semibold text-text-light">{appointmentData.time}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="glass-card-dark p-8 rounded-2xl border border-neon-green border-opacity-30 mb-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">Check-in QR Code</p>
            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 bg-gradient-to-br from-card-dark to-primary-dark rounded-lg border-2 border-neon-green border-opacity-40 flex items-center justify-center">
                <QrCode className="w-24 h-24 text-neon-green opacity-50" />
              </div>
            </div>
            <p className="text-sm text-gray-400">Show this QR code at the service center for check-in</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
            <Download className="w-5 h-5" />
            Download Receipt
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold hover:bg-opacity-50 transition-all">
            <Share2 className="w-5 h-5" />
            Share
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold hover:bg-opacity-50 transition-all">
            📅 Add to Calendar
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 rounded-lg bg-gradient-to-r from-warning-yellow to-electric-cyan bg-opacity-10 border border-warning-yellow border-opacity-40">
          <p className="text-sm text-text-light">
            <span className="font-semibold">💡 Tip:</span> Arrive 10 minutes early. You'll receive an SMS reminder 24 hours before your appointment.
          </p>
        </div>
      </div>
    </div>
  )
}
