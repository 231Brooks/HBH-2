import { cookies } from "next/headers"

export function getSession() {
  const sessionCookie = cookies().get("session")

  if (!sessionCookie?.value) {
    return null
  }

  try {
    return JSON.parse(sessionCookie.value)
  } catch (error) {
    return null
  }
}

export function isAuthenticated() {
  return getSession() !== null
}
