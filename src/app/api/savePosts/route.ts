import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { posts } = await req.json();

    if (!posts || !Array.isArray(posts)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Save posts using Supabase REST API
    const { data, error } = await supabase.from("posts").upsert(posts, {
      onConflict: "id", // Avoid inserting duplicates
    });

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save posts to the database" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Posts saved successfully", data });
  } catch (error) {
    console.error("Error saving posts:", error);
    return NextResponse.json({ error: "Failed to save posts" }, { status: 500 });
  }
}
