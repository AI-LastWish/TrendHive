"use client";
import React, { useEffect, useState } from "react";

const SummaryPage = () => {
  interface Post {
    id: string;
    url: string;
    title: string;
    score: number;
    author: string;
  }

  interface Summary {
    date: string;
    topPosts: Post[];
    summary: string; // Added field for ChatGPT-generated summary
  }

  const [summary, setSummary] = useState<Summary[]>([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch("/api/getSummary");
        const result = await response.json();

        if (response.ok) {
          setSummary(result.summary);
        } else {
          console.error("Failed to fetch summary:", result.error);
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top 10 Posts Summary</h1>
      {summary.map(({ date, topPosts, summary: chatGPTSummary }) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{date}</h2>
          <p className="text-gray-700 mb-4">{chatGPTSummary}</p> {/* Display ChatGPT summary */}
          <ul className="list-disc pl-5">
            {topPosts.map((post) => (
              <li key={post.id}>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {post.title}
                </a>{" "}
                - Score: {post.score}, Author: {post.author}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SummaryPage;
