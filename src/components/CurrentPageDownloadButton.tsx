"use client";

import { useSearchParams } from "next/navigation";

interface CurrentPageDownloadButtonProps {
  summaries: object[]; // Replace with your specific type if necessary
}

const CurrentPageDownloadButton: React.FC<CurrentPageDownloadButtonProps> = ({
  summaries,
}) => {
  const searchParams = useSearchParams();

  // Get current page from URL
  const pageQuery = searchParams.get("page");
  const page = Math.max(parseInt(pageQuery || "1", 10) - 1, 0); // Convert 1-based to 0-based index

  // Pagination logic
  const hitsPerPage = 1; // Number of items per page
  const startIndex = page * hitsPerPage;
  const endIndex = startIndex + hitsPerPage;
  const currentPageSummaries = summaries.slice(startIndex, endIndex); // Data for the current page

  const downloadCurrentPageData = () => {
    const json = JSON.stringify(currentPageSummaries, null, 2); // Convert data to JSON with indentation
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "current-page-data.json"; // Set the file name
    a.click();
    URL.revokeObjectURL(url); // Revoke the URL to free up memory
  };

  return (
    <button
      onClick={downloadCurrentPageData}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
    >
      Download Current Page Data
    </button>
  );
};

export default CurrentPageDownloadButton;
