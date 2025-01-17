import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "", // Ensure this is set in your .env file
});

interface Post {
  id: string;
  title: string;
  url: string;
  score: number;
  created_at: string;
  author: string;
}

interface Summary {
  date: string;
  topPosts: Post[];
  summary: string;
}

// Function to generate a summary for a specific day
async function generateSummaryForDay(date: string, posts: Post[]): Promise<string> {
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

    return response.choices[0]?.message?.content?.trim() || "No summary available.";
  } catch (error) {
    console.error(`Error generating summary for ${date}:`, error);
    return "Summary generation failed.";
  }
}

// API Handler
export async function GET() {
  try {
    // Fetch all posts from Supabase
    const { data: posts, error } = await supabase.from("posts").select("*");

    if (error) {
      throw error;
    }

    if (!posts) {
      return NextResponse.json({ error: "No posts available" }, { status: 404 });
    }

    // Group posts by day
    const groupedByDay = posts.reduce<Record<string, Post[]>>((acc, post) => {
      const date = new Date(post.created_at).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(post);
      return acc;
    }, {});

    // Generate summaries for each day
    const summary: Summary[] = await Promise.all(
      Object.entries(groupedByDay).map(async ([date, posts]) => {
        const topPosts = posts.sort((a, b) => b.score - a.score).slice(0, 10);
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
