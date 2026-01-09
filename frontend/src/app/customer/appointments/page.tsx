'use client'

import { Calendar, MapPin, Clock, Phone, AlertCircle, Star } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/services/api'

interface RankedDealershipFromChat {
  dealership_id: string
  name: string
  score: number
  reason: string
}

interface DealershipCardModel {
  id: string
  name: string
  ratingText?: string
  score?: number
  reason?: string
}

interface SelectedServiceFromChat {
  service_code: string
  name: string
  estimatedCost?: string
}

export default function CustomerAppointmentsPage() {
  const { customer } = useAuth()
  const primaryVehicle = useMemo(() => customer?.vehicles?.[0], [customer]) as
    | { vin: string; model: string; year: number }
    | undefined

  const searchParams = useSearchParams()
  const showDealerships = searchParams.get('filter') === 'dealerships'
  const source = searchParams.get('source')
  const [selectedDealership, setSelectedDealership] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed'>('all')
  const [dealerships, setDealerships] = useState<DealershipCardModel[]>([])
  const [selectedServices, setSelectedServices] = useState<SelectedServiceFromChat[]>([])
  const [chatSummary, setChatSummary] = useState<string | null>(null)
  const [pickupRequired, setPickupRequired] = useState<boolean | null>(null)
  const [pickupAddress, setPickupAddress] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [bookingBusy, setBookingBusy] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [bookingSuccess, setBookingSuccess] = useState<{
    dealershipName: string
    datetime: string
    services: SelectedServiceFromChat[]
  } | null>(null)

  // Load ranked dealerships + selected services + chat summary from sessionStorage when coming from chat.
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (source === 'chat' || showDealerships) {
      try {
        const rawRankings = window.sessionStorage.getItem('senergy_last_rankings')
        if (rawRankings) {
          const parsed = JSON.parse(rawRankings) as { rankings: RankedDealershipFromChat[] }
          if (Array.isArray(parsed.rankings) && parsed.rankings.length > 0) {
            const mapped: DealershipCardModel[] = parsed.rankings.map((r) => ({
              id: r.dealership_id,
              name: r.name,
              score: r.score,
              reason: r.reason,
              ratingText: undefined,
            }))
            setDealerships(mapped)
          }
        }

        const rawServices = window.sessionStorage.getItem('senergy_selected_services')
        if (rawServices) {
          const parsedServices = JSON.parse(rawServices) as SelectedServiceFromChat[]
          if (Array.isArray(parsedServices)) {
            setSelectedServices(parsedServices)
          }
        }

        const summary = window.sessionStorage.getItem('senergy_chat_summary')
        if (summary) {
          setChatSummary(summary)
        }
      } catch (e) {
        // ignore and fall back
      }
    }

    if (dealerships.length === 0) {
      // Static fallback list if no chat rankings are available
      setDealerships([
        {
          id: '1',
          name: 'Bangalore EV Service Center',
          ratingText: 'Rating 4.8 / 5',
          reason: 'Low current load based on appointments data',
        },
        {
          id: '2',
          name: 'Whitefield Tata Service',
          ratingText: 'Rating 4.5 / 5',
          reason: 'Typical delay around 90 minutes',
        },
        {
          id: '3',
          name: 'Koramangala Auto Care',
          ratingText: 'Rating 4.6 / 5',
          reason: 'Good specialization match for your requested services',
        },
      ])
    }
  }, [source, showDealerships, dealerships.length])

  const timeSlots = useMemo(() => {
    const slots: { label: string; iso: string }[] = []
    const now = new Date()
    for (let d = 0; d < 3; d++) {
      const base = new Date(now)
      base.setDate(now.getDate() + d)
      const hours = [10, 12, 15, 17]
      for (const h of hours) {
        const slot = new Date(base)
        slot.setHours(h, 0, 0, 0)
        slots.push({
          label: slot.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          iso: slot.toISOString(),
        })
      }
    }
    return slots
  }, [])

  const totalEstimatedCost = useMemo(() => {
    let sum = 0
    for (const s of selectedServices) {
      if (s.estimatedCost) {
        const numeric = Number(String(s.estimatedCost).replace(/[^0-9]/g, ''))
        if (!Number.isNaN(numeric)) sum += numeric
      }
    }
    return sum
  }, [selectedServices])

  // If the chat summary clearly mentions AC / cooling issues but there is
  // no AC-specific service in the selected list, append a basic AC check so
  // that the mechanic sees something planned for inspection.
  const effectiveServicesForBooking: SelectedServiceFromChat[] = useMemo(() => {
    const hasAcService = selectedServices.some((s) => s.service_code === 'AC_CHECK')
    const hasWiperService = selectedServices.some((s) => s.service_code === 'WIPER_CHECK')

    const text = (chatSummary || '').toLowerCase()
    const mentionsAc = text.match(/(\bac\b|a\/c|air conditioning|aircon|no air|no cooling)/)
    const mentionsWiper = text.match(/(wiper|wipers|windshield|windsheild)/)

    let augmented = [...selectedServices]

    if (!hasAcService && mentionsAc) {
      augmented = [
        ...augmented,
        {
          service_code: 'AC_CHECK',
          name: 'AC Cooling & Leak Check',
          estimatedCost: '₹1,499',
        },
      ]
    }

    if (!hasWiperService && mentionsWiper) {
      augmented = [
        ...augmented,
        {
          service_code: 'WIPER_CHECK',
          name: 'Windshield Wiper Inspection & Motor Check',
          estimatedCost: '₹799',
        },
      ]
    }

    return augmented
  }, [selectedServices, chatSummary])

  const handleConfirmBooking = async () => {
    if (
      !customer ||
      !primaryVehicle ||
      !selectedDealership ||
      !selectedSlot ||
      effectiveServicesForBooking.length === 0
    ) {
      setBookingError('Missing required information to book the appointment.')
      return
    }

    setBookingBusy(true)
    setBookingError(null)
    try {
      const serviceCodes = effectiveServicesForBooking.map((s) => s.service_code)

      const inventory_needed = serviceCodes.map((code) => {
        if (code.startsWith('PERIODIC')) return 'Engine Oil 5W30'
        if (code.startsWith('BRAKE')) return 'Brake Pads Front'
        if (code.startsWith('CLUTCH')) return 'Clutch Plate Assembly'
        return 'Engine Oil 5W30'
      })

      await api.bookAppointment({
        customer_id: customer.customer_id,
        vin: primaryVehicle.vin,
        dealership_id: selectedDealership,
        service_codes_requested: serviceCodes,
        requested_datetime: selectedSlot,
        inventory_needed,
        inventory_ok: true,
        estimated_delay_minutes: 0,
        pickup_drop_required: pickupRequired ?? false,
        pickup_address: pickupRequired ? pickupAddress : undefined,
        user_issue_summary: chatSummary || undefined,
      })

      const bookedDealer = dealerships.find((d) => d.id === selectedDealership)
      setBookingSuccess({
        dealershipName: bookedDealer?.name || 'Selected dealership',
        datetime: selectedSlot,
        services: effectiveServicesForBooking,
      })
    } catch (err: any) {
      setBookingError(err?.message || 'Failed to book appointment')
    } finally {
      setBookingBusy(false)
    }
  }

  const appointments = [
    {
      id: 1,
      date: 'Dec 18, 2024',
      time: '10:00 AM',
      dealership: 'Bangalore EV Service Center',
      service: 'Regular Maintenance',
      status: 'confirmed',
      phone: '+91 80 4040 4040',
    },
    {
      id: 2,
      date: 'Dec 25, 2024',
      time: '2:30 PM',
      dealership: 'Whitefield Tata Service',
      service: 'Brake Pad Replacement',
      status: 'pending',
      phone: '+91 80 2345 6789',
    },
    {
      id: 3,
      date: 'Jan 8, 2025',
      time: '9:30 AM',
      dealership: 'Bangalore EV Service Center',
      service: 'Battery Health Check',
      status: 'confirmed',
      phone: '+91 80 4040 4040',
    },
  ]

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">My Appointments</h1>
        <p className="text-gray-400">Manage and track your service appointments</p>
      </div>

      {/* Show Dealerships if Filter Active */}
      {showDealerships && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text-light mb-1">Available Service Centers</h2>
              <p className="text-gray-400">
                {source === 'chat'
                  ? 'These options are ranked based on expertise, wait times, and satisfaction.'
                  : 'Browse and select your preferred dealership'}
              </p>
            </div>
            {source === 'chat' && <span className="badge badge-success">Ranked from chat</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dealerships.map((dealership) => (
              <div
                key={dealership.id}
                onClick={() => setSelectedDealership(dealership.id)}
                className={`glass-card-dark p-6 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedDealership === dealership.id
                    ? 'border-electric-blue shadow-glow'
                    : 'border-electric-blue border-opacity-20 hover:border-opacity-100'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-light">{dealership.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 flex-wrap">
                      {dealership.score !== undefined && (
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning-yellow fill-warning-yellow" />
                          <span>Score {(dealership.score * 100).toFixed(0)} / 100</span>
                        </span>
                      )}
                      {dealership.ratingText && <span>{dealership.ratingText}</span>}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {dealership.reason && (
                    <>
                      <p className="text-xs text-gray-400 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-warning-yellow flex-shrink-0 mt-0.5" />
                        <span>{dealership.reason}</span>
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1 text-[11px]">
                        {/(delay|Delay)/.test(dealership.reason) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-warning-yellow bg-opacity-10 text-warning-yellow border border-warning-yellow border-opacity-40">
                            Possible wait due to load / parts
                          </span>
                        )}
                        {/Parts missing/i.test(dealership.reason) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500 bg-opacity-10 text-red-300 border border-red-500 border-opacity-40">
                            Parts missing at this dealership
                          </span>
                        )}
                        {/Low current load/i.test(dealership.reason) && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-green bg-opacity-10 text-neon-green border border-neon-green border-opacity-40">
                            Good availability
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                <button
                  className={`w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedDealership === dealership.id
                      ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                      : 'bg-card-dark border border-electric-blue text-electric-blue hover:bg-opacity-50'
                  }`}
                >
                  {selectedDealership === dealership.id ? '✓ Selected' : 'Select'}
                </button>
              </div>
            ))}
          </div>

          {selectedDealership && (
            <div className="mt-8 p-6 rounded-xl bg-card-dark border border-electric-blue border-opacity-40 space-y-4">
              <p className="text-text-light font-semibold mb-2">Booking details</p>

              {/* Pickup / Drop Selection */}
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Do you want pick-up & drop service?</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setPickupRequired(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      pickupRequired === true
                        ? 'bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark border-transparent shadow-glow'
                        : 'bg-card-dark border-electric-blue text-electric-blue hover:border-opacity-100'
                    }`}
                  >
                    Yes, pick up my car
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickupRequired(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                      pickupRequired === false
                        ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark border-transparent shadow-glow'
                        : 'bg-card-dark border-electric-blue text-electric-blue hover:border-opacity-100'
                    }`}
                  >
                    No, I will visit the dealership
                  </button>
                </div>

                {pickupRequired && (
                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">Pickup address</label>
                    <textarea
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg bg-primary-dark border border-electric-blue border-opacity-40 text-sm text-text-light px-3 py-2 outline-none focus:border-opacity-100 focus:shadow-glow resize-none"
                      placeholder="Flat / house number, street, area, city"
                    />
                  </div>
                )}
              </div>

              {/* Time Slot Selection */}
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Choose a time slot</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.iso}
                      type="button"
                      onClick={() => setSelectedSlot(slot.iso)}
                      className={`w-full px-3 py-2 rounded-lg text-xs text-left border transition-all ${
                        selectedSlot === slot.iso
                          ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark border-transparent shadow-glow'
                          : 'bg-card-dark border-electric-blue border-opacity-40 text-text-light hover:border-opacity-100'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Services + Cost Summary */}
              {effectiveServicesForBooking.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Services in this booking</p>
                  <div className="space-y-1 text-sm text-gray-300">
                    {effectiveServicesForBooking.map((s) => (
                      <div key={s.service_code} className="flex items-center justify-between">
                        <span>{s.name}</span>
                        {s.estimatedCost && <span className="text-gray-200 font-medium">{s.estimatedCost}</span>}
                      </div>
                    ))}
                  </div>
                  {totalEstimatedCost > 0 && (
                    <p className="text-sm text-text-light font-semibold mt-1">
                      Estimated total: ₹{totalEstimatedCost.toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              )}

              {bookingError && <p className="text-sm text-red-400">{bookingError}</p>}

              <button
                type="button"
                disabled={bookingBusy}
                onClick={handleConfirmBooking}
                className="mt-2 px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100 text-sm"
              >
                {bookingBusy ? 'Booking…' : 'Confirm Booking'}
              </button>

              {bookingSuccess && (
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-neon-green to-electric-cyan bg-opacity-10 border border-neon-green border-opacity-40">
                  <p className="text-sm text-text-light font-semibold mb-1">Booking confirmed!</p>
                  <p className="text-xs text-gray-300 mb-1">{bookingSuccess.dealershipName}</p>
                  <p className="text-xs text-gray-300 mb-2">
                    {new Date(bookingSuccess.datetime).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mb-1">Services:</p>
                  <ul className="text-xs text-gray-300 list-disc list-inside space-y-0.5">
                    {bookingSuccess.services.map((s) => (
                      <li key={s.service_code}>{s.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!showDealerships && (
        <>
          {/* Action Buttons */}
          <div className="mb-8">
            <div className="flex gap-4 mb-6">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
                Book New Appointment
              </button>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                    : 'bg-card-dark border border-electric-blue text-electric-blue hover:border-opacity-100'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  statusFilter === 'confirmed'
                    ? 'bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark shadow-glow'
                    : 'bg-card-dark border border-neon-green text-neon-green hover:border-opacity-100'
                }`}
              >
                ✓ Confirmed
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-gradient-to-r from-warning-yellow to-electric-cyan text-primary-dark shadow-glow'
                    : 'bg-card-dark border border-warning-yellow text-warning-yellow hover:border-opacity-100'
                }`}
              >
                ⏳ Pending
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                    : 'bg-card-dark border border-electric-blue text-electric-blue hover:border-opacity-100'
                }`}
              >
                ✅ Completed
              </button>
            </div>
          </div>

          {/* Appointments List */}
        </>
      )}

      {/* Appointments List */}
      {!showDealerships && (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Side */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-text-light mb-2">{appointment.service}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  <span
                    className={`badge ${
                      appointment.status === 'confirmed' ? 'badge-success' : 'badge-warning'
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Right Side */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.dealership}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 mb-4">
                      <Phone className="w-4 h-4" />
                      <span>{appointment.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold hover:scale-105 transition-transform">
                    View Details
                  </button>
                  <button className="flex-1 px-4 py-2 rounded-lg bg-card-dark border border-warning-yellow text-warning-yellow font-semibold hover:bg-opacity-50 transition-all">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Empty State */}
      {!showDealerships && appointments.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No appointments scheduled</p>
          <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold">
            Book Your First Appointment
          </button>
        </div>
      )}
    </div>
  )
}
