import http from "k6/http"
import { sleep, check } from "k6"

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Ramp up to 20 users
    { duration: "1m", target: 20 }, // Stay at 20 users for 1 minute
    { duration: "30s", target: 50 }, // Ramp up to 50 users
    { duration: "1m", target: 50 }, // Stay at 50 users for 1 minute
    { duration: "30s", target: 0 }, // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests must complete below 500ms
    http_req_failed: ["rate<0.01"], // Less than 1% of requests can fail
  },
}

export default function () {
  // Test property listing page
  const listingRes = http.get("https://yourdomain.com/marketplace")
  check(listingRes, {
    "listing status is 200": (r) => r.status === 200,
    "listing has properties": (r) => r.body.includes("property-card"),
  })

  sleep(1)

  // Test property search with filters
  const searchRes = http.get("https://yourdomain.com/api/properties?minPrice=100000&maxPrice=500000&bedrooms=3")
  check(searchRes, {
    "search status is 200": (r) => r.status === 200,
    "search returns JSON": (r) => r.headers["Content-Type"].includes("application/json"),
    "search has results": (r) => JSON.parse(r.body).length > 0,
  })

  sleep(2)

  // Test property details page
  const propertyId = "1" // Replace with a valid ID from your system
  const detailsRes = http.get(`https://yourdomain.com/marketplace/property/${propertyId}`)
  check(detailsRes, {
    "details status is 200": (r) => r.status === 200,
    "details has property info": (r) => r.body.includes("property-title"),
  })

  sleep(3)
}
