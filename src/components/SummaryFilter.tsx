"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface Post {
  id: string;
  url: string;
  title: string;
  score: number;
  author: string;
}

export interface Summary {
  date: string;
  topPosts: Post[];
  summary: string; // ChatGPT-generated summary
}

const SummaryFilter = ({ summaries }: { summaries: Summary[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const itemsPerPage = 1; // Number of summaries per page
  const totalPages = Math.ceil(summaries.length / itemsPerPage);

  const initialPage = parseInt(searchParams.get("page") || "1", 10) - 1; // Convert to 0-based index
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (currentPage + 1).toString()); // Store 1-based page in URL
    router.push(`?${params.toString()}`);
  }, [currentPage, router, searchParams]);

  const currentSummaries = summaries.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1 || Math.abs(i - currentPage) <= 1) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`p-2 rounded ${
              i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        );
      } else if (pages[pages.length - 1]?.key !== "ellipsis-" + i) {
        pages.push(
          <span key={"ellipsis-" + i} className="p-2">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div>
      {currentSummaries.map(({ date, topPosts, summary: chatGPTSummary }) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{date}</h2>
          <p className="text-gray-700 mb-4">{chatGPTSummary}</p>
          <ul className="list-disc pl-5">
            {topPosts.map((post) => (
              <li key={post.id}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {post.title}
                </a>{" "}
                - Score: {post.score}, Author: {post.author}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex space-x-2">{renderPageNumbers()}</div>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SummaryFilter;
