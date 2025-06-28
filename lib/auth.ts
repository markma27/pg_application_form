import { NextRequest } from 'next/server'
import { supabaseAdmin } from './supabase'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export interface AccountingUser {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
  last_login?: string
}

export interface AuthResult {
  valid: boolean
  userId?: string
  user?: AccountingUser
  error?: string
}

export async function verifyAccountingTeamAuth(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization')
  const apiKey = request.headers.get('x-api-key')
  
  // Method 1: JWT Token
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const decoded = jwt.verify(token, process.env.ACCOUNTING_JWT_SECRET!) as any
      const { data: user, error } = await supabaseAdmin
        .from('accounting_users')
        .select('*')
        .eq('id', decoded.userId)
        .eq('is_active', true)
        .single()
      
      if (error || !user) {
        return { valid: false, error: 'Invalid user or user inactive' }
      }
      
      return { valid: true, userId: user.id, user }
    } catch (error) {
      console.error('JWT verification failed:', error)
      return { valid: false, error: 'Invalid JWT token' }
    }
  }
  
  // Method 2: API Key
  if (apiKey) {
    const keyHash = hashApiKey(apiKey)
    const { data: apiKeyRecord, error } = await supabaseAdmin
      .from('accounting_api_keys')
      .select('*')
      .eq('key_hash', keyHash)
      .eq('is_active', true)
      .single()
    
    if (error || !apiKeyRecord) {
      return { valid: false, error: 'Invalid API key' }
    }
    
    // Update last used timestamp
    await supabaseAdmin
      .from('accounting_api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', apiKeyRecord.id)
    
    return { valid: true, userId: apiKeyRecord.user_id, user: apiKeyRecord }
  }
  
  return { valid: false, error: 'No valid authentication provided' }
}

export function hashApiKey(apiKey: string): string {
  return crypto.createHash('sha256').update(apiKey).digest('hex')
}

export function generateApiKey(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function createJWTToken(userId: string): string {
  return jwt.sign(
    { userId, role: 'accounting_team' },
    process.env.ACCOUNTING_JWT_SECRET!,
    { expiresIn: '24h' }
  )
}

export async function logAccountingAccess(
  applicationId: string, 
  userId: string, 
  action: string = 'view',
  request?: NextRequest
) {
  try {
    await supabaseAdmin
      .from('accounting_access_logs')
      .insert([{
        application_id: applicationId,
        user_id: userId,
        action,
        ip_address: request?.headers.get('x-forwarded-for') || 
                   request?.headers.get('x-real-ip') || 
                   'unknown',
        user_agent: request?.headers.get('user-agent') || 'unknown'
      }])
  } catch (error) {
    console.error('Failed to log accounting access:', error)
  }
} 