import { test, expect } from "@playwright/test"

test.describe("Marketplace Page", () => {
  test("loads properties and allows filtering", async ({ page }) => {
    // Navigate to marketplace
    await page.goto("/marketplace")

    // Wait for properties to load
    await page.waitForSelector('[data-testid="property-card"]')

    // Check if properties are displayed
    const propertyCards = await page.$$('[data-testid="property-card"]')
    expect(propertyCards.length).toBeGreaterThan(0)

    // Apply price filter
    await page.getByLabel("Min Price").fill("100000")
    await page.getByLabel("Max Price").fill("500000")
    await page.getByRole("button", { name: "Apply Filters" }).click()

    // Wait for filtered results
    await page.waitForResponse((response) => response.url().includes("/api/properties") && response.status() === 200)

    // Check filtered results
    const filteredCards = await page.$$('[data-testid="property-card"]')
    expect(filteredCards.length).toBeGreaterThan(0)

    // Check property details
    await filteredCards[0].click()

    // Verify navigation to property details page
    await expect(page).toHaveURL(/\/marketplace\/property\//)

    // Check property details content
    await expect(page.getByTestId("property-title")).toBeVisible()
    await expect(page.getByTestId("property-price")).toBeVisible()
  })
})
