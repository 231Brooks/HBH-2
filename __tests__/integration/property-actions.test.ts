import { getProperties, getPropertyById } from "@/app/actions/property-actions"
import { prismaMock } from "../../__mocks__/prisma"

// Mock the Prisma client
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: prismaMock,
}))

describe("Property Actions", () => {
  describe("getProperties", () => {
    it("returns properties with default pagination", async () => {
      // Mock data
      const mockProperties = [
        { id: "1", title: "Property 1" },
        { id: "2", title: "Property 2" },
      ]

      // Mock Prisma response
      prismaMock.property.findMany.mockResolvedValue(mockProperties)

      // Call the function
      const result = await getProperties()

      // Assert
      expect(result).toEqual(mockProperties)
      expect(prismaMock.property.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: { createdAt: "desc" },
      })
    })

    it("applies filters correctly", async () => {
      // Mock data
      const mockProperties = [{ id: "1", title: "Filtered Property" }]

      // Mock Prisma response
      prismaMock.property.findMany.mockResolvedValue(mockProperties)

      // Call the function with filters
      const result = await getProperties({
        minPrice: 100000,
        maxPrice: 500000,
        bedrooms: 3,
        propertyType: "HOUSE",
      })

      // Assert
      expect(result).toEqual(mockProperties)
      expect(prismaMock.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            price: expect.objectContaining({
              gte: 100000,
              lte: 500000,
            }),
            bedrooms: 3,
            propertyType: "HOUSE",
          }),
        }),
      )
    })
  })

  describe("getPropertyById", () => {
    it("returns property when found", async () => {
      // Mock data
      const mockProperty = { id: "1", title: "Test Property" }

      // Mock Prisma response
      prismaMock.property.findUnique.mockResolvedValue(mockProperty)

      // Call the function
      const result = await getPropertyById("1")

      // Assert
      expect(result).toEqual(mockProperty)
      expect(prismaMock.property.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
        include: expect.any(Object),
      })
    })

    it("returns null when property not found", async () => {
      // Mock Prisma response
      prismaMock.property.findUnique.mockResolvedValue(null)

      // Call the function
      const result = await getPropertyById("999")

      // Assert
      expect(result).toBeNull()
    })
  })
})
