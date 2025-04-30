import Pusher from "pusher"

// Check if all required environment variables are present
const isPusherConfigured =
  process.env.PUSHER_APP_ID && process.env.PUSHER_KEY && process.env.PUSHER_SECRET && process.env.PUSHER_CLUSTER

// Create a dummy pusher instance if not configured
const dummyPusher = {
  trigger: async () => {
    console.warn("Pusher is not configured. Message will not be sent.")
    return Promise.resolve()
  },
  // Add other methods as needed
}

// Initialize Pusher only if all required environment variables are present
export const pusherServer = isPusherConfigured
  ? new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER!,
      useTLS: true,
    })
  : (dummyPusher as unknown as Pusher)
