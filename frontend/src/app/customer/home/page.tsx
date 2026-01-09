'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Zap, MapPin, Calendar, ChevronRight, Phone, Zap as ZapIcon } from 'lucide-react'
import SheNergyAssist from '@/components/SheNergyAssistV3'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/services/api'

interface Recommendation {
  service_code: string
  description?: string
  estimated_cost?: number
  urgency_score?: number
  // new fields from upgraded predictive model
  urgency_label?: 'urgent' | 'soon' | 'can_wait'
  recommended_window?: string
  reason?: string
}

const SERVICE_LABELS: Record<
  string,
  {
    name: string
    description: string
  }
> = {
  PERIODIC_10K: {
    name: 'Periodic Service - 10,000 km',
    description: 'Engine oil change, oil filter, basic inspection, washing.',
  },
  PERIODIC_20K: {
    name: 'Periodic Service - 20,000 km',
    description: 'Fluids top-up, brake inspection, air filter cleaning, alignment check.',
  },
  PERIODIC_30K: {
    name: 'Periodic Service - 30,000 km',
    description: 'Detailed inspection, coolant check, suspension check.',
  },
  BRAKE_CHECK: {
    name: 'Brake Inspection & Pad Check',
    description: 'Inspect brake pads, discs, and braking performance for city traffic.',
  },
  CLUTCH_ADJUST: {
    name: 'Clutch Inspection & Adjustment',
    description: 'Check clutch wear and adjust for smoother engagement in stop-go traffic.',
  },
  AC_CHECK: {
    name: 'AC System Check',
    description: 'Inspect cooling performance, refrigerant level, condenser, and cabin filter.',
  },
  WIPER_CHECK: {
    name: 'Windshield Wiper Inspection & Motor Check',
    description: 'Check wiper blades, linkage, and motor operation; basic adjustment or recommendation.',
  },
}

interface Appointment {
  id: string
  dealership_id: string
  dealership_name: string
  requested_datetime: string
  status: string
  pickup_drop_required?: boolean
  pickup_address?: string
  user_issue_summary?: string
  service_codes_requested: string[]
}

export default function CustomerHomePage() {
  const { customer } = useAuth()
  const [triggerChatbot, setTriggerChatbot] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [dealershipContacts, setDealershipContacts] = useState<
    Record<string, { name: string; address?: string; phone?: string }>
  >({})

  const primaryVehicle = useMemo(() => customer?.vehicles?.[0], [customer]) as
    | { vin: string; model: string; year: number }
    | undefined

  useEffect(() => {
    const load = async () => {
      if (!customer || !primaryVehicle) return
      setLoading(true)
      setError(null)
      try {
        const [pred, appts, dealershipsResp] = await Promise.all([
          api.predictMaintenance({ customer_id: customer.customer_id, vin: primaryVehicle.vin }) as any,
          api.listAppointments(customer.customer_id) as any,
          api.listDealerships() as any,
        ])

        setRecommendations(pred?.recommendations || [])
        const dlrList = dealershipsResp?.dealerships || []
        const dlrMap: Record<string, { name: string; address?: string; phone?: string }> = {}
        for (const d of dlrList) {
          dlrMap[d.dealership_id] = {
            name: d.name,
            address: d.address,
            phone: d.phone || '+91 80 0000 0000',
          }
        }
        setDealershipContacts(dlrMap)

        const backendAppts = (appts?.appointments || []) as any[]
        const mapped: Appointment[] = backendAppts.map((a) => {
          const dlr = dlrMap[a.dealership_id] || { name: 'Service Center' }
          return {
            id: a.appointment_id,
            dealership_id: a.dealership_id,
            dealership_name: dlr.name,
            requested_datetime: a.requested_datetime,
            status: a.status || 'confirmed',
            pickup_drop_required: a.pickup_drop_required,
            pickup_address: a.pickup_address,
            user_issue_summary: a.user_issue_summary,
            service_codes_requested: Array.isArray(a.service_codes_requested)
              ? a.service_codes_requested
              : [],
          }
        })
        setAppointments(mapped)
      } catch (err: any) {
        setError(err?.message || 'Failed to load vehicle insights')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [customer, primaryVehicle])

  const SERVICE_COSTS: Record<string, number> = {
    PERIODIC_10K: 5499,
    PERIODIC_20K: 6499,
    PERIODIC_30K: 7499,
    BRAKE_CHECK: 1999,
    CLUTCH_ADJUST: 1499,
    CLUTCH_OVERHAUL: 11999,
    WIPER_CHECK: 799,
  }

  const buildAppointmentServiceRows = (codes: string[]) => {
    return codes.map((code) => {
      const meta = SERVICE_LABELS[code] || {
        name: code,
        description: '',
      }
      const cost = SERVICE_COSTS[code]
      return {
        code,
        name: meta.name,
        cost,
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card-dark bg-opacity-80 backdrop-blur-md border-b border-electric-blue border-opacity-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-light">
              {customer ? `Welcome, ${customer.name}` : 'Welcome'}
            </h1>
            <p className="text-sm text-gray-400">Your vehicle health status</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 hover:border-opacity-100 transition-all">
              <svg className="w-6 h-6 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="p-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 hover:border-opacity-100 transition-all">
              <svg className="w-6 h-6 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Appointment Details Panel */}
          {selectedAppointment && (
            <div className="mt-6 p-6 rounded-2xl glass-card-dark border border-electric-blue border-opacity-40">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-text-light mb-1">Appointment Details</h4>
                  <p className="text-sm text-gray-400">
                    {new Date(selectedAppointment.requested_datetime).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-xs text-gray-400 hover:text-electric-blue"
                >
                  Close
                </button>
              </div>

              {/* Dealership Info */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-text-light mb-1">
                  {selectedAppointment.dealership_name}
                </p>
                <div className="text-xs text-gray-400 space-y-1">
                  {dealershipContacts[selectedAppointment.dealership_id]?.address && (
                    <p className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>{dealershipContacts[selectedAppointment.dealership_id]?.address}</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{dealershipContacts[selectedAppointment.dealership_id]?.phone}</span>
                  </p>
                </div>
              </div>

              {/* Services and Costs */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-text-light mb-2">Planned services</p>
                {selectedAppointment.service_codes_requested.length === 0 ? (
                  <p className="text-xs text-gray-500">No services recorded for this booking.</p>
                ) : (
                  <div className="space-y-1 text-xs text-gray-300">
                    {buildAppointmentServiceRows(selectedAppointment.service_codes_requested).map((row) => (
                      <div key={row.code} className="flex items-center justify-between">
                        <span>{row.name}</span>
                        {typeof row.cost === 'number' && (
                          <span className="text-gray-200 font-medium">
                            ₹{row.cost.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pickup Info */}
              {selectedAppointment.pickup_drop_required && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-text-light mb-1">Pickup & drop</p>
                  <p className="text-xs text-gray-300 mb-1">Pickup requested</p>
                  {selectedAppointment.pickup_address && (
                    <p className="text-xs text-gray-400 whitespace-pre-line">
                      {selectedAppointment.pickup_address}
                    </p>
                  )}
                </div>
              )}

              {/* Chat Summary for Mechanic */}
              {selectedAppointment.user_issue_summary && (
                <div className="mt-4 p-4 rounded-xl bg-primary-dark bg-opacity-60 border border-electric-blue border-opacity-40">
                  <p className="text-sm font-semibold text-text-light mb-1">
                    Issue summary from chat
                  </p>
                  <p className="text-xs text-gray-300 whitespace-pre-line">
                    {selectedAppointment.user_issue_summary}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    (For the mechanic to quickly understand the context and adjust services if needed.)
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vehicle Card */}
        <div className="mb-8 glass-card-dark p-6 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vehicle Image */}
            <div className="md:col-span-1 flex items-center justify-center">
              <div className="w-full h-48 bg-gradient-to-br from-electric-blue to-electric-cyan opacity-10 rounded-xl flex items-center justify-center">
                <svg className="w-24 h-24 text-electric-blue opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM5 11l1.5-4.5h11L19 11H5z" />
                </svg>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-text-light mb-4">
                {primaryVehicle
                  ? `${primaryVehicle.year} ${primaryVehicle.model}`
                  : 'No vehicle on file'}
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-400">Customer ID</p>
                  <p className="text-lg font-semibold text-electric-blue">{customer?.customer_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">VIN</p>
                  <p className="text-lg font-semibold text-electric-blue">{primaryVehicle?.vin || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-lg font-semibold text-neon-green">{customer?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-lg font-semibold text-neon-green">{customer?.phone}</p>
                </div>
              </div>

              {/* Health Indicators */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-green to-electric-cyan flex items-center justify-center shadow-glow-green">
                    <span className="text-sm font-bold text-primary-dark">98%</span>
                  </div>
                  <span className="text-sm text-gray-400">Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center shadow-glow">
                    <span className="text-sm font-bold text-primary-dark">95%</span>
                  </div>
                  <span className="text-sm text-gray-400">Battery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-warning-yellow to-electric-cyan flex items-center justify-center shadow-glow-yellow">
                    <span className="text-sm font-bold text-primary-dark">72%</span>
                  </div>
                  <span className="text-sm text-gray-400">Brakes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section - Book Now */}
        <div className="mb-8 bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-10 border border-electric-blue border-opacity-40 rounded-2xl p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-text-light mb-2">Ready to Schedule Service?</h2>
              <p className="text-gray-300">Get predictive maintenance recommendations and book with the best dealership</p>
            </div>
            <button
              onClick={() => setTriggerChatbot(true)}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark font-bold text-lg shadow-glow hover:scale-105 transition-transform whitespace-nowrap"
            >
              📅 Book Now
            </button>
          </div>
        </div>

        {/* Alert Section - from predictive recommendations */}
        {recommendations.length > 0 && (
          <div className="mb-8 glass-card-dark p-6 rounded-2xl border-l-4 border-warning-yellow">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-warning-yellow flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-text-light mb-2">Maintenance Alerts</h3>
                <ul className="text-gray-300 mb-4 space-y-3">
                  {recommendations.map((rec) => {
                    const meta = SERVICE_LABELS[rec.service_code] || {
                      name: rec.service_code,
                      description: rec.reason || rec.description || '',
                    }

                    let pillColor = 'bg-warning-yellow/20 text-warning-yellow'
                    if (rec.urgency_label === 'urgent') {
                      pillColor = 'bg-red-500/20 text-red-400'
                    } else if (rec.urgency_label === 'soon') {
                      pillColor = 'bg-warning-yellow/20 text-warning-yellow'
                    } else if (rec.urgency_label === 'can_wait') {
                      pillColor = 'bg-emerald-500/20 text-emerald-400'
                    }

                    return (
                      <li key={rec.service_code} className="text-sm">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-text-light">{meta.name}</span>
                          {rec.urgency_label && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pillColor}`}
                            >
                              {rec.urgency_label === 'urgent'
                                ? 'Urgent'
                                : rec.urgency_label === 'soon'
                                  ? 'Soon'
                                  : 'Can wait'}
                              {rec.recommended_window ? ` • ${rec.recommended_window}` : ''}
                            </span>
                          )}
                        </div>
                        {meta.description && (
                          <p className="text-xs text-gray-400 mb-0.5">{meta.description}</p>
                        )}
                        {rec.reason && rec.reason !== meta.description && (
                          <p className="text-xs text-gray-500">{rec.reason}</p>
                        )}
                        {typeof rec.estimated_cost === 'number' && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Est. ₹{rec.estimated_cost.toLocaleString('en-IN')}
                          </p>
                        )}
                      </li>
                    )
                  })}
                </ul>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTriggerChatbot(true)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform"
                  >
                    Book Service
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold hover:bg-opacity-50 transition-all">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Book Service */}
          <div className="glass-card p-6 rounded-xl hover:shadow-glow transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green to-electric-cyan flex items-center justify-center group-hover:shadow-glow-green transition-all">
                <Calendar className="w-6 h-6 text-primary-dark" />
              </div>
              <ChevronRight className="w-5 h-5 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">Book Service</h3>
            <p className="text-sm text-gray-400">Schedule maintenance with nearby dealerships</p>
          </div>

          {/* Service History */}
          <div className="glass-card p-6 rounded-xl hover:shadow-glow transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center group-hover:shadow-glow transition-all">
                <Zap className="w-6 h-6 text-primary-dark" />
              </div>
              <ChevronRight className="w-5 h-5 text-electric-blue opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">Service History</h3>
            <p className="text-sm text-gray-400">View all past maintenance records</p>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="glass-card-dark p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-text-light mb-6">Upcoming Appointments</h3>
          {loading && <p className="text-sm text-gray-400">Loading your appointments…</p>}
          {error && !loading && <p className="text-sm text-red-400">{error}</p>}
          {!loading && !error && appointments.length === 0 && (
            <p className="text-sm text-gray-400">No upcoming appointments yet.</p>
          )}
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-card-dark rounded-lg border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-dark" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-light">{appointment.dealership_name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(appointment.requested_datetime).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAppointment(appointment)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Chatbot - Triggered from CTA */}
      {triggerChatbot && primaryVehicle && customer && (
        <SheNergyAssist triggerBooking={true} customerId={customer.customer_id} vin={primaryVehicle.vin} />
      )}
    </div>
  )
}
