"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDebounce } from "use-debounce";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { useSearchParams, useRouter } from "next/navigation";
import { SignedIn } from "@clerk/nextjs";
import { Spinner } from "./Spinner";

interface Post {
  id: string;
  title: string;
  url: string;
  score: number;
  created_at: string;
  author: string;
}

const DateFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<Post[]>([]);
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [debouncedQuery] = useDebounce(query, 300);
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1", 10) - 1);
  const [hitsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("query", debouncedQuery);
    params.set("page", (page + 1).toString());
    router.replace(`?${params.toString()}`);
  }, [debouncedQuery, page]);

  useEffect(() => {
    fetchData();
  }, [debouncedQuery, page, hitsPerPage, startDate, endDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        query: debouncedQuery,
        page: page.toString(),
        hitsPerPage: hitsPerPage.toString(),
      });

      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());

      const response = await fetch(`/api/getPosts?${params}`);
      const result = await response.json();

      if (response.ok) {
        setData(result.posts);
        setTotalPages(result.totalPages);
      } else {
        console.error("Failed to fetch posts:", result.error);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadData = () => {
    const json = JSON.stringify(data, null, 2); // Convert data to JSON with indentation
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json"; // Set the file name
    a.click();
    URL.revokeObjectURL(url); // Revoke the URL to free up memory
  };

  const columns: ColumnDef<Post>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "url", header: "URL" },
    { accessorKey: "score", header: "Score" },
    { accessorKey: "created_at", header: "Date" },
    { accessorKey: "author", header: "Author" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const generatePagination = () => {
    const maxVisiblePages = 5;
    const pages: (number | string)[] = [];
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page > 2) pages.push(0, "...");
      const start = Math.max(0, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (page < totalPages - 3) pages.push("...", totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="flex flex-col space-y-4">
      <SignedIn>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Search posts"
            className="border border-gray-300 p-2 rounded flex-grow"
          />
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
              setPage(0);
            }}
            isClearable
            placeholderText="Select date range"
            className="border border-gray-300 p-2 rounded"
          />
          <button
            onClick={downloadData}
            className="p-2 bg-blue-500 text-white rounded"
          >
            Download JSON
          </button>
        </div>
      </SignedIn>

      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-2">Results</h3>
        {loading ? (
          <Spinner />
        ) : (
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="border border-gray-300 p-2">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-100">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="border border-gray-300 p-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <div className="flex space-x-2">
          {generatePagination().map((item, index) =>
            typeof item === "string" ? (
              <span key={index} className="p-2 text-gray-500">
                {item}
              </span>
            ) : (
              <button
                key={index}
                onClick={() => setPage(item)}
                className={`p-2 rounded ${item === page ? "bg-blue-500 text-white" : "bg-gray-200"
                  }`}
              >
                {item + 1}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={page + 1 >= totalPages}
          className="p-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DateFilter;
