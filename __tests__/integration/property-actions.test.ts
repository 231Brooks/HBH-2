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
        {
          id: "1",
          title: "Property 1",
          description: "Test property 1",
          address: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          price: 100000,
          beds: 3,
          baths: 2,
          sqft: 1500,
          type: "HOUSE",
          status: "FOR_SALE",
          features: [],
          latitude: null,
          longitude: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId: "owner1"
        },
        {
          id: "2",
          title: "Property 2",
          description: "Test property 2",
          address: "456 Test Ave",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          price: 200000,
          beds: 4,
          baths: 3,
          sqft: 2000,
          type: "HOUSE",
          status: "FOR_SALE",
          features: [],
          latitude: null,
          longitude: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ownerId: "owner2"
        },
      ]

      // Mock Prisma response
      prismaMock.property.findMany.mockResolvedValue(mockProperties)

      // Call the function
      const result = await getProperties({})

      // Assert
      expect(result.properties).toEqual(mockProperties)
      expect(prismaMock.property.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: { createdAt: "desc" },
      })
    })

    it("applies filters correctly", async () => {
      // Mock data
      const mockProperties = [{
        id: "1",
        title: "Filtered Property",
        description: "Test filtered property",
        address: "789 Filter St",
        city: "Filter City",
        state: "FS",
        zipCode: "54321",
        price: 150000,
        beds: 3,
        baths: 2,
        sqft: 1800,
        type: "HOUSE",
        status: "FOR_SALE",
        features: [],
        latitude: null,
        longitude: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: "owner3"
      }]

      // Mock Prisma response
      prismaMock.property.findMany.mockResolvedValue(mockProperties)

      // Call the function with filters
      const result = await getProperties({
        minPrice: 100000,
        maxPrice: 500000,
        beds: 3,
        type: "HOUSE",
      })

      // Assert
      expect(result.properties).toEqual(mockProperties)
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
      const mockProperty = {
        id: "1",
        title: "Test Property",
        description: "Test property description",
        address: "123 Test Blvd",
        city: "Test Town",
        state: "TT",
        zipCode: "11111",
        price: 300000,
        beds: 4,
        baths: 3,
        sqft: 2500,
        type: "HOUSE",
        status: "FOR_SALE",
        features: [],
        latitude: null,
        longitude: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: "owner4"
      }

      // Mock Prisma response
      prismaMock.property.findUnique.mockResolvedValue(mockProperty)

      // Call the function
      const result = await getPropertyById("1")

      // Assert
      expect(result.property).toEqual(mockProperty)
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
      expect(result.property).toBeNull()
    })
  })
})
