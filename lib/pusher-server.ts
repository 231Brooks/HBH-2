// Server-side Pusher configuration
import Pusher from "pusher"
import { env } from "@/lib/env-config"

let pusherServer: Pusher | null = null

export function getPusherServer(): Pusher {
  if (!pusherServer) {
    if (!env.PUSHER_APP_ID || !env.PUSHER_KEY || !env.PUSHER_SECRET || !env.PUSHER_CLUSTER) {
      throw new Error("Pusher configuration is incomplete")
    }

    pusherServer = new Pusher({
      appId: env.PUSHER_APP_ID,
      key: env.PUSHER_KEY,
      secret: env.PUSHER_SECRET,
      cluster: env.PUSHER_CLUSTER,
      useTLS: true,
    })
  }

  return pusherServer
}

// Helper function to trigger events from server-side
export async function triggerPusherEvent(channel: string, event: string, data: any, socketId?: string): Promise<void> {
  const pusher = getPusherServer()
  await pusher.trigger(channel, event, data, socketId)
}
