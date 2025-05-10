// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"

// Mock environment variables
process.env.NEXT_PUBLIC_PUSHER_APP_ID = "test-app-id"
process.env.NEXT_PUBLIC_PUSHER_KEY = "test-key"
process.env.NEXT_PUBLIC_PUSHER_CLUSTER = "test-cluster"
process.env.PUSHER_SECRET = "test-secret"
process.env.DATABASE_URL = "test-db-url"

// Mock Pusher
jest.mock("pusher-js", () => {
  return jest.fn().mockImplementation(() => {
    return {
      subscribe: jest.fn().mockReturnValue({
        bind: jest.fn(),
      }),
      unsubscribe: jest.fn(),
      connection: {
        bind: jest.fn(),
      },
    }
  })
})

jest.mock("pusher", () => {
  return jest.fn().mockImplementation(() => {
    return {
      trigger: jest.fn().mockResolvedValue({}),
      authorizeChannel: jest.fn().mockReturnValue({}),
    }
  })
})

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue("/"),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}))
