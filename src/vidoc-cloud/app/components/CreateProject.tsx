"use client";
// POST to /api/projects with values
// name: string
// repositoryUrl: string
// Show loading with spinner on loading button
// afterwards redirect to /protected/projects/:id

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";

async function createProject(data) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
}

export default function CreateProject() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const repositoryUrl = formData.get("repositoryUrl");

    setLoading(true);

    try {
      const data = await createProject({ name, repositoryUrl });
      mutate("/api/projects", data);
      router.push(`/protected/projects/${data.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      // You might want to show a user-friendly error message here
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Project Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    placeholder="e.g. vidoc-cloud"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="repositoryUrl"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Repository URL
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="repositoryUrl"
                    id="repositoryUrl"
                    autoComplete="repositoryUrl"
                    placeholder="https://github.com/bubblegumsoldier/vidoc.git"
                    className="block w-full px-2 font-mono rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="w-100">
              <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin mr-3">
                          {/* You can use any spinner icon you prefer */}
                          🌀
                        </span>
                        Creating...
                      </>
                    ) : (
                      "Create Project"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
