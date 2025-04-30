import { sql } from "@/lib/db"

async function seedAuctions() {
  console.log("Starting auction data seeding...")

  try {
    // Get existing users to use as auction creators and bidders
    const users = await sql`SELECT id, name FROM "User" LIMIT 10`

    if (users.length < 2) {
      console.error("Not enough users in the database. Please run the main seed script first.")
      return
    }

    // Create auction items
    const auctionItems = [
      {
        title: "Luxury Beachfront Property",
        description:
          "Prime beachfront property with stunning ocean views. 4 bedrooms, 3 bathrooms, private beach access.",
        category: "PROPERTY",
        image: "/luxury-beachfront-villa.png",
        price: 750000, // Starting price
        userId: users[0].id,
        status: "ACTIVE",
        is_auction: true,
        auction_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        auction_reserve_price: 900000,
      },
      {
        title: "Commercial Office Space",
        description: "Prime downtown commercial office space. 2,500 sq ft, recently renovated with modern amenities.",
        category: "COMMERCIAL",
        image: "/modern-office.png",
        price: 450000, // Starting price
        userId: users[1].id,
        status: "ACTIVE",
        is_auction: true,
        auction_end: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        auction_reserve_price: 500000,
      },
      {
        title: "Mountain Cabin Retreat",
        description: "Cozy mountain cabin with 3 bedrooms, 2 bathrooms. Perfect vacation property with stunning views.",
        category: "PROPERTY",
        image: "/secluded-mountain-cabin.png",
        price: 325000, // Starting price
        userId: users[0].id,
        status: "ACTIVE",
        is_auction: true,
        auction_end: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        auction_reserve_price: 375000,
      },
      {
        title: "Urban Loft Apartment",
        description:
          "Modern loft apartment in trendy downtown district. Open floor plan, high ceilings, industrial design.",
        category: "PROPERTY",
        image: "/urban-loft.png",
        price: 275000, // Starting price
        userId: users[1].id,
        status: "ACTIVE",
        is_auction: true,
        auction_end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        auction_reserve_price: null, // No reserve price
      },
      {
        title: "Investment Rental Property",
        description:
          "Turnkey rental property with existing tenants. Currently generating $2,500/month in rental income.",
        category: "INVESTMENT",
        image: "/rental-property.png",
        price: 225000, // Starting price
        userId: users[0].id,
        status: "ACTIVE",
        is_auction: true,
        auction_end: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Ended 2 days ago
        auction_reserve_price: 250000,
      },
    ]

    // Insert auction items
    for (const item of auctionItems) {
      const [newItem] = await sql`
        INSERT INTO "MarketplaceItem" (
          id, title, description, category, image, price, 
          userId, status, is_auction, auction_end, auction_reserve_price,
          createdAt, updatedAt
        )
        VALUES (
          gen_random_uuid()::text, ${item.title}, ${item.description}, ${item.category}, 
          ${item.image}, ${item.price}, ${item.userId}, ${item.status}::text, 
          ${item.is_auction}, ${item.auction_end.toISOString()}, ${item.auction_reserve_price},
          NOW(), NOW()
        )
        RETURNING id
      `
      console.log(`Created auction item: ${item.title} with ID: ${newItem.id}`)

      // If this isn't the first user, add some bids to this auction
      if (users.length > 2 && item.auction_end > new Date()) {
        // Create between 2-5 bids for each auction
        const numBids = Math.floor(Math.random() * 4) + 2
        let currentBid = item.price

        for (let i = 0; i < numBids; i++) {
          // Randomly select a bidder (not the item owner)
          const bidderIndex = Math.floor(Math.random() * (users.length - 2)) + 2
          const bidderId = users[bidderIndex]?.id || users[2].id

          // Increase bid by 5-15% each time
          const bidIncrease = currentBid * (0.05 + Math.random() * 0.1)
          currentBid += bidIncrease

          // Create the bid
          const bidStatus = i === numBids - 1 ? "ACTIVE" : "OUTBID"
          const bidTime = new Date(Date.now() - (numBids - i) * 12 * 60 * 60 * 1000) // Stagger bid times

          await sql`
            INSERT INTO "Bid" (id, item_id, user_id, amount, status, created_at)
            VALUES (
              gen_random_uuid()::text, ${newItem.id}, ${bidderId}, ${Math.round(currentBid)}, 
              ${bidStatus}, ${bidTime.toISOString()}
            )
          `
        }

        console.log(`Added ${numBids} bids to auction: ${item.title}`)
      }
    }

    console.log("Auction data seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding auction data:", error)
  }
}

// Execute the seeding function
seedAuctions()
  .then(() => console.log("Seeding script completed"))
  .catch(console.error)
