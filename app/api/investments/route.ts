import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import type { Investment } from "@/types/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let investments: Investment[]

    if (type) {
      investments = await query<Investment>("SELECT * FROM investments WHERE type = $1 ORDER BY name", [type])
    } else {
      investments = await query<Investment>("SELECT * FROM investments ORDER BY name")
    }

    return NextResponse.json(investments)
  } catch (error) {
    console.error("Error fetching investments:", error)
    return NextResponse.json({ error: "Failed to fetch investments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, type, price, image_url } = await request.json()

    const result = await query<Investment>(
      `INSERT INTO investments (name, description, type, price, image_url) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, description, type, price, image_url],
    )

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating investment:", error)
    return NextResponse.json({ error: "Failed to create investment" }, { status: 500 })
  }
}
