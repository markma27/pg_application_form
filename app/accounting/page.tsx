'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAutoLogout } from './login/page'

interface Application {
  id: string
  reference_number: string
  entity_name: string
  entity_type: string
  contact_email: string
  submitted_at: string
  created_at: string
}

// 日期格式化函数
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

// 首字母大写函数
function capitalizeFirstLetter(str: string) {
  // 特殊情况处理
  const specialCases: { [key: string]: string } = {
    'smsf': 'SMSF',
    'tfn': 'TFN',
    'abn': 'ABN',
    'acn': 'ACN'
  };

  const lowerStr = str.toLowerCase();
  if (specialCases[lowerStr]) {
    return specialCases[lowerStr];
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export default function AccountingPortal() {
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalApplications, setTotalApplications] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState('')

  // 使用自动登出 hook
  useAutoLogout(router);

  const checkAuth = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accounting_token')
      const userData = localStorage.getItem('accounting_user')
      
      if (!token || !userData) {
        router.push('/accounting/login')
        return
      }
      
      setUser(JSON.parse(userData))
    }
  }, [router])

  const fetchApplications = useCallback(async () => {
    try {
      const response = await fetch('/api/accounting/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accounting_token')}`
        }
      })

      if (response.status === 401) {
        localStorage.removeItem('accounting_token')
        localStorage.removeItem('accounting_user')
        router.push('/accounting/login')
        return
      }
      
      const data = await response.json()
      setApplications(data.applications || [])
      setTotalApplications(data.pagination?.total || 0)
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (user) {
      fetchApplications()
    }
  }, [user, fetchApplications])

  const handleViewDetails = (id: string) => {
    router.push(`/accounting/applications/${id}`)
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accounting_token')
      localStorage.removeItem('accounting_user')
      router.push('/accounting/login')
    }
  }

  // 过滤应用列表
  const filteredApplications = applications.filter(app => 
    app.entity_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.contact_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!user) {
    return null // 或者显示加载状态
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Image
              src="/logo.svg"
              alt="PortfolioGuardian Logo"
              width={200}
              height={50}
              className="rounded-lg"
              priority
            />
            <h1 className="ml-4 text-2xl font-semibold text-gray-900">Accounting Portal</h1>
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-4">Welcome, {user?.name || 'Admin User'}</span>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search and Count */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by entity name, email, reference number..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-portfolio-green-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="ml-4 text-gray-600">
            {filteredApplications.length} total applications
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr
                  key={application.id}
                  onClick={() => router.push(`/accounting/applications/${application.id}`)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {application.reference_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.entity_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {capitalizeFirstLetter(application.entity_type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.contact_email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(application.submitted_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 