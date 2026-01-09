'use client'

import NextuneAssist from '@/components/SheNergyAssistV3'

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-light mb-2">Nextune Assist</h1>
          <p className="text-gray-400">Your AI-powered vehicle service companion</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center mb-4 shadow-glow">
              <span className="text-xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">AI Assistant</h3>
            <p className="text-sm text-gray-400">Get instant answers about your vehicle maintenance and services</p>
          </div>

          <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-green to-electric-cyan flex items-center justify-center mb-4 shadow-glow">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">Predictive Maintenance</h3>
            <p className="text-sm text-gray-400">Real-time vehicle health monitoring and maintenance predictions</p>
          </div>

          <div className="glass-card-dark p-6 rounded-xl border border-electric-blue border-opacity-20 hover:border-opacity-100 transition-all">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-warning-yellow to-orange-500 flex items-center justify-center mb-4 shadow-glow">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-text-light mb-2">Quick Booking</h3>
            <p className="text-sm text-gray-400">Find nearest service centers and book appointments instantly</p>
          </div>
        </div>

        {/* How to Use */}
        <div className="glass-card-dark p-8 rounded-2xl border border-electric-blue border-opacity-20 mb-12">
          <h2 className="text-2xl font-bold text-text-light mb-6">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Click the Chat Icon', desc: 'Open Nextune Assist from the bottom right' },
              { num: '2', title: 'Ask or Select', desc: 'Use quick replies or type your question' },
              { num: '3', title: 'Get Recommendations', desc: 'View maintenance alerts and dealership options' },
              { num: '4', title: 'Book Service', desc: 'Schedule your appointment in seconds' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center mx-auto mb-3 shadow-glow">
                  <span className="font-bold text-primary-dark">{step.num}</span>
                </div>
                <h3 className="font-semibold text-text-light mb-1">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-electric-blue to-electric-cyan bg-opacity-10 border border-electric-blue border-opacity-40 rounded-xl p-6 text-center">
          <p className="text-text-light mb-2">👉 Look for the glowing chat button in the bottom right corner</p>
          <p className="text-sm text-gray-400">Nextune Assist is available 24/7 to help you with your vehicle needs</p>
        </div>
      </div>

      {/* Chatbot Component */}
      <NextuneAssist />
    </div>
  )
}
