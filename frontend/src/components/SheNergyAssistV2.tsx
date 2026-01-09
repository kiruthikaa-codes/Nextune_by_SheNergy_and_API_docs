'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, MapPin, AlertCircle, CheckCircle2, QrCode } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
}

interface PredictedService {
  name: string
  urgency: 'critical' | 'warning' | 'info'
  daysUntilNeeded: number
  estimatedCost: string
}

interface Dealership {
  id: string
  name: string
  distance: number
  waitDays: number
  hasAllParts: boolean
  rating: number
  availability: string
  estimatedCost: string
}

type ChatState = 'idle' | 'booking' | 'predictive' | 'service_selection' | 'wait_confirmation' | 'dealerships' | 'scheduler' | 'confirmation' | 'booked'

interface SheNergyAssistProps {
  triggerBooking?: boolean
}

export default function SheNergyAssist({ triggerBooking = false }: SheNergyAssistProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(triggerBooking)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hi! I\'m SheNergy Assist. 🚗 Ready to book your service or need support?',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [chatState, setChatState] = useState<ChatState>(triggerBooking ? 'booking' : 'idle')
  const [selectedService, setSelectedService] = useState<string>('')
  const [suggestedServices, setSuggestedServices] = useState<PredictedService[]>([
    { name: 'Brake Pad Replacement', urgency: 'critical', daysUntilNeeded: 15, estimatedCost: '₹7,499' },
    { name: 'Battery Health Check', urgency: 'info', daysUntilNeeded: 60, estimatedCost: '₹0' },
    { name: 'Air Filter Replacement', urgency: 'warning', daysUntilNeeded: 30, estimatedCost: '₹1,999' },
  ])
  const [selectedDealership, setSelectedDealership] = useState<Dealership | null>(null)
  const [acceptsWait, setAcceptsWait] = useState<boolean | null>(null)
  const [maxWaitDays, setMaxWaitDays] = useState(7)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [appointmentId, setAppointmentId] = useState('APT-' + Math.random().toString(36).substr(2, 9).toUpperCase())
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Predictive model - suggests services based on vehicle health
  const getPredictiveServices = () => {
    return suggestedServices
  }

  // Filter dealerships based on wait time preference
  const getFilteredDealerships = (): Dealership[] => {
    const allDealerships: Dealership[] = [
      {
        id: '1',
        name: 'Bangalore EV Service Center',
        distance: 2.3,
        waitDays: 0,
        hasAllParts: true,
        rating: 4.8,
        availability: 'Ready',
        estimatedCost: '₹7,499',
      },
      {
        id: '2',
        name: 'Whitefield Tata Service',
        distance: 5.1,
        waitDays: 2,
        hasAllParts: false,
        rating: 4.5,
        availability: 'Delay - Missing parts',
        estimatedCost: '₹7,499',
      },
      {
        id: '3',
        name: 'Koramangala Auto Care',
        distance: 8.7,
        waitDays: 1,
        hasAllParts: true,
        rating: 4.6,
        availability: 'Ready',
        estimatedCost: '₹7,499',
      },
      {
        id: '4',
        name: 'Indiranagar Service Hub',
        distance: 12.3,
        waitDays: 5,
        hasAllParts: true,
        rating: 4.3,
        availability: 'Delayed',
        estimatedCost: '₹7,299',
      },
    ]

    if (acceptsWait === null) return allDealerships

    return allDealerships
      .filter((d) => acceptsWait || d.waitDays === 0)
      .filter((d) => d.waitDays <= maxWaitDays)
      .sort((a, b) => {
        // Sort by: parts availability, wait time, rating
        if (a.hasAllParts !== b.hasAllParts) return a.hasAllParts ? -1 : 1
        if (a.waitDays !== b.waitDays) return a.waitDays - b.waitDays
        return b.rating - a.rating
      })
  }

  const handleStartBooking = () => {
    setChatState('booking')
    addBotMessage('Great! Let me run our predictive model to check your vehicle health and suggest services. 🔍')
    setTimeout(() => {
      setChatState('predictive')
      addBotMessage('✅ Predictive analysis complete! I found these recommended services for your 2024 Tata Nexon EV:')
    }, 1000)
  }

  const handleSelectService = (service: PredictedService) => {
    setSelectedService(service.name)
    addUserMessage(`I want to book: ${service.name}`)
    setChatState('wait_confirmation')
    addBotMessage(`Perfect! For ${service.name}, I need to know: Are you okay with waiting if the dealership doesn't have all parts in stock? This might get you a better price or faster service at some locations.`)
  }

  const handleWaitPreference = (accepts: boolean) => {
    setAcceptsWait(accepts)
    addUserMessage(accepts ? `Yes, I can wait up to ${maxWaitDays} days` : 'No, I need it ASAP')
    setChatState('dealerships')
    addBotMessage('Finding the best dealerships for you... 🔍')
    setTimeout(() => {
      addBotMessage('Here are dealerships ranked by availability, wait time, and rating:')
    }, 800)
  }

  const handleSelectDealership = (dealership: Dealership) => {
    setSelectedDealership(dealership)
    addUserMessage(`Selected: ${dealership.name}`)
    setChatState('scheduler')
    addBotMessage(`Great choice! ${dealership.name} is ${dealership.distance}km away. Now let's pick a date and time for your appointment.`)
  }

  const handleConfirmAppointment = () => {
    if (!selectedDate || !selectedTime || !selectedDealership) return
    setChatState('confirmation')
    addUserMessage(`Booking for ${selectedDate} at ${selectedTime}`)
    addBotMessage('Processing your appointment... ⏳')
    setTimeout(() => {
      setChatState('booked')
      addBotMessage('🎉 Your appointment is confirmed! Here\'s your booking details:')
    }, 1000)
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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    addUserMessage(inputValue)
    setInputValue('')

    // Simple response logic
    if (chatState === 'idle') {
      if (inputValue.toLowerCase().includes('book') || inputValue.toLowerCase().includes('service')) {
        handleStartBooking()
      } else {
        addBotMessage('I can help you with booking a service, checking your appointment status, or connecting with support. What would you like to do?')
      }
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
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-screen w-full md:w-96 bg-gradient-to-b from-card-dark via-primary-dark to-card-dark border-l border-electric-blue border-opacity-30 shadow-2xl z-50 flex flex-col animate-slide-in">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-6 border-b border-electric-blue border-opacity-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center shadow-glow">
                  <MessageCircle className="w-5 h-5 text-primary-dark" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-light">SheNergy Assist</h2>
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
                <div className="space-y-2">
                  {getPredictiveServices().map((service, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectService(service)}
                      className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-card-dark to-primary-dark border border-electric-blue border-opacity-30 hover:border-opacity-100 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-text-light text-sm">{service.name}</p>
                          <p className="text-xs text-gray-400">In {service.daysUntilNeeded} days • {service.estimatedCost}</p>
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
                  ))}
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

              {/* Dealerships List */}
              {chatState === 'dealerships' && (
                <div className="space-y-2">
                  {getFilteredDealerships().map((dealership) => (
                    <button
                      key={dealership.id}
                      onClick={() => handleSelectDealership(dealership)}
                      className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-card-dark to-primary-dark border border-electric-blue border-opacity-30 hover:border-opacity-100 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-text-light text-sm">{dealership.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {dealership.distance} km
                          </p>
                        </div>
                        <span
                          className={`badge text-xs ${
                            dealership.hasAllParts ? 'badge-success' : 'badge-warning'
                          }`}
                        >
                          {dealership.availability}
                        </span>
                      </div>
                      {dealership.waitDays > 0 && (
                        <p className="text-xs text-warning-yellow">⏱️ Wait: {dealership.waitDays} days</p>
                      )}
                      <p className="text-xs text-gray-400">Rating: {dealership.rating}/5 • {dealership.estimatedCost}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Scheduler */}
              {chatState === 'scheduler' && (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Select Date</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Dec 18', 'Dec 19', 'Dec 20', 'Dec 21'].map((date) => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            selectedDate === date
                              ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                              : 'bg-card-dark border border-electric-blue border-opacity-30 text-electric-blue hover:border-opacity-100'
                          }`}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 mb-2">Select Time</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['9:00 AM', '10:00 AM', '2:00 PM', '3:30 PM'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                            selectedTime === time
                              ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                              : 'bg-card-dark border border-electric-blue border-opacity-30 text-electric-blue hover:border-opacity-100'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmAppointment}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark font-semibold text-sm hover:scale-105 transition-transform"
                  >
                    Confirm Appointment
                  </button>
                </div>
              )}

              {/* Confirmation */}
              {chatState === 'booked' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-neon-green to-electric-cyan bg-opacity-10 border border-neon-green border-opacity-40 rounded-2xl p-6 text-center">
                    <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto mb-3 animate-bounce" />
                    <h3 className="text-lg font-bold text-text-light mb-1">Appointment Confirmed!</h3>
                    <p className="text-sm text-gray-400">Your service is booked</p>
                  </div>

                  <div className="bg-card-dark border border-electric-blue border-opacity-30 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="text-xs text-gray-400">Appointment ID</p>
                      <p className="text-sm font-semibold text-text-light">{appointmentId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Date & Time</p>
                      <p className="text-sm font-semibold text-text-light">{selectedDate} • {selectedTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Service Center</p>
                      <p className="text-sm font-semibold text-text-light">{selectedDealership?.name}</p>
                    </div>
                  </div>

                  <div className="bg-primary-dark border border-electric-blue border-opacity-30 rounded-xl p-4 flex flex-col items-center gap-3">
                    <QrCode className="w-12 h-12 text-electric-blue" />
                    <p className="text-xs text-gray-400">Show this QR code at the service center</p>
                  </div>

                  <button
                    onClick={() => router.push('/customer/appointments')}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold text-sm hover:scale-105 transition-transform"
                  >
                    View Appointment
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions (Idle State) */}
            {chatState === 'idle' && (
              <div className="px-4 py-3 border-t border-electric-blue border-opacity-20">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleStartBooking}
                    className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold text-sm hover:scale-105 transition-transform"
                  >
                    📅 Book Appointment
                  </button>
                  <button className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold text-sm hover:bg-opacity-50 transition-all">
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
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent text-text-light placeholder-gray-500 outline-none text-sm"
                  />
                  <button
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
