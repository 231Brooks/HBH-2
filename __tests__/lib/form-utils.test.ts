import { z } from 'zod'
import {
  formDataToObject,
  validateFormData,
  sanitizeFormInput,
  formatFormErrors,
  formatCurrency,
  formatPhoneNumber,
  isValidEmail,
  isValidPhoneNumber,
  generateFieldId,
  createFieldProps
} from '@/lib/form-utils'

describe('form-utils', () => {
  describe('formDataToObject', () => {
    it('should convert FormData to object', () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('age', '25')

      const result = formDataToObject(formData)

      expect(result).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        age: '25'
      })
    })

    it('should handle multiple values for same key', () => {
      const formData = new FormData()
      formData.append('tags', 'tag1')
      formData.append('tags', 'tag2')
      formData.append('name', 'John')

      const result = formDataToObject(formData)

      expect(result).toEqual({
        tags: ['tag1', 'tag2'],
        name: 'John'
      })
    })
  })

  describe('validateFormData', () => {
    const schema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      age: z.number()
    })

    it('should validate valid data successfully', async () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 25
      }

      const result = await validateFormData(data, schema)

      expect(result.success).toBe(true)
      expect(result.data).toEqual(data)
      expect(result.errors).toBeUndefined()
    })

    it('should return errors for invalid data', async () => {
      const data = {
        name: 'J',
        email: 'invalid-email',
        age: 'not-a-number'
      }

      const result = await validateFormData(data, schema)

      expect(result.success).toBe(false)
      expect(result.data).toBeUndefined()
      expect(result.errors).toBeDefined()
      expect(Object.keys(result.errors!)).toHaveLength(3)
    })

    it('should handle FormData input', async () => {
      const formData = new FormData()
      formData.append('name', 'John Doe')
      formData.append('email', 'john@example.com')
      formData.append('age', '25')

      const result = await validateFormData(formData, schema)

      expect(result.success).toBe(false) // age is string, not number
      expect(result.errors).toBeDefined()
    })
  })

  describe('sanitizeFormInput', () => {
    it('should sanitize HTML characters', () => {
      const input = '<script>alert("xss")</script>'
      const result = sanitizeFormInput(input)
      
      expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    })

    it('should handle normal text', () => {
      const input = 'Hello World'
      const result = sanitizeFormInput(input)
      
      expect(result).toBe('Hello World')
    })

    it('should sanitize all dangerous characters', () => {
      const input = '<>&"\''
      const result = sanitizeFormInput(input)
      
      expect(result).toBe('&lt;&gt;&amp;&quot;&#039;')
    })
  })

  describe('formatFormErrors', () => {
    it('should format errors for display', () => {
      const errors = {
        firstName: 'First name is required',
        emailAddress: 'Invalid email format'
      }

      const result = formatFormErrors(errors)

      expect(result).toEqual([
        'First Name: First name is required',
        'Email Address: Invalid email format'
      ])
    })

    it('should handle camelCase field names', () => {
      const errors = {
        confirmPassword: 'Passwords do not match'
      }

      const result = formatFormErrors(errors)

      expect(result).toEqual([
        'Confirm Password: Passwords do not match'
      ])
    })
  })

  describe('formatCurrency', () => {
    it('should format currency input', () => {
      expect(formatCurrency('1234')).toBe('1,234')
      expect(formatCurrency('1234.56')).toBe('1,234.56')
      expect(formatCurrency('1234567')).toBe('1,234,567')
    })

    it('should handle decimal places', () => {
      expect(formatCurrency('123.456')).toBe('123.45')
      expect(formatCurrency('123.')).toBe('123.')
    })

    it('should remove non-numeric characters', () => {
      expect(formatCurrency('$1,234.56')).toBe('1,234.56')
      expect(formatCurrency('abc123def')).toBe('123')
    })

    it('should handle multiple decimal points', () => {
      expect(formatCurrency('123.45.67')).toBe('123.4567')
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format complete phone number', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890')
    })

    it('should format partial phone numbers', () => {
      expect(formatPhoneNumber('123')).toBe('(123) ')
      expect(formatPhoneNumber('123456')).toBe('(123) 456-')
      expect(formatPhoneNumber('1234567')).toBe('(123) 456-7')
    })

    it('should handle non-numeric characters', () => {
      expect(formatPhoneNumber('(123) 456-7890')).toBe('(123) 456-7890')
      expect(formatPhoneNumber('123-456-7890')).toBe('(123) 456-7890')
    })

    it('should handle empty input', () => {
      expect(formatPhoneNumber('')).toBe('')
    })
  })

  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('@example.com')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('test.example.com')).toBe(false)
    })
  })

  describe('isValidPhoneNumber', () => {
    it('should validate correctly formatted phone numbers', () => {
      expect(isValidPhoneNumber('(123) 456-7890')).toBe(true)
    })

    it('should reject incorrectly formatted phone numbers', () => {
      expect(isValidPhoneNumber('123-456-7890')).toBe(false)
      expect(isValidPhoneNumber('1234567890')).toBe(false)
      expect(isValidPhoneNumber('(123) 456-789')).toBe(false)
    })
  })

  describe('generateFieldId', () => {
    it('should generate field ID', () => {
      expect(generateFieldId('loginForm', 'email')).toBe('loginForm-email')
      expect(generateFieldId('profile', 'firstName')).toBe('profile-firstName')
    })
  })

  describe('createFieldProps', () => {
    it('should create field props without error', () => {
      const props = createFieldProps('email', 'test@example.com')

      expect(props).toEqual({
        name: 'email',
        value: 'test@example.com',
        error: undefined,
        'aria-invalid': 'false',
        'aria-describedby': undefined
      })
    })

    it('should create field props with error when touched', () => {
      const props = createFieldProps('email', 'invalid', 'Invalid email', true)

      expect(props).toEqual({
        name: 'email',
        value: 'invalid',
        error: 'Invalid email',
        'aria-invalid': 'true',
        'aria-describedby': 'email-error'
      })
    })

    it('should not show error when not touched', () => {
      const props = createFieldProps('email', 'invalid', 'Invalid email', false)

      expect(props).toEqual({
        name: 'email',
        value: 'invalid',
        error: undefined,
        'aria-invalid': 'false',
        'aria-describedby': undefined
      })
    })
  })
})
