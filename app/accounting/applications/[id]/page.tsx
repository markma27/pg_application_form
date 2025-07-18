'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useAutoLogout } from '@/app/hooks/useAutoLogout'

interface ApplicationData {
  id: string
  reference_number: string
  entity_name: string
  entity_type: string
  australian_business_number?: string
  australian_company_number?: string
  is_registered_for_gst: boolean
  holder_identification_number?: string
  tax_file_number?: string
  street_address: string
  city: string
  state: string
  post_code: string
  trustee_type?: string
  trustee_individual_first_name?: string
  trustee_individual_last_name?: string
  trustee_joint_first_name1?: string
  trustee_joint_last_name1?: string
  trustee_joint_first_name2?: string
  trustee_joint_last_name2?: string
  trustee_corporate_name?: string
  trustee_corporate_acn?: string
  main_contact_first_name: string
  main_contact_last_name: string
  main_contact_role: string
  contact_email: string
  contact_phone: string
  main_contact_preferred_contact: string
  has_secondary_contact: boolean
  secondary_first_name?: string
  secondary_last_name?: string
  secondary_role?: string
  secondary_email?: string
  secondary_phone?: string
  secondary_preferred_contact?: string
  fatca_crs_owners?: Array<{
    fullLegalName: string
    residentialAddress: string
    dateOfBirth: string
    position: string
    ownershipPercentage: string
    countryOfTaxResidence: string
    taxFileNumber: string
  }>
  adviser_name?: string
  adviser_company_name?: string
  adviser_address?: string
  adviser_telephone?: string
  adviser_email?: string
  adviser_is_primary_contact: boolean
  adviser_can_access_statements: boolean
  adviser_can_deal_direct: boolean
  annual_report?: string
  meeting_proxy?: string
  investment_offers?: string
  dividend_preference?: string
  account_name?: string
  bank_name?: string
  branch_name?: string
  account_number?: string
  bsb?: string
  submitted_at: string
  created_at: string
  accounting_reviewed: boolean
  accounting_reviewed_at?: string
  accounting_status: string
  priority: string
  application_documents?: Array<{
    id: string
    document_type: string
    file_name: string
    file_size: number
    uploaded_at: string
  }>
  accounting_notes?: Array<{
    id: string
    notes: string
    created_at: string
    accounting_users: {
      name: string
    }
  }>
  signature1?: string
  date1?: string
  signature2?: string
  date2?: string
  final_signature?: string
  final_signature_date?: string
  has_acknowledged: boolean
  has_read_terms: boolean
  has_accepted_privacy: boolean
  has_confirmed_information: boolean
  privacy_policy_accepted: boolean
  terms_of_service_accepted: boolean
  data_processing_consent: boolean
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

// 文件大小格式化函数
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function ApplicationDetail() {
  const router = useRouter()
  const params = useParams()
  const applicationId = params.id as string
  
  const [application, setApplication] = useState<ApplicationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [newNote, setNewNote] = useState('')
  const [submittingNote, setSubmittingNote] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())

  // 自动登出功能
  useEffect(() => {
    let inactivityTimeout: NodeJS.Timeout;

    const resetInactivityTimer = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;
      const fifteenMinutes = 15 * 60 * 1000; // 15分钟转换为毫秒

      if (inactiveTime >= fifteenMinutes) {
        // 清除本地存储的登录信息
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accounting_token');
          localStorage.removeItem('accounting_user');
        }
        // 重定向到登录页面
        router.push('/accounting/login');
      }
    };

    // 设置定时器每分钟检查一次不活动状态
    const activityInterval = setInterval(checkInactivity, 60 * 1000);

    // 监听用户活动事件
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'keypress'
    ];

    // 添加所有活动事件监听器
    activityEvents.forEach(eventName => {
      document.addEventListener(eventName, resetInactivityTimer);
    });

    // 组件卸载时清理
    return () => {
      clearInterval(activityInterval);
      activityEvents.forEach(eventName => {
        document.removeEventListener(eventName, resetInactivityTimer);
      });
    };
  }, [lastActivity, router]);

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

  const fetchApplication = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/accounting/applications/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accounting_token') : ''}`
        }
      })
      
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accounting_token')
          localStorage.removeItem('accounting_user')
        }
        router.push('/accounting/login')
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        setApplication(data.data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to fetch application')
      }
    } catch (error) {
      console.error('Error fetching application:', error)
      setError('An error occurred while fetching the application')
    } finally {
      setLoading(false)
    }
  }, [applicationId, router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (user && applicationId) {
      fetchApplication()
    }
  }, [user, applicationId, fetchApplication])

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setSubmittingNote(true)
    try {
      const response = await fetch('/api/accounting/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accounting_token') : ''}`
        },
        body: JSON.stringify({
          action: 'add_notes',
          applicationId,
          notes: newNote
        })
      })

      if (response.ok) {
        setNewNote('')
        await fetchApplication()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to add note')
      }
    } catch (error) {
      console.error('Error adding note:', error)
      setError('An error occurred while adding the note')
    } finally {
      setSubmittingNote(false)
    }
  }

  const handleMarkReviewed = async () => {
    try {
      const response = await fetch('/api/accounting/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accounting_token') : ''}`
        },
        body: JSON.stringify({
          action: 'mark_reviewed',
          applicationId
        })
      })

      if (response.ok) {
        await fetchApplication()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to mark as reviewed')
      }
    } catch (error) {
      console.error('Error marking as reviewed:', error)
      setError('An error occurred while marking the application as reviewed')
    }
  }

  const handleBack = () => {
    router.push('/accounting')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application details...</p>
        </div>
      </div>
    )
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Application not found'}</p>
          <button
            onClick={handleBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <Image
                src="/logo.svg"
                alt="PortfolioGuardian Logo"
                width={120}
                height={30}
                className="rounded-lg"
              />
              <h1 className="ml-4 text-xl font-semibold text-gray-900">
                Application Details
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              Reference: {application.reference_number}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Entity Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Entity Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entity Name</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.entity_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entity Type</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{capitalizeFirstLetter(application.entity_type)}</p>
                </div>
                {application.australian_business_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ABN</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.australian_business_number}</p>
                  </div>
                )}
                {application.australian_company_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ACN</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.australian_company_number}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">GST Registered</label>
                  <p className="mt-1 text-sm font-medium text-green-600">
                    {application.is_registered_for_gst ? 'Yes' : 'No'}
                  </p>
                </div>
                {application.holder_identification_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Holder ID</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.holder_identification_number}</p>
                  </div>
                )}
                {application.tax_file_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tax File Number</label>
                    <p className="mt-1 text-sm font-medium text-green-600">
                      {application.tax_file_number}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm font-medium text-green-600">
                    {application.street_address}<br />
                    {application.city}, {application.state} {application.post_code}
                  </p>
                </div>
              </div>

              {/* Trustee Information */}
              {["trust", "smsf", "foundation"].includes(application.entity_type.toLowerCase()) && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Trustee Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trustee Type</label>
                      <p className="mt-1 text-sm font-medium text-green-600">
                        {application.trustee_type ? capitalizeFirstLetter(application.trustee_type) : '-'}
                      </p>
                    </div>
                    {application.trustee_type === 'individual' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Trustee Name</label>
                          <p className="mt-1 text-sm font-medium text-green-600">
                            {application.trustee_individual_first_name} {application.trustee_individual_last_name}
                          </p>
                        </div>
                      </>
                    )}
                    {application.trustee_type === 'joint' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Joint Trustee 1</label>
                          <p className="mt-1 text-sm font-medium text-green-600">
                            {application.trustee_joint_first_name1} {application.trustee_joint_last_name1}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Joint Trustee 2</label>
                          <p className="mt-1 text-sm font-medium text-green-600">
                            {application.trustee_joint_first_name2} {application.trustee_joint_last_name2}
                          </p>
                        </div>
                      </>
                    )}
                    {application.trustee_type === 'corporate' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Corporate Trustee</label>
                          <p className="mt-1 text-sm font-medium text-green-600">{application.trustee_corporate_name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">ACN</label>
                          <p className="mt-1 text-sm font-medium text-green-600">{application.trustee_corporate_acn}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Main Contact</label>
                  <p className="mt-1 text-sm font-medium text-green-600">
                    {application.main_contact_first_name} {application.main_contact_last_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.main_contact_role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.contact_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.contact_phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.main_contact_preferred_contact}</p>
                </div>
              </div>

              {application.has_secondary_contact && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Secondary Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm font-medium text-green-600">
                        {application.secondary_first_name} {application.secondary_last_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm font-medium text-green-600">{application.secondary_role}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm font-medium text-green-600">{application.secondary_email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm font-medium text-green-600">{application.secondary_phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
                      <p className="mt-1 text-sm font-medium text-green-600">{application.secondary_preferred_contact}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* FATCA/CRS Beneficial Owners (Step 4) */}
            {application.fatca_crs_owners && application.fatca_crs_owners.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  FATCA/CRS Beneficial Owners 
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({application.fatca_crs_owners.length} owner{application.fatca_crs_owners.length > 1 ? 's' : ''})
                  </span>
                </h2>
                <div className="space-y-6">
                  {application.fatca_crs_owners.map((owner, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-md font-semibold text-gray-900 mb-3">
                        Beneficial Owner {index + 1}
                        {owner.fullLegalName && (
                          <span className="ml-2 text-sm font-normal text-green-600">
                            - {owner.fullLegalName}
                          </span>
                        )}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {owner.fullLegalName && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Full Legal Name</label>
                            <p className="mt-1 text-sm font-medium text-green-600">{owner.fullLegalName}</p>
                          </div>
                        )}
                        {owner.residentialAddress && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Residential Address</label>
                            <p className="mt-1 text-sm font-medium text-green-600">{owner.residentialAddress}</p>
                          </div>
                        )}
                        {owner.dateOfBirth && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                            <p className="mt-1 text-sm font-medium text-green-600">{owner.dateOfBirth}</p>
                          </div>
                        )}
                        {owner.position && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Position</label>
                            <p className="mt-1 text-sm font-medium text-green-600">{owner.position}</p>
                          </div>
                        )}
                        {owner.ownershipPercentage && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Ownership Percentage</label>
                            <p className="mt-1 text-sm font-medium text-green-600">{owner.ownershipPercentage}%</p>
                          </div>
                        )}
                        {owner.countryOfTaxResidence && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Country of Tax Residence</label>
                            <p className="mt-1 text-sm font-medium text-green-600">{owner.countryOfTaxResidence}</p>
                          </div>
                        )}
                        {owner.taxFileNumber && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Tax File Number</label>
                            <p className="mt-1 text-sm font-medium text-green-600">{owner.taxFileNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Total Ownership Summary */}
                  {application.fatca_crs_owners.some(owner => owner.ownershipPercentage) && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Total Ownership Percentage:</span>
                        <span className="text-sm font-bold text-green-600">
                          {application.fatca_crs_owners
                            .filter(owner => owner.ownershipPercentage)
                            .reduce((total, owner) => total + parseFloat(owner.ownershipPercentage || '0'), 0)
                            .toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Adviser Information */}
            {application.adviser_name && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Adviser Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adviser Name</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.adviser_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.adviser_company_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.adviser_address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.adviser_telephone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.adviser_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Permissions</label>
                    <p className="mt-1 text-sm font-medium text-green-600">
                      {application.adviser_is_primary_contact && 'Primary Contact'}<br />
                      {application.adviser_can_access_statements && 'Can Access Statements'}<br />
                      {application.adviser_can_deal_direct && 'Can Deal Direct'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Investment Preferences */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Annual Report Delivery</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.annual_report}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Meeting Proxy</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.meeting_proxy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Investment Offers</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.investment_offers}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dividend Preference</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.dividend_preference}</p>
                </div>
              </div>
            </div>

            {/* Bank Account Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Name</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.account_name}</p>
                </div>
                {application.bank_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.bank_name}</p>
                  </div>
                )}
                {application.branch_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.branch_name}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">BSB</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.bsb}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.account_number}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Signature</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.signature1 || 'Not provided'}</p>
                  <p className="text-xs text-gray-500">
                    {application.date1 ? new Date(application.date1).toLocaleString('en-AU', {
                      timeZone: 'Australia/Sydney',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }) : ''}
                  </p>
                </div>
                {application.signature2 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Second Signature</label>
                    <p className="mt-1 text-sm font-medium text-green-600">{application.signature2}</p>
                    <p className="text-xs text-gray-500">
                      {application.date2 ? new Date(application.date2).toLocaleString('en-AU', {
                        timeZone: 'Australia/Sydney',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      }) : ''}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Direct Debit Authority Confirmations */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Direct Debit Authority Confirmations</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className={`w-4 h-4 mr-2 ${application.has_acknowledged ? 'text-green-600' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">Acknowledged and Agreed to Direct Debit Authority Terms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures and Consent */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Final Signature and Consent</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Final Signature</label>
                  <p className="mt-1 text-sm font-medium text-green-600">{application.final_signature || 'Not provided'}</p>
                  <p className="text-xs text-gray-500">
                    {application.final_signature_date ? new Date(application.final_signature_date).toLocaleString('en-AU', {
                      timeZone: 'Australia/Sydney',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    }) : ''}
                  </p>
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Confirmations</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${application.has_acknowledged ? 'text-green-600' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Acknowledged Application</span>
                    </div>
                    <div className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${application.has_read_terms ? 'text-green-600' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Read Terms and Conditions</span>
                    </div>
                    <div className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${application.has_accepted_privacy ? 'text-green-600' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Accepted Privacy Policy</span>
                    </div>
                    <div className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${application.has_confirmed_information ? 'text-green-600' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Confirmed Information Accuracy</span>
                    </div>
                    <div className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${application.privacy_policy_accepted ? 'text-green-600' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Privacy Policy Accepted</span>
                    </div>
                    <div className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${application.terms_of_service_accepted ? 'text-green-600' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Terms of Service Accepted</span>
                    </div>
                    <div className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${application.data_processing_consent ? 'text-green-600' : 'text-gray-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-gray-600">Data Processing Consent Given</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            {application.application_documents && application.application_documents.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
                <div className="space-y-4">
                  {application.application_documents.map((doc) => (
                    <div key={doc.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-green-600">{doc.file_name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.document_type} • {formatFileSize(doc.file_size)} • 
                          Uploaded {formatDate(doc.uploaded_at)}
                        </p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Status</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(application.submitted_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(application.created_at)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      application.accounting_reviewed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.accounting_reviewed ? 'Reviewed' : 'Pending Review'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>
              <div className="space-y-4">
                <div>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                  <button
                    onClick={handleAddNote}
                    className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {submittingNote ? 'Adding...' : 'Add Note'}
                  </button>
                </div>
                <div className="space-y-3">
                  {application.accounting_notes?.map((note) => (
                    <div key={note.id} className="border-b border-gray-200 pb-3">
                      <p className="text-sm text-gray-900">{note.notes}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {note.accounting_users.name} • {formatDate(note.created_at)}
                      </p>
                    </div>
                  ))}
                  {(!application.accounting_notes || application.accounting_notes.length === 0) && (
                    <p className="text-sm text-gray-500">No notes yet</p>
                  )}
                </div>
                {!application.accounting_reviewed && (
                  <button
                    onClick={handleMarkReviewed}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                  >
                    Mark as Reviewed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 