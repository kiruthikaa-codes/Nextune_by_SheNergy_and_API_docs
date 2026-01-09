'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
}

interface PredictedService {
  service_code: string
  name: string
  urgency: 'critical' | 'warning' | 'info'
  daysUntilNeeded: number
  estimatedCost: string
}

type ChatState = 'idle' | 'booking' | 'predictive' | 'service_selection' | 'wait_confirmation' | 'completed'

interface NextuneAssistProps {
  triggerBooking?: boolean
  onServiceSelected?: (service: PredictedService, acceptsWait: boolean, maxWaitDays: number) => void
  customerId?: string
  vin?: string
}

export default function NextuneAssist({ triggerBooking = false, onServiceSelected, customerId, vin }: NextuneAssistProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(triggerBooking)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m Nextune Assist. 🚗 Ready to book your service or need support?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [chatState, setChatState] = useState<ChatState>(triggerBooking ? 'booking' : 'idle')
  const [suggestedServices, setSuggestedServices] = useState<PredictedService[]>([])
  const [acceptsWait, setAcceptsWait] = useState<boolean | null>(null)
  const [maxWaitDays, setMaxWaitDays] = useState(7)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [selectedServiceCodes, setSelectedServiceCodes] = useState<string[]>([])

  const SERVICE_LABELS: Record<string, { name: string }> = {
    PERIODIC_10K: { name: 'Engine Oil & Filter Change (10,000 km Service)' },
    PERIODIC_20K: { name: 'Fluids Top-up & Brake Check (20,000 km Service)' },
    PERIODIC_30K: { name: 'Detailed Check-up & Suspension Inspection (30,000 km Service)' },
    BRAKE_CHECK: { name: 'Brake Inspection & Pad Check' },
    CLUTCH_ADJUST: { name: 'Clutch Inspection & Adjustment' },
    AC_CHECK: { name: 'AC Cooling & Leak Check' },
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const ensureSession = async () => {
    if (sessionId) return sessionId
    const body: any = {}
    if (customerId) body.customer_id = customerId
    if (vin) body.vin = vin
    const resp = await api.createChatSession(body) as any
    setSessionId(resp.session_id)
    return resp.session_id as string
  }

  const sendToBackend = async (userText: string, options?: { selectedServiceCodes?: string[] }) => {
    try {
      setBusy(true)
      const id = await ensureSession()
      const resp = await api.sendChatMessage({
        session_id: id,
        message: userText,
        customer_id: customerId,
        vin,
        selected_service_codes: options?.selectedServiceCodes,
      }) as any

      // Main Gemini reply
      if (resp.reply) {
        addBotMessage(resp.reply)
      }

      // Map predictive recommendations into suggested services (if present).
      // Only do this when we are not also receiving rankings/appointment, so we
      // don't re-open the selection UI after the user has already chosen services.
      if (resp.recommendations && Array.isArray(resp.recommendations) && !resp.rankings && !resp.appointment) {
        const mapped: PredictedService[] = resp.recommendations.map((r: any) => ({
          service_code: r.service_code || r.description || 'UNKNOWN_CODE',
          name: SERVICE_LABELS[r.service_code]?.name || r.description || r.service_code || 'Recommended Service',
          urgency: r.urgency_label === 'urgent' ? 'critical' : r.urgency_label === 'soon' ? 'warning' : 'info',
          daysUntilNeeded: r.recommended_window ? 7 : 30,
          estimatedCost: r.estimated_cost ? `₹${r.estimated_cost}` : '—',
        }))
        setSuggestedServices(mapped)
        setSelectedServiceCodes([])
        setChatState('predictive')
      }

      // If the backend is asking whether the user accepts an inventory-related delay,
      // it will return selected_dealership without rankings. Switch to the
      // wait_confirmation state so the Yes/No buttons are shown.
      if (resp.selected_dealership && !resp.rankings) {
        setChatState('wait_confirmation')
      }

      // If rankings returned, rely on the Gemini reply for explanation.
      // Also stash them into sessionStorage so the Appointments page can
      // render the same ranked list when the user is redirected.
      if (resp.rankings && Array.isArray(resp.rankings)) {
        if (typeof window !== 'undefined') {
          try {
            const payload = {
              rankings: resp.rankings,
              generatedAt: new Date().toISOString(),
            }
            window.sessionStorage.setItem('senergy_last_rankings', JSON.stringify(payload))

            // Store a lightweight chat summary that preserves the initial issue
            // description (e.g. "AC not cooling") plus the most recent turns.
            const userMessages = messages.filter((m) => m.type === 'user').map((m) => m.content)
            if (userMessages.length > 0) {
              const lowerMessages = userMessages.map((m) => m.toLowerCase())
              const acIndex = lowerMessages.findIndex((m) =>
                m.includes(' ac') ||
                m.includes('a/c') ||
                m.includes('air conditioning') ||
                m.includes('aircon') ||
                m.includes('no air') ||
                m.includes('no cooling')
              )

              const firstIssue =
                acIndex >= 0 ? userMessages[acIndex] : userMessages[0]

              const tail = userMessages.slice(-3)
              const pieces = [firstIssue, ...tail]

              // Deduplicate while preserving order so the summary stays compact.
              const seen = new Set<string>()
              const unique = pieces.filter((p) => {
                const key = p.trim()
                if (!key || seen.has(key)) return false
                seen.add(key)
                return true
              })

              const summary = unique.join(' | ')
              window.sessionStorage.setItem('senergy_chat_summary', summary)
            }
          } catch (e) {
            // ignore storage failures; page will just fall back to defaults
          }
        }

        if (chatState === 'predictive' || chatState === 'wait_confirmation') {
          setChatState('booking')
        }

        if (!resp.selected_dealership) {
          setTimeout(() => {
            router.push('/customer/appointments?source=chat&filter=dealerships')
          }, 1500)
        }
      }

      // If appointment returned, acknowledge it
      if (resp.appointment) {
        const a = resp.appointment
        addBotMessage(
          `Your appointment details are ready at ${a.dealership_name} on ${new Date(
            a.requested_datetime
          ).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}. You can view full information on the Appointments page.`
        )
        setChatState('completed')
      }
    } catch (err: any) {
      addBotMessage(err?.message || 'Sorry, something went wrong while talking to the backend.')
    } finally {
      setBusy(false)
    }
  }

  const handleStartBooking = async () => {
    setChatState('booking')
    addBotMessage('Great! Tell me what issues you are facing, or press Book Appointment and I will run the predictive model.')
    if (customerId && vin) {
      await ensureSession()
    }
  }

  const toggleServiceSelection = (service: PredictedService) => {
    setSelectedServiceCodes((prev) =>
      prev.includes(service.service_code)
        ? prev.filter((code) => code !== service.service_code)
        : [...prev, service.service_code]
    )
  }

  const handleBookSelectedServices = async () => {
    if (selectedServiceCodes.length === 0) return
    // Persist selected services so the Appointments page can show a cost breakdown
    if (typeof window !== 'undefined') {
      try {
        const selected = suggestedServices.filter((s) => selectedServiceCodes.includes(s.service_code))
        const payload = selected.map((s) => ({
          service_code: s.service_code,
          name: s.name,
          estimatedCost: s.estimatedCost,
        }))
        window.sessionStorage.setItem('senergy_selected_services', JSON.stringify(payload))
      } catch (e) {
        // ignore storage failures; booking flow will still work without cost breakdown
      }
    }

    addUserMessage(`I want to book these services: ${selectedServiceCodes.join(', ')}`)
    await sendToBackend('I want to book these services', { selectedServiceCodes })
  }

  const handleWaitPreference = async (accepts: boolean) => {
    setAcceptsWait(accepts)
    const userText = accepts
      ? `Yes, I am okay with a possible delay of up to ${maxWaitDays} days`
      : 'No, I am not okay with a delay and need it as soon as possible'

    addUserMessage(userText)
    // Let the backend handle pendingInventoryCheck and return updated rankings,
    // which will then be stored and trigger redirect via the existing logic.
    await sendToBackend(userText)
  }

  const addBotMessage = (content: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, botMessage])
  }

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    addUserMessage(inputValue)
    setInputValue('')

    if (chatState === 'idle' || chatState === 'booking' || chatState === 'predictive' || chatState === 'wait_confirmation') {
      await sendToBackend(inputValue)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan shadow-lg hover:shadow-glow transition-all duration-300 flex items-center justify-center group animate-pulse"
        >
          <div className="absolute inset-0 rounded-full border-2 border-electric-blue opacity-50 group-hover:opacity-100 group-hover:border-electric-cyan transition-all"></div>
          <MessageCircle className="w-8 h-8 text-primary-dark relative z-10" />
        </button>
      )}

      {/* Chatbot Panel */}
      {isOpen && (
        <>
          {/* No Overlay - Keep Background Clear */}

          {/* Panel */}
          <div className="fixed right-0 top-0 h-screen w-full md:w-96 bg-gradient-to-b from-card-dark via-primary-dark to-card-dark border-l border-electric-blue border-opacity-30 shadow-2xl z-50 flex flex-col animate-slide-in">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-6 border-b border-electric-blue border-opacity-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center shadow-glow">
                  <MessageCircle className="w-5 h-5 text-primary-dark" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-light">Nextune Assist</h2>
                  <p className="text-xs text-gray-400">Smart Booking</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-card-dark transition-all"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-electric-blue" />
              </button>
            </div>

            {/* Chat Window */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl ${
                      message.type === 'bot'
                        ? 'bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-20 border border-electric-blue border-opacity-40 text-text-light shadow-glow'
                        : 'bg-gradient-to-r from-neon-green to-electric-cyan bg-opacity-20 border border-neon-green border-opacity-40 text-text-light'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Predictive Services */}
              {chatState === 'predictive' && (
                <div className="space-y-3">
                  <div className="text-xs text-gray-400 mb-1">Select one or more services to include in your booking:</div>
                  {suggestedServices.map((service, i) => {
                    const isSelected = selectedServiceCodes.includes(service.service_code)
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleServiceSelection(service)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-20 border-electric-cyan shadow-glow'
                            : 'bg-gradient-to-r from-card-dark to-primary-dark border-electric-blue border-opacity-30 hover:border-opacity-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-text-light text-sm">{service.name}</p>
                            <p className="text-xs text-gray-400">
                              In {service.daysUntilNeeded} days • {service.estimatedCost}
                            </p>
                          </div>
                          <span
                            className={`badge text-xs ${
                              service.urgency === 'critical'
                                ? 'badge-danger'
                                : service.urgency === 'warning'
                                ? 'badge-warning'
                                : 'badge-info'
                            }`}
                          >
                            {service.urgency}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                  <button
                    type="button"
                    disabled={busy || selectedServiceCodes.length === 0}
                    onClick={handleBookSelectedServices}
                    className="w-full mt-1 px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Book selected services
                  </button>
                </div>
              )}

              {/* Wait Confirmation */}
              {chatState === 'wait_confirmation' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-warning-yellow bg-opacity-10 border border-warning-yellow border-opacity-40">
                    <p className="text-sm text-warning-yellow flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      Some dealerships might have delays if parts aren't in stock
                    </p>
                  </div>
                  <button
                    onClick={() => handleWaitPreference(true)}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark font-semibold text-sm hover:scale-105 transition-transform"
                  >
                    ✅ Yes, I can wait
                  </button>
                  <button
                    onClick={() => handleWaitPreference(false)}
                    className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold text-sm hover:bg-opacity-50 transition-all"
                  >
                    ⚡ No, I need it ASAP
                  </button>
                </div>
              )}

              {/* Completed */}
              {chatState === 'completed' && (
                <div className="bg-gradient-to-br from-neon-green to-electric-cyan bg-opacity-10 border border-neon-green border-opacity-40 rounded-2xl p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto mb-3 animate-bounce" />
                  <h3 className="text-lg font-bold text-text-light mb-1">Ready to Book!</h3>
                  <p className="text-sm text-gray-400">Redirecting to appointments page...</p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Idle State) */}
            {chatState === 'idle' && (
              <div className="px-4 py-3 border-t border-electric-blue border-opacity-20">
                <div className="flex flex-col gap-2">
                  <button
                    disabled={busy}
                    onClick={() => {
                      addUserMessage('I want to book a service appointment')
                      sendToBackend('I want to book a service appointment')
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold text-sm hover:scale-105 transition-transform"
                  >
                    📅 Book Appointment
                  </button>
                  <button
                    disabled={busy}
                    className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold text-sm hover:bg-opacity-50 transition-all"
                  >
                    ❓ Get Support
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            {(chatState === 'idle' || chatState === 'booking') && (
              <div className="p-4 border-t border-electric-blue border-opacity-20">
                <div className="flex gap-2 items-center bg-card-dark rounded-full border border-electric-blue border-opacity-30 px-4 py-2 focus-within:border-opacity-100 focus-within:shadow-glow transition-all">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-text-light placeholder-gray-500 outline-none text-sm"
                  />
                  <button
                    disabled={busy}
                    onClick={handleSendMessage}
                    className="p-2 rounded-full bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark hover:scale-110 transition-transform"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
