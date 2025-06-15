/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { useAsyncOperation } from '@/hooks/use-async-operation'

// Mock fetch for API calls
global.fetch = jest.fn()
const mockFetch = fetch as jest.MockedFunction<typeof fetch>

// Mock toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

describe('Bidding System Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Bid Placement', () => {
    it('should place a valid bid successfully', async () => {
      const mockBidResponse = {
        id: 'bid-123',
        amount: 550000,
        property_id: 'prop-123',
        user_id: 'user-123',
        created_at: '2024-01-01T00:00:00Z',
        status: 'active'
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockBidResponse })
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      const bidData = {
        property_id: 'prop-123',
        amount: 550000
      }

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/place-bid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bidData)
          })
          return res.json()
        })

        expect(response.success).toBe(true)
        expect(response.data).toEqual(mockBidResponse)
      })

      expect(mockFetch).toHaveBeenCalledWith('/api/bidding/place-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bidData)
      })
    })

    it('should reject bid below minimum amount', async () => {
      const mockErrorResponse = {
        success: false,
        error: 'Bid amount must be higher than current bid'
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      const bidData = {
        property_id: 'prop-123',
        amount: 100000 // Too low
      }

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/place-bid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bidData)
          })
          
          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error)
          }
          
          return res.json()
        })

        expect(response).toBeNull()
      })

      expect(result.current.error?.message).toBe('Bid amount must be higher than current bid')
    })

    it('should handle bid on expired auction', async () => {
      const mockErrorResponse = {
        success: false,
        error: 'Auction has ended'
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockErrorResponse
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      const bidData = {
        property_id: 'expired-prop-123',
        amount: 550000
      }

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/place-bid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bidData)
          })
          
          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error)
          }
          
          return res.json()
        })

        expect(response).toBeNull()
      })

      expect(result.current.error?.message).toBe('Auction has ended')
    })
  })

  describe('Bid History', () => {
    it('should fetch bid history for property', async () => {
      const mockBidHistory = [
        {
          id: 'bid-1',
          amount: 500000,
          user_id: 'user-1',
          created_at: '2024-01-01T10:00:00Z',
          user: { name: 'John Doe' }
        },
        {
          id: 'bid-2',
          amount: 525000,
          user_id: 'user-2',
          created_at: '2024-01-01T11:00:00Z',
          user: { name: 'Jane Smith' }
        }
      ]

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockBidHistory })
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/history/prop-123')
          return res.json()
        })

        expect(response.success).toBe(true)
        expect(response.data).toEqual(mockBidHistory)
        expect(response.data).toHaveLength(2)
      })
    })

    it('should handle empty bid history', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] })
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/history/new-prop-123')
          return res.json()
        })

        expect(response.success).toBe(true)
        expect(response.data).toEqual([])
      })
    })
  })

  describe('Current Bid Status', () => {
    it('should fetch current highest bid', async () => {
      const mockCurrentBid = {
        id: 'bid-latest',
        amount: 575000,
        user_id: 'user-3',
        property_id: 'prop-123',
        created_at: '2024-01-01T12:00:00Z',
        user: { name: 'Bob Wilson' }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockCurrentBid })
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/current/prop-123')
          return res.json()
        })

        expect(response.success).toBe(true)
        expect(response.data).toEqual(mockCurrentBid)
        expect(response.data.amount).toBe(575000)
      })
    })

    it('should handle property with no bids', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: null })
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/current/no-bids-prop-123')
          return res.json()
        })

        expect(response.success).toBe(true)
        expect(response.data).toBeNull()
      })
    })
  })

  describe('Bid Validation', () => {
    it('should validate bid increment requirements', async () => {
      const mockValidationResponse = {
        success: false,
        error: 'Bid must be at least $5,000 higher than current bid'
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => mockValidationResponse
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      const bidData = {
        property_id: 'prop-123',
        amount: 501000 // Only $1,000 higher than current $500,000
      }

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bidData)
          })
          
          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error)
          }
          
          return res.json()
        })

        expect(response).toBeNull()
      })

      expect(result.current.error?.message).toBe('Bid must be at least $5,000 higher than current bid')
    })

    it('should validate user authentication for bidding', async () => {
      const mockAuthError = {
        success: false,
        error: 'Authentication required'
      }

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => mockAuthError
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      const bidData = {
        property_id: 'prop-123',
        amount: 550000
      }

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/place-bid', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bidData)
          })
          
          if (!res.ok) {
            const errorData = await res.json()
            throw new Error(errorData.error)
          }
          
          return res.json()
        })

        expect(response).toBeNull()
      })

      expect(result.current.error?.message).toBe('Authentication required')
    })
  })

  describe('Auction End Handling', () => {
    it('should handle auction ending and winner determination', async () => {
      const mockAuctionEndResponse = {
        success: true,
        data: {
          property_id: 'prop-123',
          winning_bid: {
            id: 'bid-winner',
            amount: 600000,
            user_id: 'user-winner',
            user: { name: 'Winner User', email: 'winner@example.com' }
          },
          ended_at: '2024-01-01T18:00:00Z'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuctionEndResponse
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/end-auction/prop-123', {
            method: 'POST'
          })
          return res.json()
        })

        expect(response.success).toBe(true)
        expect(response.data.winning_bid.amount).toBe(600000)
        expect(response.data.winning_bid.user.name).toBe('Winner User')
      })
    })

    it('should handle auction with no bids', async () => {
      const mockNoBidsResponse = {
        success: true,
        data: {
          property_id: 'prop-no-bids',
          winning_bid: null,
          ended_at: '2024-01-01T18:00:00Z',
          message: 'Auction ended with no bids'
        }
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockNoBidsResponse
      } as Response)

      const { result } = renderHook(() => useAsyncOperation())

      await act(async () => {
        const response = await result.current.execute(async () => {
          const res = await fetch('/api/bidding/end-auction/prop-no-bids', {
            method: 'POST'
          })
          return res.json()
        })

        expect(response.success).toBe(true)
        expect(response.data.winning_bid).toBeNull()
        expect(response.data.message).toBe('Auction ended with no bids')
      })
    })
  })
})
