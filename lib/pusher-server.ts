import Pusher from "pusher"
import { serverEnv } from "./env"

let pusherInstance: Pusher | null = null

export function getPusherServer(): Pusher {
  if (
    !pusherInstance &&
    serverEnv.PUSHER_APP_ID &&
    serverEnv.PUSHER_KEY &&
    serverEnv.PUSHER_SECRET &&
    serverEnv.PUSHER_CLUSTER
  ) {
    pusherInstance = new Pusher({
      appId: serverEnv.PUSHER_APP_ID,
      key: serverEnv.PUSHER_KEY,
      secret: serverEnv.PUSHER_SECRET,
      cluster: serverEnv.PUSHER_CLUSTER,
      useTLS: true,
    })
  }

  if (!pusherInstance) {
    throw new Error("Pusher is not configured. Please check your environment variables.")
  }

  return pusherInstance
}

export const pusherServer = getPusherServer()
