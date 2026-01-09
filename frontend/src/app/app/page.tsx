import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Car Hologram */}
      <div className="w-full md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-card-dark opacity-90"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-4 bg-gradient-to-r from-electric-blue to-transparent opacity-20 rounded-full blur-xl"></div>
            <div className="relative bg-card-dark bg-opacity-50 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-opacity-20 border-electric-blue">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-electric-blue to-electric-cyan">
                  Unified Predictive Service
                </h1>
                <p className="mt-2 text-gray-300">Intelligent Vehicle Maintenance & Parts Orchestration</p>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email or Phone
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-card-dark border border-gray-700 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue focus:ring-opacity-50 text-white placeholder-gray-400 transition duration-200"
                    placeholder="Enter your email or phone"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-card-dark border border-gray-700 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue focus:ring-opacity-50 text-white placeholder-gray-400 transition duration-200"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center
                  ">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-gray-600 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-sm">
                    <a href="#" className="font-medium text-electric-blue hover:text-electric-cyan transition-colors">
                      Forgot password?
                    </a>
                  </div>
                </div>
                
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full glow-button primary flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-primary-dark bg-gradient-to-r from-electric-blue to-electric-cyan hover:from-electric-cyan hover:to-electric-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-blue transition-all duration-300 transform hover:scale-105"
                  >
                    Sign in
                  </button>
                </div>
              </form>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card-dark text-gray-400">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div>
                    <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-card-dark text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                      <span className="sr-only">Sign in with Google</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                      </svg>
                    </a>
                  </div>
                  
                  <div>
                    <a href="#" className="w-full inline-flex justify-center py-2 px-4 border border-gray-700 rounded-lg shadow-sm bg-card-dark text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors">
                      <span className="sr-only">Sign in with Microsoft</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 23 23">
                        <path d="M11.5 11.5H1V1h10.5v10.5zm0 10.5H1V13h10.5v9zM23 11.5H12.5V1H23v10.5zm0 10.5H12.5V13H23v9z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-card-dark text-sm text-gray-400">
                      <button className="font-medium text-electric-blue hover:text-electric-cyan transition-colors">
                        Switch to Dealership Login
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Car Hologram */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary-dark to-card-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyMjksMjI5LDIyOSwwLjA1KSI+PC9yZWN0PjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSI+PC9yZWN0Pjwvc3ZnPg==')]"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-2xl">
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue to-electric-cyan rounded-full blur opacity-75"></div>
              <div className="relative flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-electric-blue to-electric-cyan text-primary-dark text-4xl font-bold">
                UP
              </div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-4">Predictive Maintenance</h2>
          <p className="text-xl text-gray-300 mb-8">
            AI-powered vehicle health monitoring and predictive maintenance solutions
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-electric-blue to-electric-cyan flex items-center justify-center text-primary-dark">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Monitoring</h3>
              <p className="text-gray-300 text-sm">24/7 vehicle health tracking and alerts</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-electric-blue to-electric-cyan flex items-center justify-center text-primary-dark">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Scheduling</h3>
              <p className="text-gray-300 text-sm">Automated service appointments</p>
            </div>
            
            <div className="glass-card p-6 rounded-xl">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-electric-blue to-electric-cyan flex items-center justify-center text-primary-dark">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Parts Optimization</h3>
              <p className="text-gray-300 text-sm">Seamless parts availability</p>
            </div>
          </div>
          
          <div className="mt-12">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <a href="#" className="text-electric-blue hover:text-electric-cyan font-medium transition-colors">
                Contact your administrator
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
