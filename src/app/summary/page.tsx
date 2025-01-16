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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top 10 Posts Summary</h1>
      {summaries.map(({ date, topPosts, summary: chatGPTSummary }) => (
        <div key={date} className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{date}</h2>
          <p className="text-gray-700 mb-4">{chatGPTSummary}</p> {/* Display ChatGPT summary */}
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
    </div>
  );
};

export default SummaryPage;
