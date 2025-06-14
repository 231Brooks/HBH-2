import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { PropertyImageUpload } from '@/components/property-image-upload'

// Mock fetch
global.fetch = jest.fn()

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

describe('PropertyImageUpload', () => {
  const mockOnImagesChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: 'https://example.com/image.jpg' }),
    })
  })

  it('renders upload area correctly', () => {
    render(
      <PropertyImageUpload
        onImagesChange={mockOnImagesChange}
        maxImages={5}
        maxSizePerImage={5}
      />
    )

    expect(screen.getByText('Property Photos')).toBeInTheDocument()
    expect(screen.getByText('Click to upload photos')).toBeInTheDocument()
    expect(screen.getByText('PNG, JPG, GIF up to 5MB each')).toBeInTheDocument()
  })

  it('shows correct maximum images message', () => {
    render(
      <PropertyImageUpload
        onImagesChange={mockOnImagesChange}
        maxImages={3}
        maxSizePerImage={2}
      />
    )

    expect(screen.getByText(/Maximum 3 photos/)).toBeInTheDocument()
    expect(screen.getAllByText(/2MB each/)).toHaveLength(2) // Should appear in description and upload area
  })
})
