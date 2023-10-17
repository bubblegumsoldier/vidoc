// app/products/page.jsx
'use client'
import useSWR from 'swr';

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default function Projects() {
  const { data, error } = useSWR('/api/projects', fetcher);
  if (error) return <div>oops... {error.message}</div>;
  if (data === undefined) return <div>Loading...</div>;
  return <div>{data.protected}</div>;
};