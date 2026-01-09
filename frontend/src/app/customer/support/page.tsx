'use client'

import { MessageCircle, Phone, Mail, ChevronDown, Search, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
}

export default function SupportPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: 'Appointments',
      question: 'How do I reschedule my appointment?',
      answer: 'You can reschedule your appointment by going to "My Appointments" and clicking the "Reschedule" button on any confirmed appointment. You\'ll be able to select a new date and time from available slots.',
    },
    {
      id: 2,
      category: 'Appointments',
      question: 'Can I cancel my appointment?',
      answer: 'Yes, you can cancel up to 24 hours before your scheduled appointment. Go to "My Appointments", select the appointment, and click "Cancel". You\'ll receive a confirmation email.',
    },
    {
      id: 3,
      category: 'Booking',
      question: 'How does the predictive maintenance model work?',
      answer: 'Our AI analyzes your vehicle\'s health data, usage patterns, and service history to predict which services you\'ll need soon. This helps you book services proactively and avoid breakdowns.',
    },
    {
      id: 4,
      category: 'Booking',
      question: 'Why are some dealerships showing wait times?',
      answer: 'Wait times indicate that the service center doesn\'t have all required parts in stock. You can choose to wait for the parts or select a dealership with immediate availability.',
    },
    {
      id: 5,
      category: 'Dealerships',
      question: 'How are dealerships ranked?',
      answer: 'Dealerships are ranked based on: (1) Parts availability, (2) Wait time, (3) Customer ratings, and (4) Distance from your location. The top-ranked dealership offers the best combination of these factors.',
    },
    {
      id: 6,
      category: 'Dealerships',
      question: 'Can I choose my preferred dealership?',
      answer: 'Yes! You can browse all available dealerships, compare ratings and wait times, and select your preferred one. You can also set a default dealership in your profile settings.',
    },
    {
      id: 7,
      category: 'Payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, and digital wallets. Payment is processed securely through our payment gateway.',
    },
    {
      id: 8,
      category: 'Payments',
      question: 'Is there a cancellation fee?',
      answer: 'Cancellations made 24 hours before the appointment are free. Cancellations within 24 hours may incur a small fee (typically 10% of service cost).',
    },
  ]

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = ['All', ...new Set(faqs.map((faq) => faq.category))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark p-6 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-text-light mb-3">Help & Support</h1>
        <p className="text-gray-400 text-lg">Find answers to common questions or contact our support team</p>
      </div>

      {/* Contact Options */}
      <div className="max-w-4xl mx-auto mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chat Support */}
        <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30 hover:border-opacity-100 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-primary-dark" />
            </div>
            <h3 className="text-lg font-semibold text-text-light">Chat Support</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">Chat with our support team in real-time</p>
          <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold hover:scale-105 transition-transform">
            Start Chat
          </button>
        </div>

        {/* Phone Support */}
        <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30 hover:border-opacity-100 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green to-electric-cyan flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary-dark" />
            </div>
            <h3 className="text-lg font-semibold text-text-light">Phone Support</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">Call us Monday-Saturday, 9 AM - 6 PM</p>
          <a
            href="tel:+918040404040"
            className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark font-semibold hover:scale-105 transition-transform inline-block text-center"
          >
            +91 80 4040 4040
          </a>
        </div>

        {/* Email Support */}
        <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-30 hover:border-opacity-100 transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-warning-yellow to-electric-cyan flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary-dark" />
            </div>
            <h3 className="text-lg font-semibold text-text-light">Email Support</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">We'll respond within 24 hours</p>
          <a
            href="mailto:support@shenergy.com"
            className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold hover:bg-opacity-50 transition-all inline-block text-center"
          >
            support@shenergy.com
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-text-light mb-6">Frequently Asked Questions</h2>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light placeholder-gray-500 focus:border-opacity-100 focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className="glass-card-dark rounded-lg border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-card-dark transition-colors"
                >
                  <div className="text-left flex-1">
                    <span className="badge badge-info text-xs mb-2 inline-block">{faq.category}</span>
                    <p className="font-semibold text-text-light">{faq.question}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-electric-blue transition-transform flex-shrink-0 ml-4 ${
                      expandedFAQ === faq.id ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedFAQ === faq.id && (
                  <div className="px-6 py-4 border-t border-electric-blue border-opacity-20 bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-5">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No FAQs found matching your search</p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 p-8 rounded-xl bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-10 border border-electric-blue border-opacity-40">
          <h3 className="text-xl font-bold text-text-light mb-3">Still need help?</h3>
          <p className="text-gray-300 mb-6">
            Can't find the answer you're looking for? Our support team is here to help. Contact us through any of the channels above.
          </p>
          <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-green to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
            Contact Support Team
          </button>
        </div>
      </div>
    </div>
  )
}
