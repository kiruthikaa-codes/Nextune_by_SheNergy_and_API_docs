'use client'

import { Settings, Bell, Lock, User, Mail, Phone, MapPin, Save } from 'lucide-react'
import { useState } from 'react'

export default function CustomerSettingsPage() {
  const [formData, setFormData] = useState({
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    address: 'Bangalore, Karnataka 560001, India',
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {[
              { icon: User, label: 'Profile', id: 'profile' },
              { icon: Bell, label: 'Notifications', id: 'notifications' },
              { icon: Lock, label: 'Security', id: 'security' },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-400 hover:text-text-light hover:bg-card-dark hover:bg-opacity-50 transition-all"
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <div className="glass-card-dark p-8 rounded-xl border border-electric-blue border-opacity-20">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-electric-blue" />
              <h2 className="text-2xl font-bold text-text-light">Profile Information</h2>
            </div>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="glass-card-dark p-8 rounded-xl border border-electric-blue border-opacity-20">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-electric-blue" />
              <h2 className="text-2xl font-bold text-text-light">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-electric-blue"
                />
                <span className="text-text-light">Enable all notifications</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="emailAlerts"
                  checked={formData.emailAlerts}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-electric-blue"
                />
                <span className="text-text-light">Email alerts for appointments</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="smsAlerts"
                  checked={formData.smsAlerts}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-electric-blue"
                />
                <span className="text-text-light">SMS alerts for urgent issues</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:scale-105 transition-transform">
              <Save className="w-5 h-5" />
              Save Changes
            </button>
            <button className="px-6 py-3 rounded-lg bg-card-dark border border-electric-blue text-electric-blue font-semibold hover:bg-opacity-50 transition-all">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
