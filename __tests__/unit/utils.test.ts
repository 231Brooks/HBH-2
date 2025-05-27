import { formatCurrency, formatDate, formatDateTime, truncateText, calculateTimeAgo, getInitials } from "@/lib/utils"

describe("Utility Functions", () => {
  describe("formatCurrency", () => {
    it("formats currency correctly", () => {
      expect(formatCurrency(1000)).toBe("$1,000")
      expect(formatCurrency(1500)).toBe("$1,500")
      expect(formatCurrency(1000000)).toBe("$1,000,000")
    })
  })

  describe("formatDate", () => {
    it("formats date correctly", () => {
      const date = new Date("2023-01-15")
      expect(formatDate(date)).toMatch(/Jan 15, 2023/)
    })
  })

  describe("formatDateTime", () => {
    it("formats date and time correctly", () => {
      const date = new Date("2023-01-15T14:30:00")
      expect(formatDateTime(date)).toMatch(/Jan 15, 2023/)
      // Check for time format (exact format may vary by locale)
      expect(formatDateTime(date)).toMatch(/\d{1,2}:\d{2}/)
    })
  })

  describe("truncateText", () => {
    it("truncates text when longer than maxLength", () => {
      const text = "This is a long text that should be truncated"
      expect(truncateText(text, 10)).toBe("This is a ...")
    })

    it("does not truncate text when shorter than maxLength", () => {
      const text = "Short text"
      expect(truncateText(text, 20)).toBe("Short text")
    })
  })

  describe("calculateTimeAgo", () => {
    it("calculates seconds ago", () => {
      const now = new Date()
      const past = new Date(now.getTime() - 30 * 1000) // 30 seconds ago
      expect(calculateTimeAgo(past)).toMatch(/\d+ seconds ago/)
    })

    it("calculates minutes ago", () => {
      const now = new Date()
      const past = new Date(now.getTime() - 5 * 60 * 1000) // 5 minutes ago
      expect(calculateTimeAgo(past)).toMatch(/\d+ minute(s)? ago/)
    })

    it("calculates hours ago", () => {
      const now = new Date()
      const past = new Date(now.getTime() - 3 * 60 * 60 * 1000) // 3 hours ago
      expect(calculateTimeAgo(past)).toMatch(/\d+ hour(s)? ago/)
    })
  })

  describe("getInitials", () => {
    it("returns initials for a full name", () => {
      expect(getInitials("John Doe")).toBe("JD")
    })

    it("returns first letter for a single name", () => {
      expect(getInitials("John")).toBe("J")
    })

    it("returns empty string for empty name", () => {
      expect(getInitials("")).toBe("")
    })
  })
})
