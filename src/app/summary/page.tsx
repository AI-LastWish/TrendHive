import SummaryFilterWrapper from "@/components/SummaryFilterWrapper";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import CurrentPageDownloadButton from "@/components/CurrentPageDownloadButton";

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
  summary: string; // ChatGPT-generated summary
}

const SummaryPage = async () => {
  // Fetch data server-side
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getSummary`, {
    cache: "no-store", // Ensure fresh data on each request
  });
  const result = await response.json();

  if (!response.ok) {
    console.error("Failed to fetch summary:", result.error);
    return <div>Error fetching summary data.</div>;
  }

  const summaries: Summary[] = result.summary || [];

  // Sort summaries by date in descending order
  summaries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto p-4">
      <SignedIn>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Top 10 Posts related to Singapore Summary</h1>
          {/* Pass all summaries to the client component */}
          <CurrentPageDownloadButton summaries={summaries} />
        </div>
        <SummaryFilterWrapper summaries={summaries} />
      </SignedIn>
      <SignedOut>
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-4">
            You need to be signed in to view this page.
          </p>
          <SignInButton>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </div>
  );
};

export default SummaryPage;
