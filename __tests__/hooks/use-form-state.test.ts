/**
 * @jest-environment jsdom
 */

import { renderHook, act } from '@testing-library/react'
import { z } from 'zod'
import { useFormState } from '@/hooks/use-form-state'

const testSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  age: z.number().min(18, 'Must be at least 18 years old')
})

type TestFormData = z.infer<typeof testSchema>

const initialValues: TestFormData = {
  name: '',
  email: '',
  age: 0
}

describe('useFormState', () => {
  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => 
      useFormState({ initialValues })
    )

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isValid).toBe(true)
    expect(result.current.isDirty).toBe(false)
  })

  it('should update values correctly', () => {
    const { result } = renderHook(() => 
      useFormState({ initialValues })
    )

    act(() => {
      result.current.setValue('name', 'John Doe')
    })

    expect(result.current.values.name).toBe('John Doe')
    expect(result.current.isDirty).toBe(true)
  })

  it('should validate fields with schema', () => {
    const { result } = renderHook(() => 
      useFormState({ initialValues, validationSchema: testSchema })
    )

    act(() => {
      result.current.setValue('email', 'invalid-email')
      result.current.setTouched('email')
    })

    act(() => {
      result.current.validateField('email')
    })

    expect(result.current.errors.email).toBeDefined()
    expect(result.current.errors.email?.message).toBe('Invalid email format')
    expect(result.current.isValid).toBe(false)
  })

  it('should clear errors when field value changes', () => {
    const { result } = renderHook(() => 
      useFormState({ initialValues, validationSchema: testSchema })
    )

    // Set invalid value and validate
    act(() => {
      result.current.setValue('email', 'invalid')
      result.current.setTouched('email')
      result.current.validateField('email')
    })

    expect(result.current.errors.email).toBeDefined()

    // Update with valid value
    act(() => {
      result.current.setValue('email', 'valid@example.com')
    })

    expect(result.current.errors.email).toBeUndefined()
  })

  it('should validate entire form', () => {
    const { result } = renderHook(() => 
      useFormState({ initialValues, validationSchema: testSchema })
    )

    act(() => {
      result.current.setValues({
        name: 'J', // Too short
        email: 'invalid-email',
        age: 16 // Too young
      })
    })

    act(() => {
      const isValid = result.current.validate()
      expect(isValid).toBe(false)
    })

    expect(Object.keys(result.current.errors)).toHaveLength(3)
    expect(result.current.isValid).toBe(false)
  })

  it('should handle form submission', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => 
      useFormState({ 
        initialValues, 
        validationSchema: testSchema,
        onSubmit 
      })
    )

    // Set valid values
    act(() => {
      result.current.setValues({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      })
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25
    })
  })

  it('should not submit invalid form', async () => {
    const onSubmit = jest.fn()
    const { result } = renderHook(() => 
      useFormState({ 
        initialValues, 
        validationSchema: testSchema,
        onSubmit 
      })
    )

    // Keep invalid initial values
    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should reset form to initial values', () => {
    const { result } = renderHook(() => 
      useFormState({ initialValues })
    )

    // Change values
    act(() => {
      result.current.setValues({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      })
      result.current.setTouched('name')
      result.current.setError('email', { message: 'Test error', type: 'custom' })
    })

    // Reset
    act(() => {
      result.current.reset()
    })

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('should handle submission errors', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('Submission failed'))
    const { result } = renderHook(() => 
      useFormState({ 
        initialValues, 
        validationSchema: testSchema,
        onSubmit 
      })
    )

    // Set valid values
    act(() => {
      result.current.setValues({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      })
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.isSubmitting).toBe(false)
    expect(onSubmit).toHaveBeenCalled()
  })

  it('should mark all fields as touched on submit', async () => {
    const { result } = renderHook(() => 
      useFormState({ initialValues, validationSchema: testSchema })
    )

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.touched.name).toBe(true)
    expect(result.current.touched.email).toBe(true)
    expect(result.current.touched.age).toBe(true)
  })

  it('should reset form after successful submission when resetOnSubmit is true', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => 
      useFormState({ 
        initialValues, 
        onSubmit,
        resetOnSubmit: true
      })
    )

    // Set values
    act(() => {
      result.current.setValue('name', 'John Doe')
    })

    await act(async () => {
      await result.current.handleSubmit()
    })

    expect(result.current.values).toEqual(initialValues)
  })
})
