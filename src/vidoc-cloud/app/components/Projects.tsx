// app/products/page.jsx
'use client'
import useSWR from 'swr';

const fetcher = async (uri) => {
  const response = await fetch(uri);
  return response.json();
};

export default function Projects() {
  //api/projects/6cc813be-e24d-4625-aa7f-828daa271fd2/memberships/fe8392b2-ad51-4cee-8510-726709d6bbe1
  const { data, error } = useSWR('/api/projects/6cc813be-e24d-4625-aa7f-828daa271fd2?updateStorage=1', fetcher);
  const text = JSON.stringify(data);
  if (error) return <div>oops... {error.message}</div>;
  if (data === undefined) return <div>Loading...</div>;
  return <div>{text}</div>;
};