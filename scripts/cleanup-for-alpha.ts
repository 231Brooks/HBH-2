import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanupForAlpha() {
  try {
    console.log('🧹 Starting Alpha cleanup - removing all test/demo data...')
    
    // Delete in order to respect foreign key constraints
    console.log('Deleting advertisements...')
    await prisma.advertisement.deleteMany({})
    
    console.log('Deleting service orders...')
    await prisma.serviceOrder.deleteMany({})
    
    console.log('Deleting reviews...')
    await prisma.review.deleteMany({})
    
    console.log('Deleting appointments...')
    await prisma.appointment.deleteMany({})
    
    console.log('Deleting documents...')
    await prisma.document.deleteMany({})
    
    console.log('Deleting transaction milestones...')
    await prisma.transactionMilestone.deleteMany({})
    
    console.log('Deleting transaction parties...')
    await prisma.transactionParty.deleteMany({})
    
    console.log('Deleting transactions...')
    await prisma.transaction.deleteMany({})
    
    console.log('Deleting saved properties...')
    await prisma.savedProperty.deleteMany({})
    
    console.log('Deleting property images...')
    await prisma.propertyImage.deleteMany({})
    
    console.log('Deleting properties...')
    await prisma.property.deleteMany({})
    
    console.log('Deleting projects...')
    await prisma.project.deleteMany({})
    
    console.log('Deleting services...')
    await prisma.service.deleteMany({})
    
    console.log('Deleting title companies...')
    await prisma.titleCompany.deleteMany({})
    
    console.log('Deleting messages...')
    await prisma.message.deleteMany({})
    
    console.log('Deleting conversations...')
    await prisma.conversation.deleteMany({})
    
    console.log('Deleting accounts...')
    await prisma.account.deleteMany({})
    
    console.log('Deleting sessions...')
    await prisma.session.deleteMany({})
    
    console.log('Deleting verification tokens...')
    await prisma.verificationToken.deleteMany({})
    
    console.log('Deleting users...')
    await prisma.user.deleteMany({})
    
    console.log('✅ Alpha cleanup completed successfully!')
    console.log('🚀 Database is now clean and ready for Alpha users!')
    
    // Reset auto-increment sequences (PostgreSQL specific)
    if (process.env.DATABASE_URL?.includes('postgresql')) {
      console.log('Resetting PostgreSQL sequences...')
      // Note: This would need to be customized based on your actual sequence names
      // Most Prisma setups use cuid() so this might not be necessary
    }
    
  } catch (error) {
    console.error('❌ Error during Alpha cleanup:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the cleanup
if (require.main === module) {
  cleanupForAlpha()
    .then(() => {
      console.log('🎉 Alpha preparation complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Alpha preparation failed:', error)
      process.exit(1)
    })
}

export default cleanupForAlpha
