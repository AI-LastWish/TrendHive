import SummaryFilter from "@/components/SummaryFilter";

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
      <h1 className="text-2xl font-bold mb-4">Top 10 Posts Summary</h1>
      <SummaryFilter summaries={summaries} />
    </div>
  );
};

export default SummaryPage;
