"use client";

import { Spinner } from "@material-tailwind/react";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomToastContainer from "./CustomToastContainer";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";

export default function UpdateUserForm({ initialEmail, initialName }) {
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const response = await fetch("/api/auth/my-user/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name }),
      next: { revalidate: 0 },
    });

    setIsSaving(false);

    if (response.status !== 200) {
      const data = await response.json();
      toast(data.error, { type: "error" });
      // Reset form values to their original values
      setEmail(initialEmail);
      setName(initialName);
      return;
    }
    toast("Profile updated", { type: "success" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
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
            E-Mail
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="text-right flex justify-end sm:col-span-4">
          <button
            type="button"
            className="bg-green-600 text-white rounded-md px-4 py-2 flex items-center space-x-2 active:bg-green-700 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSubmit}
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
      <CustomToastContainer />
    </form>
  );
}
