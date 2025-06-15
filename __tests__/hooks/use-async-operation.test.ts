/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { useAsyncOperation, useFormSubmission } from '@/hooks/use-async-operation'

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}))

describe('useAsyncOperation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useAsyncOperation())

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should handle successful async operation', async () => {
    const { result } = renderHook(() => useAsyncOperation())
    const mockOperation = jest.fn().mockResolvedValue('success data')

    await act(async () => {
      const response = await result.current.execute(mockOperation)
      expect(response).toBe('success data')
    })

    expect(result.current.data).toBe('success data')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(mockOperation).toHaveBeenCalledTimes(1)
  })

  it('should handle failed async operation', async () => {
    const { result } = renderHook(() => useAsyncOperation())
    const mockError = new Error('Operation failed')
    const mockOperation = jest.fn().mockRejectedValue(mockError)

    await act(async () => {
      const response = await result.current.execute(mockOperation)
      expect(response).toBeNull()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(mockError)
    expect(mockOperation).toHaveBeenCalledTimes(1)
  })

  it('should set loading state during operation', async () => {
    const { result } = renderHook(() => useAsyncOperation())
    let resolveOperation: (value: string) => void
    const mockOperation = jest.fn().mockImplementation(() => 
      new Promise<string>((resolve) => {
        resolveOperation = resolve
      })
    )

    // Start the operation
    act(() => {
      result.current.execute(mockOperation)
    })

    // Check loading state
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()

    // Resolve the operation
    await act(async () => {
      resolveOperation!('success')
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.data).toBe('success')
  })

  it('should call success callback on successful operation', async () => {
    const onSuccess = jest.fn()
    const { result } = renderHook(() => 
      useAsyncOperation({ onSuccess, successMessage: 'Success!' })
    )
    const mockOperation = jest.fn().mockResolvedValue('success data')

    await act(async () => {
      await result.current.execute(mockOperation)
    })

    expect(onSuccess).toHaveBeenCalledWith('success data')
  })

  it('should call error callback on failed operation', async () => {
    const onError = jest.fn()
    const { result } = renderHook(() => 
      useAsyncOperation({ onError })
    )
    const mockError = new Error('Operation failed')
    const mockOperation = jest.fn().mockRejectedValue(mockError)

    await act(async () => {
      await result.current.execute(mockOperation)
    })

    expect(onError).toHaveBeenCalledWith(mockError)
  })

  it('should reset state correctly', () => {
    const { result } = renderHook(() => useAsyncOperation())

    // Set some state
    act(() => {
      result.current.reset()
    })

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})

describe('useFormSubmission', () => {
  it('should use correct default messages', async () => {
    const { result } = renderHook(() => useFormSubmission())
    const mockOperation = jest.fn().mockResolvedValue('form data')

    await act(async () => {
      await result.current.execute(mockOperation)
    })

    expect(result.current.data).toBe('form data')
  })

  it('should handle form submission errors', async () => {
    const { result } = renderHook(() => useFormSubmission())
    const mockError = new Error('Validation failed')
    const mockOperation = jest.fn().mockRejectedValue(mockError)

    await act(async () => {
      const response = await result.current.execute(mockOperation)
      expect(response).toBeNull()
    })

    expect(result.current.error).toBe(mockError)
  })
})
