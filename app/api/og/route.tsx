import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const title = searchParams.get("title") || "HBH - Homes in Better Hands"

    return new ImageResponse(
      <div
        style={{
          display: "flex",
          fontSize: 60,
          color: "black",
          background: "#EBEBEB",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          textAlign: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 30, opacity: 0.8 }}>HBH</div>
          <div
            style={{
              fontSize: 70,
              fontWeight: "bold",
              marginTop: 20,
              maxWidth: "80%",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 30,
              marginTop: 20,
              color: "#CBC5EC",
            }}
          >
            Homes in Better Hands
          </div>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (e) {
    console.error(e)
    return new Response("Failed to generate OG image", { status: 500 })
  }
}
