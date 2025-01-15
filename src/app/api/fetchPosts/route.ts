import axios from "axios";
import { supabase } from "@/lib/supabase"; // Supabase client
import { NextResponse } from "next/server";

const REDDIT_AUTH_URL = "https://www.reddit.com/api/v1/access_token";
const REDDIT_API_URL = "https://oauth.reddit.com";

export async function GET() {
  const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET } = process.env;

  if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Missing Reddit credentials in environment variables" },
      { status: 500 }
    );
  }

  try {
    // Fetch Reddit access token
    const tokenResponse = await axios.post(
      REDDIT_AUTH_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
      }).toString(),
      {
        auth: {
          username: REDDIT_CLIENT_ID,
          password: REDDIT_CLIENT_SECRET,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Next.js-Reddit-App",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Fetch top 10 posts from r/singapore
    const postsResponse = await axios.get(
      `${REDDIT_API_URL}/r/singapore/top`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "Next.js-Reddit-App",
        },
        params: {
          limit: 10,
          t: "day", // Fetch top posts of the day
        },
      }
    );

    const posts = postsResponse.data.data.children.map((post: any) => ({
      id: post.data.id,
      title: post.data.title,
      url: post.data.url,
      score: post.data.score,
      created_at: new Date(post.data.created_utc * 1000).toISOString(), // Convert to ISO timestamp
      author: post.data.author,
    }));

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

    return NextResponse.json({ message: "Posts fetched and saved successfully", data });
  } catch (error: any) {
    console.error("Reddit API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
