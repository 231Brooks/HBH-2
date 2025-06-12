import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleProperties = [
  {
    title: "Modern Downtown Condo",
    description: "Beautiful 2-bedroom condo in the heart of downtown with stunning city views. Features include hardwood floors, granite countertops, and in-unit laundry.",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    price: 850000,
    beds: 2,
    baths: 2,
    sqft: 1200,
    type: "RESIDENTIAL",
    status: "ACTIVE",
  },
  {
    title: "Luxury Family Home",
    description: "Spacious 4-bedroom family home with large backyard, updated kitchen, and 3-car garage. Perfect for growing families.",
    address: "456 Oak Avenue",
    city: "Palo Alto",
    state: "CA",
    zipCode: "94301",
    price: 2500000,
    beds: 4,
    baths: 3.5,
    sqft: 3200,
    type: "RESIDENTIAL",
    status: "ACTIVE",
  },
  {
    title: "Commercial Office Space",
    description: "Prime commercial office space in business district. Recently renovated with modern amenities and parking.",
    address: "789 Business Blvd",
    city: "San Jose",
    state: "CA",
    zipCode: "95110",
    price: 1200000,
    beds: 0,
    baths: 4,
    sqft: 5000,
    type: "COMMERCIAL",
    status: "ACTIVE",
  },
  {
    title: "Cozy Starter Home",
    description: "Perfect starter home with 3 bedrooms and a charming garden. Recently updated with new appliances.",
    address: "321 Elm Street",
    city: "Oakland",
    state: "CA",
    zipCode: "94601",
    price: 650000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    type: "RESIDENTIAL",
    status: "ACTIVE",
  },
  {
    title: "Investment Property",
    description: "Great investment opportunity! Multi-unit property with stable rental income. Well-maintained building.",
    address: "555 Investment Way",
    city: "Berkeley",
    state: "CA",
    zipCode: "94702",
    price: 1800000,
    beds: 8,
    baths: 6,
    sqft: 4500,
    type: "MULTIFAMILY",
    status: "ACTIVE",
  },
  {
    title: "Waterfront Luxury Villa",
    description: "Stunning waterfront property with panoramic bay views. Features include infinity pool, wine cellar, and private dock.",
    address: "777 Waterfront Drive",
    city: "Sausalito",
    state: "CA",
    zipCode: "94965",
    price: 4500000,
    beds: 5,
    baths: 4.5,
    sqft: 6000,
    type: "RESIDENTIAL",
    status: "ACTIVE",
  }
]

async function seedProperties() {
  try {
    console.log('🌱 Seeding sample properties...')
    
    // Create a default user if none exists
    let defaultUser = await prisma.user.findFirst()
    
    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          email: 'demo@hbh.com',
          name: 'Demo User',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        }
      })
      console.log('✅ Created default user')
    }

    // Create properties
    for (const propertyData of sampleProperties) {
      const property = await prisma.property.create({
        data: {
          ...propertyData,
          ownerId: defaultUser.id,
        }
      })
      
      // Add some sample images
      await prisma.propertyImage.createMany({
        data: [
          {
            propertyId: property.id,
            url: `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop`,
            alt: `${property.title} - Main View`,
            isPrimary: true,
          },
          {
            propertyId: property.id,
            url: `https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop`,
            alt: `${property.title} - Interior`,
            isPrimary: false,
          }
        ]
      })
      
      console.log(`✅ Created property: ${property.title}`)
    }
    
    console.log('🎉 Successfully seeded all sample properties!')
    
  } catch (error) {
    console.error('❌ Error seeding properties:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seed function
seedProperties()
