'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, MessageCircle, MapPin, Clock, AlertCircle, CheckCircle2, QrCode, Zap, TrendingUp } from 'lucide-react'
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
  const [suggestedServices, setSuggestedServices] = useState<PredictedService[]>([])
  const [selectedDealership, setSelectedDealership] = useState<Dealership | null>(null)
  const [acceptsWait, setAcceptsWait] = useState<boolean | null>(null)
  const [maxWaitDays, setMaxWaitDays] = useState(7)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [appointmentId, setAppointmentId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'I understand. Let me help you with that.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    }, 500)
  }

  const handleQuickReply = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: action,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    if (action === 'Check Predictive Report') {
      setChatState('maintenance')
    } else if (action === 'Fastest Dealership') {
      setChatState('dealerships')
    } else if (action === 'Book a Service') {
      setChatState('scheduler')
    }
  }

  const quickReplies = [
    'Book a Service',
    'Check Predictive Report',
    'Fastest Dealership',
    'Is it safe to drive?',
  ]

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
                  <p className="text-xs text-gray-400">Always online</p>
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

              {/* Maintenance Card */}
              {chatState === 'maintenance' && <MaintenanceCard />}

              {/* Dealerships List */}
              {chatState === 'dealerships' && <DealershipsList onSelect={() => setChatState('scheduler')} />}

              {/* Scheduler */}
              {chatState === 'scheduler' && <AppointmentScheduler onConfirm={() => setChatState('confirmation')} />}

              {/* Confirmation */}
              {chatState === 'confirmation' && <ConfirmationCard />}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {chatState === 'idle' && (
              <div className="px-4 py-3 border-t border-electric-blue border-opacity-20">
                <div className="flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-2 rounded-full bg-card-dark border border-electric-blue border-opacity-50 text-xs text-electric-blue hover:bg-electric-blue hover:bg-opacity-20 hover:border-opacity-100 transition-all"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
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
          </div>
        </>
      )}
    </>
  )
}

/* Maintenance Card Component */
function MaintenanceCard() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <div className="bg-gradient-to-br from-card-dark to-primary-dark border border-warning-yellow border-opacity-40 rounded-2xl p-4 shadow-lg">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-warning-yellow flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-text-light">Predictive Maintenance</h3>
            <p className="text-xs text-gray-400">2024 Tata Nexon EV</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-primary-dark rounded-lg p-3 border border-warning-yellow border-opacity-30">
            <p className="text-sm text-text-light mb-1">🛑 Brake Pads</p>
            <p className="text-xs text-gray-400">Replacement recommended in 15 days</p>
          </div>

          <div className="bg-primary-dark rounded-lg p-3 border border-electric-blue border-opacity-30">
            <p className="text-sm text-text-light mb-1">🔋 Battery Health</p>
            <p className="text-xs text-gray-400">96% - Excellent condition</p>
          </div>

          <div className="bg-primary-dark rounded-lg p-3 border border-neon-green border-opacity-30">
            <p className="text-sm text-text-light mb-1">⚙️ Engine</p>
            <p className="text-xs text-gray-400">All systems normal</p>
          </div>
        </div>

        <button className="w-full mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-warning-yellow to-orange-500 text-primary-dark font-semibold text-sm hover:scale-105 transition-transform">
          Book Service Now
        </button>
      </div>
    </div>
  )
}

/* Dealerships List Component */
function DealershipsList({ onSelect }: { onSelect: () => void }) {
  const dealerships = [
    {
      name: 'Bangalore EV Service Center',
      distance: '2.3 km',
      status: 'Ready',
      statusColor: 'neon-green',
      availability: 'All parts ready',
    },
    {
      name: 'Whitefield Tata Service',
      distance: '5.1 km',
      status: 'Delay',
      statusColor: 'warning-yellow',
      availability: 'Delay: 2 days',
    },
    {
      name: 'Koramangala Auto Care',
      distance: '8.7 km',
      status: 'Ready',
      statusColor: 'neon-green',
      availability: 'All parts ready',
    },
  ]

  return (
    <div className="space-y-3 w-full">
      {dealerships.map((dealership, i) => (
        <div
          key={i}
          className="bg-gradient-to-r from-card-dark to-primary-dark border border-electric-blue border-opacity-30 rounded-xl p-4 hover:border-opacity-100 transition-all cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-text-light text-sm">{dealership.name}</h4>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {dealership.distance}
              </p>
            </div>
            <span
              className={`badge ${
                dealership.statusColor === 'neon-green' ? 'badge-success' : 'badge-warning'
              }`}
            >
              {dealership.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-3">{dealership.availability}</p>
          <button
            onClick={onSelect}
            className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold text-xs hover:scale-105 transition-transform"
          >
            Select & Continue
          </button>
        </div>
      ))}
    </div>
  )
}

/* Appointment Scheduler Component */
function AppointmentScheduler({ onConfirm }: { onConfirm: () => void }) {
  const [selectedDate, setSelectedDate] = useState('Dec 18')
  const [selectedTime, setSelectedTime] = useState('10:00 AM')

  const dates = ['Dec 17', 'Dec 18', 'Dec 19', 'Dec 20']
  const times = ['9:00 AM', '10:00 AM', '2:00 PM', '3:30 PM']

  return (
    <div className="space-y-4 w-full">
      <div>
        <p className="text-xs text-gray-400 mb-2">Select Date</p>
        <div className="grid grid-cols-2 gap-2">
          {dates.map((date) => (
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
          {times.map((time) => (
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

      <div className="bg-primary-dark border border-neon-green border-opacity-40 rounded-lg p-3">
        <p className="text-xs text-neon-green flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          All parts ready for your service
        </p>
      </div>

      <button
        onClick={onConfirm}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark font-semibold text-sm hover:scale-105 transition-transform"
      >
        Confirm Appointment
      </button>
    </div>
  )
}

/* Confirmation Card Component */
function ConfirmationCard() {
  return (
    <div className="space-y-4 w-full">
      <div className="bg-gradient-to-br from-neon-green to-electric-cyan bg-opacity-10 border border-neon-green border-opacity-40 rounded-2xl p-6 text-center">
        <CheckCircle2 className="w-12 h-12 text-neon-green mx-auto mb-3 animate-bounce" />
        <h3 className="text-lg font-bold text-text-light mb-1">Appointment Confirmed!</h3>
        <p className="text-sm text-gray-400">Your service is booked</p>
      </div>

      <div className="bg-card-dark border border-electric-blue border-opacity-30 rounded-xl p-4 space-y-3">
        <div>
          <p className="text-xs text-gray-400">Date & Time</p>
          <p className="text-sm font-semibold text-text-light">Dec 18, 2024 • 10:00 AM</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Service Center</p>
          <p className="text-sm font-semibold text-text-light">Bangalore EV Service Center</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Service Type</p>
          <p className="text-sm font-semibold text-text-light">Brake Pad Replacement</p>
        </div>
      </div>

      <div className="bg-primary-dark border border-electric-blue border-opacity-30 rounded-xl p-4 flex flex-col items-center gap-3">
        <QrCode className="w-12 h-12 text-electric-blue" />
        <p className="text-xs text-gray-400">Show this QR code at the service center</p>
      </div>

      <button className="w-full px-4 py-2 rounded-lg bg-card-dark border border-neon-green text-neon-green font-semibold text-sm hover:bg-neon-green hover:bg-opacity-20 transition-all">
        Add to Calendar
      </button>
    </div>
  )
}
