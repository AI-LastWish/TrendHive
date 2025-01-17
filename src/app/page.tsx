import DateFilter from "../components/DateFilter";

interface Post {
  id: string;
  title: string;
  url: string;
  score: number;
  created_at: string;
  author: string;
}

const Home = async () => {
  // Fetch posts data directly on the server
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getPosts`, {
    cache: "no-store", // Ensures fresh data for every request
  });
  const result = await response.json();
  const initialData: Post[] = result.posts || [];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {/* Pass data for filtering to a client component */}
        <DateFilter initialData={initialData} />
      </div>
    </div>
  );
};

export default Home;
