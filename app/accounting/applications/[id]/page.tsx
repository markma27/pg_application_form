'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

interface ApplicationData {
  id: string
  reference_number: string
  entity_name: string
  entity_type: string
  australian_business_number?: string
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

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user && applicationId) {
      fetchApplication()
    }
  }, [user, applicationId])

  const checkAuth = () => {
    const token = localStorage.getItem('accounting_token')
    const userData = localStorage.getItem('accounting_user')
    
    if (!token || !userData) {
      router.push('/accounting/login')
      return
    }
    
    setUser(JSON.parse(userData))
  }

  const fetchApplication = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/accounting/applications/${applicationId}`, {
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
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      setSubmittingNote(true)
      const response = await fetch('/api/accounting/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accounting_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'add_notes',
          applicationId,
          notes: newNote
        })
      })

      if (response.ok) {
        setNewNote('')
        fetchApplication() // Refresh to get the new note
      } else {
        console.error('Failed to add note')
      }
    } catch (error) {
      console.error('Error adding note:', error)
    } finally {
      setSubmittingNote(false)
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
                  <p className="mt-1 text-sm text-gray-900">{application.entity_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Entity Type</label>
                  <p className="mt-1 text-sm text-gray-900">{application.entity_type}</p>
                </div>
                {application.australian_business_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ABN</label>
                    <p className="mt-1 text-sm text-gray-900">{application.australian_business_number}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">GST Registered</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {application.is_registered_for_gst ? 'Yes' : 'No'}
                  </p>
                </div>
                {application.holder_identification_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Holder ID</label>
                    <p className="mt-1 text-sm text-gray-900">{application.holder_identification_number}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {application.street_address}<br />
                    {application.city}, {application.state} {application.post_code}
                  </p>
                </div>
              </div>

              {/* Trustee Information */}
              {application.trustee_type && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Trustee Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Trustee Type</label>
                      <p className="mt-1 text-sm text-gray-900">{application.trustee_type}</p>
                    </div>
                    {application.trustee_type === 'individual' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Trustee Name</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {application.trustee_individual_first_name} {application.trustee_individual_last_name}
                          </p>
                        </div>
                      </>
                    )}
                    {application.trustee_type === 'joint' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Joint Trustee 1</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {application.trustee_joint_first_name1} {application.trustee_joint_last_name1}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Joint Trustee 2</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {application.trustee_joint_first_name2} {application.trustee_joint_last_name2}
                          </p>
                        </div>
                      </>
                    )}
                    {application.trustee_type === 'corporate' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Corporate Trustee</label>
                          <p className="mt-1 text-sm text-gray-900">{application.trustee_corporate_name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">ACN</label>
                          <p className="mt-1 text-sm text-gray-900">{application.trustee_corporate_acn}</p>
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
                  <p className="mt-1 text-sm text-gray-900">
                    {application.main_contact_first_name} {application.main_contact_last_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <p className="mt-1 text-sm text-gray-900">{application.main_contact_role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{application.contact_email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{application.contact_phone}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
                  <p className="mt-1 text-sm text-gray-900">{application.main_contact_preferred_contact}</p>
                </div>
              </div>

              {application.has_secondary_contact && (
                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Secondary Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {application.secondary_first_name} {application.secondary_last_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <p className="mt-1 text-sm text-gray-900">{application.secondary_role}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{application.secondary_email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-sm text-gray-900">{application.secondary_phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Preferred Contact Method</label>
                      <p className="mt-1 text-sm text-gray-900">{application.secondary_preferred_contact}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Adviser Information */}
            {application.adviser_name && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Adviser Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Adviser Name</label>
                    <p className="mt-1 text-sm text-gray-900">{application.adviser_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Company</label>
                    <p className="mt-1 text-sm text-gray-900">{application.adviser_company_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{application.adviser_address}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{application.adviser_telephone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{application.adviser_email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Permissions</label>
                    <p className="mt-1 text-sm text-gray-900">
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
                  <p className="mt-1 text-sm text-gray-900">{application.annual_report}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Meeting Proxy</label>
                  <p className="mt-1 text-sm text-gray-900">{application.meeting_proxy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Investment Offers</label>
                  <p className="mt-1 text-sm text-gray-900">{application.investment_offers}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dividend Preference</label>
                  <p className="mt-1 text-sm text-gray-900">{application.dividend_preference}</p>
                </div>
              </div>
            </div>

            {/* Bank Account Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Name</label>
                  <p className="mt-1 text-sm text-gray-900">{application.account_name}</p>
                </div>
                {application.bank_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                    <p className="mt-1 text-sm text-gray-900">{application.bank_name}</p>
                  </div>
                )}
                {application.branch_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch</label>
                    <p className="mt-1 text-sm text-gray-900">{application.branch_name}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">BSB</label>
                  <p className="mt-1 text-sm text-gray-900">{application.bsb}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <p className="mt-1 text-sm text-gray-900">{application.account_number}</p>
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
                        <p className="text-sm font-medium text-gray-900">{doc.file_name}</p>
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
                    Add Note
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 