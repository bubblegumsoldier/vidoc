"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import CustomToastContainer from "./CustomToastContainer";
import { Spinner } from "@material-tailwind/react";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";

export default function ProjectSettings({ projectId, initialProjectValues }) {
  const [name, setName] = useState(initialProjectValues.name);
  const [repositoryUrl, setRepositoryUrl] = useState(
    initialProjectValues.repositoryUrl || ""
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    const payload = { name, repositoryUrl };
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.status !== 200) {
      const errorData = await response.json();
      toast(errorData.error, { type: "error" });
      setIsSaving(false);
      return;
    }
    toast("Project settings updated", { type: "success" });
    setIsSaving(false);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Project Settings
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Here you can set the general settings for your project.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Project Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="repositoryUrl"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Repository URL (optional)
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="repositoryUrl"
                  id="repositoryUrl"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  className="px-4 block w-full font-mono rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="text-right flex justify-end sm:col-span-4">
              <button
                type="button"
                className="bg-green-600 text-white rounded-md px-4 py-2 flex items-center space-x-2 active:bg-green-700 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleSave}
              >
                {isSaving ? (
                  <>
                    <Spinner /> <div>Saving...</div>
                  </>
                ) : (
                  <>
                    <CheckBadgeIcon className="w-4 h-4" /> <div>Save Changes</div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <CustomToastContainer />
    </form>
  );
}
