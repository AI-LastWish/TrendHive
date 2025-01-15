import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await query("SELECT NOW()");
    return NextResponse.json({ message: "Database connected!", timestamp: result.rows[0].now });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: "Failed to connect to the database" }, { status: 500 });
  }
}
