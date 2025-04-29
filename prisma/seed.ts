import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
    },
  })

  console.log({ user })

  console.log("Starting database seeding...")

  // Create admin user
  const adminPassword = await bcrypt.hash("Admin123!", 10)
  const admin = await prisma.user.upsert({
    where: { email: "admin@homesbh.com" },
    update: {},
    create: {
      email: "admin@homesbh.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
    },
  })
  console.log("Created admin user:", admin.email)

  // Create demo users
  const demoPassword = await bcrypt.hash("Demo123!", 10)
  const demoUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "John Smith",
      password: demoPassword,
      role: "USER",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
      location: "Phoenix, AZ",
      bio: "Real estate investor with 5+ years of experience in residential and commercial properties.",
      phone: "(555) 123-4567",
      rating: 4.9,
      reviewCount: 24,
    },
  })
  console.log("Created demo user:", demoUser.email)

  const demoProfessional = await prisma.user.upsert({
    where: { email: "professional@example.com" },
    update: {},
    create: {
      email: "professional@example.com",
      name: "Sarah Johnson",
      password: demoPassword,
      role: "PROFESSIONAL",
      emailVerified: true,
      phoneVerified: true,
      identityVerified: true,
      location: "Phoenix, AZ",
      bio: "Licensed title agent with over 10 years of experience in residential and commercial real estate transactions.",
      phone: "(555) 987-6543",
      rating: 4.9,
      reviewCount: 124,
    },
  })
  console.log("Created demo professional:", demoProfessional.email)

  // Create title companies
  const titleCompanies = [
    {
      name: "Desert Title Company",
      address: "123 Main St",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
      phone: "(555) 111-2222",
      email: "info@deserttitle.com",
      website: "https://www.deserttitle.com",
    },
    {
      name: "First American Title",
      address: "456 Oak Ave",
      city: "Scottsdale",
      state: "AZ",
      zipCode: "85251",
      phone: "(555) 333-4444",
      email: "info@firstamericantitle.com",
      website: "https://www.firstamericantitle.com",
    },
    {
      name: "Fidelity National Title",
      address: "789 Pine Rd",
      city: "Tempe",
      state: "AZ",
      zipCode: "85281",
      phone: "(555) 555-6666",
      email: "info@fidelitytitle.com",
      website: "https://www.fidelitytitle.com",
    },
  ]

  for (const company of titleCompanies) {
    await prisma.titleCompany.upsert({
      where: { name: company.name },
      update: {},
      create: company,
    })
  }
  console.log("Created title companies")

  // Create properties
  const properties = [
    {
      title: "Modern Family Home",
      description:
        "Beautiful 4 bedroom, 3 bathroom home with modern finishes and spacious backyard. Recently renovated kitchen with stainless steel appliances and quartz countertops.",
      address: "123 Main Street",
      city: "Phoenix",
      state: "AZ",
      zipCode: "85001",
      price: 425000,
      beds: 4,
      baths: 3,
      sqft: 2400,
      type: "RESIDENTIAL",
      status: "FOR_SALE",
      features: ["Renovated Kitchen", "Spacious Backyard", "Garage", "Central AC"],
      ownerId: demoUser.id,
    },
    {
      title: "Downtown Condo",
      description:
        "Luxury condo in the heart of downtown with stunning city views. Features include hardwood floors, gourmet kitchen, and private balcony.",
      address: "456 Oak Avenue",
      city: "Scottsdale",
      state: "AZ",
      zipCode: "85251",
      price: 750000,
      beds: 2,
      baths: 2,
      sqft: 1800,
      type: "RESIDENTIAL",
      status: "FOR_SALE",
      features: ["City Views", "Hardwood Floors", "Gourmet Kitchen", "Balcony"],
      ownerId: demoUser.id,
    },
    {
      title: "Investment Property",
      description:
        "Great investment opportunity in a high-demand rental area. Currently rented for $2,200/month with long-term tenants.",
      address: "789 Pine Road",
      city: "Tempe",
      state: "AZ",
      zipCode: "85281",
      price: 350000,
      beds: 3,
      baths: 2,
      sqft: 2100,
      type: "RESIDENTIAL",
      status: "AUCTION",
      features: ["Rental Income", "Good School District", "Low Maintenance", "Updated Bathrooms"],
      ownerId: demoUser.id,
    },
  ]

  for (const property of properties) {
    await prisma.property.upsert({
      where: {
        address_city_state: {
          address: property.address,
          city: property.city,
          state: property.state,
        },
      },
      update: {},
      create: property,
    })
  }
  console.log("Created properties")

  // Create services
  const services = [
    {
      name: "Desert Title Company",
      description: "Comprehensive title and escrow services for residential and commercial properties.",
      category: "TITLE_SERVICES",
      price: "$350+",
      hourlyRate: null,
      location: "Phoenix, AZ",
      image: "/abstract-title-layers.png",
      verified: true,
      providerId: demoProfessional.id,
    },
    {
      name: "Elite Home Inspections",
      description: "Thorough home inspections with detailed reports and same-day service.",
      category: "HOME_INSPECTION",
      price: "$275+",
      hourlyRate: null,
      location: "Scottsdale, AZ",
      image: "/home-inspection-checklist.png",
      verified: true,
      providerId: demoProfessional.id,
    },
    {
      name: "Premium Real Estate Photography",
      description: "Professional photography, virtual tours, and drone footage for property listings.",
      category: "PHOTOGRAPHY",
      price: "$200+",
      hourlyRate: null,
      location: "Tempe, AZ",
      image: "/modern-living-room.png",
      verified: true,
      providerId: demoProfessional.id,
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: {
        name_providerId: {
          name: service.name,
          providerId: service.providerId,
        },
      },
      update: {},
      create: service,
    })
  }
  console.log("Created services")

  // Create job listings
  const jobListings = [
    {
      title: "Title Services for Multi-Family Property",
      description:
        "Looking for a title company to handle closing for a 12-unit apartment building purchase. Need thorough title search and escrow services.",
      location: "Phoenix, AZ",
      budget: "$1,500 - $2,000",
      category: "TITLE_SERVICES",
      skills: ["Title Search", "Escrow", "Commercial Property"],
      proposals: 4,
    },
    {
      title: "Home Inspector Needed for New Construction",
      description:
        "Seeking a certified home inspector for a newly constructed 4-bedroom home. Need thorough inspection and detailed report.",
      location: "Austin, TX",
      budget: "$400 - $600",
      category: "HOME_INSPECTION",
      skills: ["New Construction", "Inspection Reports", "Electrical"],
      proposals: 7,
    },
    {
      title: "Real Estate Attorney for Contract Review",
      description:
        "Need a real estate attorney to review purchase agreement for commercial property. Quick turnaround required.",
      location: "Remote",
      budget: "$300 - $500",
      category: "LEGAL_SERVICES",
      skills: ["Contract Review", "Commercial Real Estate", "Legal Advice"],
      proposals: 12,
    },
  ]

  for (const job of jobListings) {
    await prisma.jobListing.create({
      data: job,
    })
  }
  console.log("Created job listings")

  console.log("Database seeding completed!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
