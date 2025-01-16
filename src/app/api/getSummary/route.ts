import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase.from("posts").select("*");

    if (error) {
      throw error;
    }

    const groupedByDay = data.reduce((acc: Record<string, any[]>, post: any) => {
      const date = new Date(post.created_at).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(post);
      return acc;
    }, {});

    const summary = Object.entries(groupedByDay).map(([date, posts]) => {
      const topPosts = posts
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 10);
      return { date, topPosts };
    });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
