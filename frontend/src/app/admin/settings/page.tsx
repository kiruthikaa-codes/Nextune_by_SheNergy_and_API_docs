'use client'

import { Settings, Building2, Users, Lock, Save, Bell } from 'lucide-react'
import { useState } from 'react'

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    dealershipName: 'Bangalore EV Service Center',
    address: 'Whitefield, Bangalore, Karnataka 560066, India',
    phone: '+91 80 4040 4040',
    email: 'contact@bangaloreev.com',
    businessHours: '9:00 AM - 7:00 PM',
    maxDailyAppointments: '20',
    notifyOnLowStock: true,
    autoAssignTechnicians: true,
    enableCustomerPortal: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-light mb-2">Settings</h1>
        <p className="text-gray-400">Manage dealership settings and preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {[
              { icon: Building2, label: 'Dealership Info', id: 'dealership' },
              { icon: Users, label: 'Team Management', id: 'team' },
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
          {/* Dealership Info Section */}
          <div className="glass-card-dark p-8 rounded-xl border border-electric-blue border-opacity-20">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-6 h-6 text-electric-blue" />
              <h2 className="text-2xl font-bold text-text-light">Dealership Information</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Dealership Name</label>
                <input
                  type="text"
                  name="dealershipName"
                  value={formData.dealershipName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Business Hours</label>
                  <input
                    type="text"
                    name="businessHours"
                    value={formData.businessHours}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Max Daily Appointments</label>
                  <input
                    type="number"
                    name="maxDailyAppointments"
                    value={formData.maxDailyAppointments}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 text-text-light focus:outline-none focus:border-opacity-100 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="glass-card-dark p-8 rounded-xl border border-electric-blue border-opacity-20">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-electric-blue" />
              <h2 className="text-2xl font-bold text-text-light">Preferences</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="notifyOnLowStock"
                  checked={formData.notifyOnLowStock}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-electric-blue"
                />
                <span className="text-text-light">Notify me when parts stock is low</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="autoAssignTechnicians"
                  checked={formData.autoAssignTechnicians}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-electric-blue"
                />
                <span className="text-text-light">Auto-assign technicians to appointments</span>
              </label>

              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="enableCustomerPortal"
                  checked={formData.enableCustomerPortal}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-electric-blue"
                />
                <span className="text-text-light">Enable customer self-service portal</span>
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
