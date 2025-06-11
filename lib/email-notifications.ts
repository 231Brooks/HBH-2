import { createTransport } from "nodemailer"

// Add this validation function
function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

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

// Send payment confirmation email
export async function sendPaymentConfirmationEmail(data: {
  to: string
  orderId?: string
  transactionId?: string
  serviceName?: string
  feeType?: string
  amount: number
  feeAmount?: number
  date: Date
}) {
  const { to, orderId, transactionId, serviceName, feeType, amount, feeAmount, date } = data

  // Validate email before proceeding
  if (!validateEmail(to)) {
    console.error("Invalid email format:", to)
    return { success: false, error: "Invalid email format" }
  }

  let subject, html

  if (orderId && serviceName) {
    // Service order payment
    subject = `Payment Confirmation: ${serviceName}`
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A2540;">Payment Confirmation</h2>
        <p>Thank you for your payment. Your order has been confirmed.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Service:</strong> ${serviceName}</p>
          <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
          ${feeAmount ? `<p><strong>Platform Fee:</strong> $${feeAmount.toFixed(2)}</p>` : ""}
          <p><strong>Total:</strong> $${(amount + (feeAmount || 0)).toFixed(2)}</p>
          <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
        </div>
        
        <p>You can view your order details by logging into your account.</p>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  } else if (transactionId) {
    // Transaction fee payment
    subject = `Payment Confirmation: ${feeType || "Transaction Fee"}`
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A2540;">Payment Confirmation</h2>
        <p>Thank you for your payment. Your transaction fee has been processed.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><strong>Fee Type:</strong> ${feeType || "Transaction Fee"}</p>
          <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
        </div>
        
        <p>You can view your transaction details by logging into your account.</p>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  } else {
    // Generic payment
    subject = "Payment Confirmation"
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0A2540;">Payment Confirmation</h2>
        <p>Thank you for your payment.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
          <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send payment confirmation email:", error)
    return { success: false, error }
  }
}

// Send fee receipt email
export async function sendFeeReceiptEmail(data: {
  to: string
  feeId: string
  feeType: string
  amount: number
  date: Date
  relatedId?: string
  relatedType?: string
  relatedName?: string
}) {
  const { to, feeId, feeType, amount, date, relatedId, relatedType, relatedName } = data

  // Validate email before proceeding
  if (!validateEmail(to)) {
    console.error("Invalid email format:", to)
    return { success: false, error: "Invalid email format" }
  }

  const subject = `Receipt: ${feeType}`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2540;">Fee Receipt</h2>
      <p>This is a receipt for your recent fee payment.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Receipt Details</h3>
        <p><strong>Receipt ID:</strong> ${feeId}</p>
        <p><strong>Fee Type:</strong> ${feeType}</p>
        <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        <p><strong>Date:</strong> ${date.toLocaleDateString()}</p>
        ${relatedId ? `<p><strong>${relatedType || "Related Item"}:</strong> ${relatedName || relatedId}</p>` : ""}
      </div>
      
      <p>Thank you for using our platform.</p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send fee receipt email:", error)
    return { success: false, error }
  }
}

// Send fee reminder email
export async function sendFeeReminderEmail(data: {
  to: string
  feeId: string
  feeType: string
  amount: number
  dueDate: Date
  paymentLink: string
  relatedId?: string
  relatedType?: string
  relatedName?: string
}) {
  const { to, feeId, feeType, amount, dueDate, paymentLink, relatedId, relatedType, relatedName } = data

  // Validate email before proceeding
  if (!validateEmail(to)) {
    console.error("Invalid email format:", to)
    return { success: false, error: "Invalid email format" }
  }

  const subject = `Reminder: ${feeType} Payment Due`
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0A2540;">Payment Reminder</h2>
      <p>This is a friendly reminder that you have a fee payment due.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Payment Details</h3>
        <p><strong>Fee ID:</strong> ${feeId}</p>
        <p><strong>Fee Type:</strong> ${feeType}</p>
        <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
        <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
        ${relatedId ? `<p><strong>${relatedType || "Related Item"}:</strong> ${relatedName || relatedId}</p>` : ""}
      </div>
      
      <p>Please click the button below to make your payment:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${paymentLink}" style="background-color: #0A2540; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Make Payment
        </a>
      </div>
      
      <p>If you've already made this payment, please disregard this message.</p>
      
      <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send fee reminder email:", error)
    return { success: false, error }
  }
}
