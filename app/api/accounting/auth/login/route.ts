import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createJWTToken } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }
    
    // Get user from database
    const { data: user, error } = await supabaseAdmin
      .from('accounting_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Verify password (assuming password_hash field exists)
    // In production, you should use proper password hashing like bcrypt
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex')
    
    if (user.password_hash !== passwordHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    
    // Update last login
    await supabaseAdmin
      .from('accounting_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id)
    
    // Create JWT token
    const token = createJWTToken(user.id)
    
    // Log login
    await supabaseAdmin
      .from('accounting_access_logs')
      .insert([{
        user_id: user.id,
        action: 'login',
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      }])
    
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 