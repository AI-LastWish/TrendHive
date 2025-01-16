"use client";

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

interface Post {
  id: string;
  title: string;
  url: string;
  score: number;
  created_at: string;
  author: string;
}

const DateFilter = ({ initialData }: { initialData: Post[] }) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [filteredData, setFilteredData] = useState<Post[]>(initialData);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (startDate && endDate) {
      const filtered = initialData.filter((post) => {
        const postDate = new Date(post.created_at);
        return postDate >= startDate && postDate <= endDate;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(initialData);
    }
  }, [startDate, endDate, initialData]);

  // Define columns for the table
  const columns: ColumnDef<Post, any>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "url", header: "Url" },
    { accessorKey: "score", header: "Score" },
    { accessorKey: "created_at", header: "Date" },
    { accessorKey: "author", header: "Author" },
  ];

  // Initialize table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col space-y-4">
      {/* Date Range Picker */}
      <div className="flex items-center space-x-4">
        <div className="flex-grow">
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => setDateRange(update)}
            isClearable
            placeholderText="Select date range"
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <Link
          href="/summary"
          className="p-2 bg-green-500 text-white rounded ml-auto"
        >
          View Summary
        </Link>
      </div>

      {/* Table to Display Filtered Results */}
      <div className="overflow-x-auto">
        <h3 className="text-lg font-semibold mb-2">Filtered Results</h3>
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
      </div>
    </div>
  );
};

export default DateFilter;
