import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || ""; // Search query
    const page = parseInt(searchParams.get("page") || "0", 10); // Pagination page
    const hitsPerPage = parseInt(searchParams.get("hitsPerPage") || "10", 10); // Items per page
    const offset = page * hitsPerPage; // Offset for pagination

    // Perform search with Supabase
    const { data: posts, error, count } = await supabase
      .from("posts")
      .select("*", { count: "exact" }) // Get exact count for total results
      .ilike("title", `%${query}%`) // Perform case-insensitive search in the "title" column
      .range(offset, offset + hitsPerPage - 1); // Pagination range

    if (error) {
      throw error;
    }

    return NextResponse.json({
      posts,                  // The actual posts
      totalHits: count || 0,  // Total number of results
      totalPages: Math.ceil((count || 0) / hitsPerPage), // Total pages
      currentPage: page,      // Current page
    });
  } catch (error) {
    console.error("Error performing Supabase search:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
