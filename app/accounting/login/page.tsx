'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// 创建一个可重用的自动登出 hook
export function useAutoLogout(router: any) {
  const [lastActivity, setLastActivity] = useState(Date.now())

  useEffect(() => {
    const resetInactivityTimer = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;
      const fifteenMinutes = 15 * 60 * 1000;

      if (inactiveTime >= fifteenMinutes && typeof window !== 'undefined') {
        localStorage.removeItem('accounting_token');
        localStorage.removeItem('accounting_user');
        router.push('/accounting/login');
      }
    };

    const activityInterval = setInterval(checkInactivity, 60 * 1000);

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'keypress'
    ];

    activityEvents.forEach(eventName => {
      document.addEventListener(eventName, resetInactivityTimer);
    });

    return () => {
      clearInterval(activityInterval);
      activityEvents.forEach(eventName => {
        document.removeEventListener(eventName, resetInactivityTimer);
      });
    };
  }, [lastActivity, router]);
}

export default function AccountingLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 使用自动登出 hook
  useAutoLogout(router);

  useEffect(() => {
    // 检查是否已登录
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accounting_token')
      if (token) {
        router.push('/accounting')
      }
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/accounting/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accounting_token', data.token)
          localStorage.setItem('accounting_user', JSON.stringify(data.user))
        }
        router.push('/accounting')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="PortfolioGuardian Logo"
            width={200}
            height={200}
            className="rounded-lg"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Accounting Team Portal
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access application data
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Secure Access Only
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                This portal is restricted to authorized accounting team members only.
                All access is logged and monitored for security purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 