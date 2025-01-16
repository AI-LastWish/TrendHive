import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is set in your .env file
});

async function generateSummaryForDay(date: string, posts: any[]) {
  const postDetails = posts
    .map((post, index) => `${index + 1}. ${post.title} - Score: ${post.score} by ${post.author}`)
    .join("\n");

  const prompt = `Here is a list of the top 10 posts for ${date}:\n\n${postDetails}\n\nWrite a summary of these posts in a concise and engaging manner.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error(`Error generating summary for ${date}:`, error);
    return "Summary generation failed.";
  }
}

export async function GET() {
  try {
    // Fetch all posts
    const { data, error } = await supabase.from("posts").select("*");

    if (error) {
      throw error;
    }

    // Group posts by day
    const groupedByDay = data.reduce((acc: Record<string, any[]>, post: any) => {
      const date = new Date(post.created_at).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(post);
      return acc;
    }, {});

    // Generate summaries for each day
    const summary = await Promise.all(
      Object.entries(groupedByDay).map(async ([date, posts]) => {
        const topPosts = posts
          .sort((a: any, b: any) => b.score - a.score)
          .slice(0, 10);
        const chatGPTSummary = await generateSummaryForDay(date, topPosts);
        return { date, topPosts, summary: chatGPTSummary };
      })
    );

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
