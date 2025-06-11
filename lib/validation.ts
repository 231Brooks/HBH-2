import { z } from "zod"

// Property validation schema
export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().positive("Price must be positive"),
  bedrooms: z.number().int().min(0, "Bedrooms must be 0 or more"),
  bathrooms: z.number().min(0, "Bathrooms must be 0 or more"),
  squareFeet: z.number().positive("Square feet must be positive"),
  address: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().length(2, "State must be a 2-letter code"),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  }),
  propertyType: z.enum(["HOUSE", "APARTMENT", "CONDO", "TOWNHOUSE", "LAND", "OTHER"]),
  listingType: z.enum(["SALE", "RENT", "AUCTION"]),
  status: z.enum(["ACTIVE", "PENDING", "SOLD", "INACTIVE"]),
})

// User profile validation schema
export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional(),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
  website: z.string().url("Invalid website URL").optional(),
  socialLinks: z
    .object({
      twitter: z.string().url("Invalid Twitter URL").optional(),
      linkedin: z.string().url("Invalid LinkedIn URL").optional(),
      facebook: z.string().url("Invalid Facebook URL").optional(),
      instagram: z.string().url("Invalid Instagram URL").optional(),
    })
    .optional(),
})

// Message validation schema
export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(2000, "Message too long"),
  recipientId: z.string().uuid("Invalid recipient ID"),
})

// Appointment validation schema
export const appointmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  startTime: z.string().datetime("Invalid start time"),
  endTime: z.string().datetime("Invalid end time"),
  location: z.string().optional(),
  attendees: z.array(z.string().uuid("Invalid attendee ID")).optional(),
})

// Sanitize user input to prevent XSS
export function sanitizeInput(input: string): string {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}

// Validate and sanitize form data
export async function validateFormData<T>(
  formData: FormData,
  schema: z.ZodType<T>,
): Promise<{ success: boolean; data?: T; errors?: z.ZodError }> {
  try {
    // Convert FormData to object
    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
      data[key] = value
    })

    // Validate with Zod schema
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error }
    }
    throw error
  }
}
