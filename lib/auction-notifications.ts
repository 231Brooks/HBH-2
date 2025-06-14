import { createTransport } from "nodemailer"

// Configure email transport
const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  secure: true,
})

export interface AuctionNotificationData {
  type: "outbid" | "auction_won" | "auction_lost" | "auction_sold" | "auction_no_sale" | "auction_ending_soon" | "auction_extended"
  to: string
  data: {
    propertyTitle: string
    propertyId: string
    yourBid?: number
    newBid?: number
    winningBid?: number
    finalPrice?: number
    winnerName?: string
    highestBid?: number
    reservePrice?: number
    timeRemaining?: string
    extensionMinutes?: number
  }
}

export async function sendAuctionNotificationEmail({ type, to, data }: AuctionNotificationData) {
  if (!validateEmail(to)) {
    console.error("Invalid email format:", to)
    return { success: false, error: "Invalid email format" }
  }

  const { subject, html } = generateEmailContent(type, data)

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error(`Failed to send ${type} email:`, error)
    return { success: false, error }
  }
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

function generateEmailContent(type: string, data: any): { subject: string; html: string } {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://homesinbetterhands.com"
  const propertyUrl = `${baseUrl}/marketplace/property/${data.propertyId}`

  switch (type) {
    case "outbid":
      return {
        subject: `You've been outbid on ${data.propertyTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #e74c3c;">You've Been Outbid!</h2>
            
            <p>Unfortunately, your bid on <strong>${data.propertyTitle}</strong> has been outbid.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Your bid:</strong> $${data.yourBid?.toLocaleString()}</p>
              <p><strong>New highest bid:</strong> $${data.newBid?.toLocaleString()}</p>
            </div>
            
            <p>Don't give up! You can place a higher bid to get back in the running.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${propertyUrl}" style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Place New Bid
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      }

    case "auction_won":
      return {
        subject: `Congratulations! You won the auction for ${data.propertyTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #27ae60;">🎉 Congratulations! You Won!</h2>
            
            <p>Great news! You've won the auction for <strong>${data.propertyTitle}</strong>!</p>
            
            <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #27ae60;">
              <p><strong>Winning bid:</strong> $${data.winningBid?.toLocaleString()}</p>
              <p><strong>Property:</strong> ${data.propertyTitle}</p>
            </div>
            
            <p>The seller will be in touch with you soon to proceed with the next steps. Please check your messages and email regularly for updates.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${propertyUrl}" style="background-color: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Property Details
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      }

    case "auction_lost":
      return {
        subject: `Auction ended for ${data.propertyTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6c757d;">Auction Has Ended</h2>
            
            <p>The auction for <strong>${data.propertyTitle}</strong> has ended.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Your highest bid:</strong> $${data.yourBid?.toLocaleString()}</p>
              ${data.winningBid ? `<p><strong>Winning bid:</strong> $${data.winningBid?.toLocaleString()}</p>` : ''}
            </div>
            
            <p>Thank you for participating in this auction. Keep an eye out for other great properties!</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${baseUrl}/marketplace" style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Browse More Properties
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      }

    case "auction_sold":
      return {
        subject: `Your auction for ${data.propertyTitle} has sold!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #27ae60;">🎉 Your Auction Sold!</h2>
            
            <p>Excellent news! Your auction for <strong>${data.propertyTitle}</strong> has successfully sold!</p>
            
            <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #27ae60;">
              <p><strong>Final sale price:</strong> $${data.finalPrice?.toLocaleString()}</p>
              <p><strong>Winner:</strong> ${data.winnerName}</p>
            </div>
            
            <p>Please check your messages for contact information from the winning bidder. You can now proceed with the next steps of the sale process.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${propertyUrl}" style="background-color: #27ae60; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Auction Details
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      }

    case "auction_no_sale":
      return {
        subject: `Your auction for ${data.propertyTitle} has ended`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #6c757d;">Auction Ended</h2>
            
            <p>Your auction for <strong>${data.propertyTitle}</strong> has ended.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
              ${data.highestBid ? `<p><strong>Highest bid received:</strong> $${data.highestBid?.toLocaleString()}</p>` : '<p>No bids were received.</p>'}
              ${data.reservePrice ? `<p><strong>Reserve price:</strong> $${data.reservePrice?.toLocaleString()}</p>` : ''}
            </div>
            
            ${data.reservePrice && data.highestBid && data.highestBid < data.reservePrice 
              ? '<p>The reserve price was not met, so the property did not sell.</p>'
              : '<p>You can choose to relist the property or convert it to a regular sale.</p>'
            }
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${propertyUrl}" style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Manage Property
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      }

    case "auction_ending_soon":
      return {
        subject: `Auction ending soon: ${data.propertyTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #f39c12;">⏰ Auction Ending Soon!</h2>
            
            <p>The auction for <strong>${data.propertyTitle}</strong> is ending soon!</p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f39c12;">
              <p><strong>Time remaining:</strong> ${data.timeRemaining}</p>
              ${data.yourBid ? `<p><strong>Your current bid:</strong> $${data.yourBid?.toLocaleString()}</p>` : ''}
            </div>
            
            <p>Don't miss your chance! Place your final bid now.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${propertyUrl}" style="background-color: #f39c12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Place Bid Now
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      }

    case "auction_extended":
      return {
        subject: `Auction extended: ${data.propertyTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #17a2b8;">Auction Extended</h2>
            
            <p>The auction for <strong>${data.propertyTitle}</strong> has been extended due to last-minute bidding activity.</p>
            
            <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #17a2b8;">
              <p><strong>Extension time:</strong> ${data.extensionMinutes} minutes</p>
              <p>This gives you more time to place your bid!</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${propertyUrl}" style="background-color: #17a2b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Auction
              </a>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
              This is an automated message. Please do not reply to this email.
            </p>
          </div>
        `
      }

    default:
      return {
        subject: `Auction update for ${data.propertyTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Auction Update</h2>
            <p>There's been an update to the auction for <strong>${data.propertyTitle}</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${propertyUrl}" style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                View Auction
              </a>
            </div>
          </div>
        `
      }
  }
}
