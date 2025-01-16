"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DateFilter from '../components/DateFilter';
import Table from '../components/Table';
import CardView from '../components/CardView';

interface Post {
  id: string;          // Primary key
  title: string;       // Title of the post
  url: string;         // URL of the post
  score: number;       // Score of the post
  created_at: string;  // Timestamp of post creation
  author: string;      // Author of the post
}

const columns = [
  { accessorKey: 'title', header: 'Title' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'date', header: 'Date' },
];

const Home = () => {
  const [data, setData] = useState<Post[]>([]);
  const [filteredData, setFilteredData] = useState<Post[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const router = useRouter(); // Next.js navigation hook

  // Fetch posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/getPosts');
        const result = await response.json();

        if (response.ok) {
          setData(result.posts);
          setFilteredData(result.posts);
        } else {
          console.error('Failed to fetch posts:', result.error);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleDateChange = ([start, end]: [Date | null, Date | null]) => {
    if (start && end) {
      setFilteredData(
        data.filter((item) => {
          const itemDate = new Date(item.created_at); // Use created_at field
          return itemDate >= start && itemDate <= end;
        })
      );
    } else {
      setFilteredData(data);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <DateFilter onDateChange={handleDateChange} />
        <div>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 mr-2 ${viewMode === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Table View
          </button>
          <button
            onClick={() => setViewMode('card')}
            className={`p-2 ${viewMode === 'card' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Card View
          </button>
          <button
            onClick={() => router.push('/summary')} // Navigate to the Summary page
            className="p-2 bg-green-500 text-white rounded ml-4"
          >
            View Summary
          </button>
        </div>
      </div>
      {viewMode === 'table' ? (
        <Table data={filteredData} columns={columns} />
      ) : (
        <CardView data={filteredData} />
      )}
    </div>
  );
};

export default Home;
