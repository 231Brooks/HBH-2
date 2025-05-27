import type { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import prisma from "./prisma"
import { getServerSession } from "next-auth/next"
import { validateEmail } from "./validation-utils"
import { withTimeout, TIMEOUT_DURATIONS } from "./operation-timeout"

// Get allowed domains from environment or use defaults
const getAllowedDomains = (): string[] => {
  const configuredDomains = process.env.ALLOWED_REDIRECT_DOMAINS
  if (configuredDomains) {
    return configuredDomains.split(",").map((domain) => domain.trim())
  }

  // Default allowed domains
  return ["localhost", "vercel.app"]
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
    newUser: "/auth/signup",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          // Enable state parameter for CSRF protection
          state: true,
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Validate email format
        if (!validateEmail(credentials.email)) {
          return null
        }

        try {
          // Apply timeout to prevent long-running database queries
          const user = await withTimeout(
            prisma.user.findUnique({
              where: { email: credentials.email },
            }),
            TIMEOUT_DURATIONS.DB_QUERY,
            "Database query timed out during authentication",
          )

          if (!user || !user.password) {
            return null
          }

          // Apply timeout to password comparison
          const passwordMatch = await withTimeout(
            bcrypt.compare(credentials.password, user.password),
            TIMEOUT_DURATIONS.AUTH_OPERATION,
            "Password verification timed out",
          )

          if (!passwordMatch) {
            // Log failed login attempt
            await prisma.loginAttempt.create({
              data: {
                userId: user.id,
                success: false,
                ip: "unknown", // In a real implementation, you'd pass the IP
                userAgent: "unknown", // In a real implementation, you'd pass the user agent
              },
            })
            return null
          }

          // Check if email is verified
          if (!user.emailVerified) {
            // You could throw a custom error here that your error page would handle
            // For now, just return null
            return null
          }

          // Check if account is disabled
          if (user.disabled) {
            return null
          }

          // Log successful login
          await prisma.loginAttempt.create({
            data: {
              userId: user.id,
              success: true,
              ip: "unknown", // In a real implementation, you'd pass the IP
              userAgent: "unknown", // In a real implementation, you'd pass the user agent
            },
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    // Add secure redirect callback to prevent open redirects
    async redirect({ url, baseUrl }) {
      // Only allow relative URLs or URLs matching allowed domains
      const allowedDomains = getAllowedDomains()

      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }

      try {
        const parsedUrl = new URL(url)
        const isAllowedDomain = allowedDomains.some(
          (domain) => parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`),
        )

        if (isAllowedDomain) {
          return url
        }
      } catch (error) {
        // Invalid URL, redirect to base URL
      }

      // Default fallback for security
      return baseUrl
    },
  },
  // Add additional security settings
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  // Add CSRF protection
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
}

export const auth = () => getServerSession(authOptions)
