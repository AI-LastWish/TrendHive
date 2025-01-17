import axios from "axios";
import { supabase } from "@/lib/supabase"; // Supabase client
import { NextResponse } from "next/server";

const REDDIT_AUTH_URL = "https://www.reddit.com/api/v1/access_token";
const REDDIT_API_URL = "https://oauth.reddit.com";

interface RedditPostData {
  id: string;
  title: string;
  url: string;
  score: number;
  created_utc: number; // Unix timestamp
  author: string;
}

interface RedditApiResponse {
  data: {
    children: {
      data: RedditPostData;
    }[];
  };
}

interface Post {
  id: string;
  title: string;
  url: string;
  score: number;
  created_at: string;
  author: string;
}

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
    const postsResponse = await axios.get<RedditApiResponse>(
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

    // Map Reddit posts to your Post schema
    const posts: Post[] = postsResponse.data.data.children.map(({ data: post }) => ({
      id: post.id,
      title: post.title,
      url: post.url,
      score: post.score,
      created_at: new Date(post.created_utc * 1000).toISOString(), // Convert to ISO timestamp
      author: post.author,
    }));

    // Save posts using Supabase
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
  } catch (error) {
    // Safely handle Axios errors
    if (axios.isAxiosError(error)) {
      console.error("Reddit API Error:", error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data || "Failed to fetch posts" },
        { status: error.response?.status || 500 }
      );
    }

    // Handle non-Axios errors
    console.error("Unexpected Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
