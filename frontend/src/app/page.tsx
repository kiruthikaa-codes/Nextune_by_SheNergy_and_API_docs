'use client'

import { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, Car } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/services/api'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { setCustomer } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'customer' | 'dealership'>('customer')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username || !password) {
      setError('Please enter username and password')
      return
    }

    if (userType === 'dealership') {
      // Prototype: bypass backend auth for dealership and go directly to admin dashboard
      router.push('/admin/dashboard')
      return
    }

    try {
      setLoading(true)
      const result = await api.login({ username, password }) as any

      if (!result?.customer) {
        setError('Login failed. Please try again.')
        return
      }

      setCustomer(result.customer)
      router.push('/customer/home')
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-primary-dark via-primary-dark to-card-dark">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Logo/Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center">
                <Car className="w-6 h-6 text-primary-dark" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-electric-cyan">
                Nextune
              </h1>
            </div>
            <p className="text-text-light text-sm">Nextune - Intelligent Vehicle Services</p>
          </div>

          {/* User Type Toggle */}
          <div className="flex gap-2 mb-8 bg-card-dark rounded-lg p-1 border border-electric-blue border-opacity-30">
            <button
              onClick={() => setUserType('customer')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                userType === 'customer'
                  ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                  : 'text-gray-400 hover:text-text-light'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setUserType('dealership')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-300 ${
                userType === 'dealership'
                  ? 'bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark shadow-glow'
                  : 'text-gray-400 hover:text-text-light'
              }`}
            >
              Dealership
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-light mb-2">
                Username
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-blue opacity-50" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 focus:border-electric-blue focus:border-opacity-100 focus:ring-2 focus:ring-electric-blue focus:ring-opacity-20 text-text-light placeholder-gray-500 transition-all duration-300 outline-none"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-light mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-electric-blue opacity-50" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 focus:border-electric-blue focus:border-opacity-100 focus:ring-2 focus:ring-electric-blue focus:ring-opacity-20 text-text-light placeholder-gray-500 transition-all duration-300 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-electric-blue opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-electric-blue bg-card-dark accent-electric-blue"
                />
                <span className="text-sm text-gray-400">Remember me</span>
              </label>
              <Link href="#" className="text-sm text-electric-blue hover:text-electric-cyan transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-electric-blue to-electric-cyan text-primary-dark font-semibold shadow-glow hover:shadow-lg hover:scale-105 transition-all duration-300 transform disabled:opacity-60 disabled:hover:scale-100"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && (
              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent opacity-30"></div>
            <span className="text-xs text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent opacity-30"></div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2 px-4 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 hover:border-opacity-100 text-text-light font-medium transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="py-2 px-4 rounded-lg bg-card-dark border border-electric-blue border-opacity-30 hover:border-opacity-100 text-text-light font-medium transition-all duration-300 flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24h-8.8c-1.32 0-2.4-1.08-2.4-2.4v-19.2c0-1.32 1.08-2.4 2.4-2.4h19.2c1.32 0 2.4 1.08 2.4 2.4v19.2c0 1.32-1.08 2.4-2.4 2.4h-8.8v-8.4h2.82l.42-3.28h-3.24v-2.1c0-.95.26-1.6 1.63-1.6h1.73v-2.93c-.3-.04-1.34-.13-2.55-.13-2.52 0-4.25 1.54-4.25 4.37v2.42h-2.85v3.28h2.85v8.4z" />
              </svg>
              Microsoft
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="#" className="text-electric-blue hover:text-electric-cyan font-medium transition-colors">
              Contact your administrator
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-card-dark to-primary-dark items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJyZ2JhKDAsIDIyOSwgMjU1LCAwLjUpIi8+PC9zdmc+')]"></div>
        </div>

        {/* Animated Gradient Orb */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-electric-blue to-electric-cyan rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-electric-cyan to-neon-green rounded-full opacity-10 blur-3xl animate-pulse"></div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-electric-blue to-electric-cyan rounded-full blur-2xl opacity-30"></div>
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-primary-dark flex items-center justify-center">
                  <svg className="w-16 h-16 text-electric-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-text-light mb-4">Predictive Maintenance</h2>
          <p className="text-gray-300 mb-8">
            AI-powered vehicle health monitoring and intelligent parts orchestration
          </p>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-electric-cyan flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-light">Real-time Monitoring</h3>
                <p className="text-sm text-gray-400">24/7 vehicle health tracking</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-green to-electric-cyan flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-light">Smart Scheduling</h3>
                <p className="text-sm text-gray-400">Automated service appointments</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-cyan to-electric-blue flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-light">Parts Optimization</h3>
                <p className="text-sm text-gray-400">Seamless parts availability</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
