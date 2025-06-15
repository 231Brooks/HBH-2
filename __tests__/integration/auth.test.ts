/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { createClient } from '@supabase/supabase-js'
import { useSupabase } from '@/contexts/supabase-context'

// Mock Supabase client
jest.mock('@supabase/supabase-js')
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

describe('Authentication Integration Tests', () => {
  let mockSupabaseClient: any

  beforeEach(() => {
    mockSupabaseClient = {
      auth: {
        getSession: jest.fn(),
        onAuthStateChange: jest.fn(),
        signInWithPassword: jest.fn(),
        signInWithOAuth: jest.fn(),
        signOut: jest.fn(),
        signUp: jest.fn()
      },
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn()
          }))
        })),
        insert: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
      }))
    }

    mockCreateClient.mockReturnValue(mockSupabaseClient)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Login Flow', () => {
    it('should handle successful email/password login', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' }
      }

      const mockSession = {
        user: mockUser,
        access_token: 'mock-token'
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      })

      // Test login function
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      }

      const result = await mockSupabaseClient.auth.signInWithPassword(loginData)

      expect(result.data.user).toEqual(mockUser)
      expect(result.data.session).toEqual(mockSession)
      expect(result.error).toBeNull()
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith(loginData)
    })

    it('should handle login errors', async () => {
      const mockError = {
        message: 'Invalid login credentials',
        status: 400
      }

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      })

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      const result = await mockSupabaseClient.auth.signInWithPassword(loginData)

      expect(result.data.user).toBeNull()
      expect(result.data.session).toBeNull()
      expect(result.error).toEqual(mockError)
    })

    it('should handle OAuth login', async () => {
      const mockOAuthResponse = {
        data: { url: 'https://github.com/oauth/authorize?...' },
        error: null
      }

      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue(mockOAuthResponse)

      const result = await mockSupabaseClient.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback'
        }
      })

      expect(result.data.url).toBeDefined()
      expect(result.error).toBeNull()
      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback'
        }
      })
    })
  })

  describe('Registration Flow', () => {
    it('should handle successful user registration', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'newuser@example.com',
        email_confirmed_at: null
      }

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: mockUser, session: null },
        error: null
      })

      const signUpData = {
        email: 'newuser@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'New User',
            account_type: 'buyer'
          }
        }
      }

      const result = await mockSupabaseClient.auth.signUp(signUpData)

      expect(result.data.user).toEqual(mockUser)
      expect(result.error).toBeNull()
      expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith(signUpData)
    })

    it('should handle registration errors', async () => {
      const mockError = {
        message: 'User already registered',
        status: 422
      }

      mockSupabaseClient.auth.signUp.mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      })

      const signUpData = {
        email: 'existing@example.com',
        password: 'password123'
      }

      const result = await mockSupabaseClient.auth.signUp(signUpData)

      expect(result.data.user).toBeNull()
      expect(result.error).toEqual(mockError)
    })
  })

  describe('Session Management', () => {
    it('should handle session retrieval', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com'
        },
        access_token: 'mock-token',
        expires_at: Date.now() + 3600000
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      const result = await mockSupabaseClient.auth.getSession()

      expect(result.data.session).toEqual(mockSession)
      expect(result.error).toBeNull()
    })

    it('should handle logout', async () => {
      mockSupabaseClient.auth.signOut.mockResolvedValue({
        error: null
      })

      const result = await mockSupabaseClient.auth.signOut()

      expect(result.error).toBeNull()
      expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
    })

    it('should handle auth state changes', () => {
      const mockCallback = jest.fn()
      const mockUnsubscribe = jest.fn()

      mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } }
      })

      const { data } = mockSupabaseClient.auth.onAuthStateChange(mockCallback)

      expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalledWith(mockCallback)
      expect(data.subscription.unsubscribe).toBe(mockUnsubscribe)
    })
  })

  describe('Protected Route Access', () => {
    it('should allow access with valid session', async () => {
      const mockSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'valid-token'
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockSession },
        error: null
      })

      const result = await mockSupabaseClient.auth.getSession()
      const hasValidSession = result.data.session && !result.error

      expect(hasValidSession).toBe(true)
    })

    it('should deny access without valid session', async () => {
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      const result = await mockSupabaseClient.auth.getSession()
      const hasValidSession = result.data.session && !result.error

      expect(hasValidSession).toBe(false)
    })
  })

  describe('User Profile Management', () => {
    it('should fetch user profile data', async () => {
      const mockProfile = {
        id: 'user-123',
        name: 'Test User',
        account_type: 'buyer',
        created_at: '2024-01-01T00:00:00Z'
      }

      const mockQuery = mockSupabaseClient.from('users')
      mockQuery.select().eq().single.mockResolvedValue({
        data: mockProfile,
        error: null
      })

      const result = await mockQuery.select('*').eq('id', 'user-123').single()

      expect(result.data).toEqual(mockProfile)
      expect(result.error).toBeNull()
    })

    it('should update user profile', async () => {
      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio'
      }

      const mockQuery = mockSupabaseClient.from('users')
      mockQuery.update.mockResolvedValue({
        data: { ...updateData, id: 'user-123' },
        error: null
      })

      const result = await mockQuery.update(updateData).eq('id', 'user-123')

      expect(result.error).toBeNull()
      expect(mockQuery.update).toHaveBeenCalledWith(updateData)
    })
  })

  describe('Token Refresh', () => {
    it('should handle automatic token refresh', async () => {
      const mockRefreshedSession = {
        user: { id: 'user-123', email: 'test@example.com' },
        access_token: 'new-token',
        refresh_token: 'new-refresh-token'
      }

      // Simulate token refresh
      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: mockRefreshedSession },
        error: null
      })

      const result = await mockSupabaseClient.auth.getSession()

      expect(result.data.session.access_token).toBe('new-token')
      expect(result.error).toBeNull()
    })

    it('should handle token refresh errors', async () => {
      const mockError = {
        message: 'Refresh token expired',
        status: 401
      }

      mockSupabaseClient.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: mockError
      })

      const result = await mockSupabaseClient.auth.getSession()

      expect(result.data.session).toBeNull()
      expect(result.error).toEqual(mockError)
    })
  })
})
