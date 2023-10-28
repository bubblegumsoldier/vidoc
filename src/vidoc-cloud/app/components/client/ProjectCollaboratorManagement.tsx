"use client";

import { useState, useEffect } from "react";
import UserPreview from "./UserPreview";
import ProjectRoleSelector from "./ProjectRoleSelector";
import { PlusIcon } from "@heroicons/react/20/solid";

async function getMembers(projectId) {
  const response = await fetch(`/api/projects/${projectId}/memberships`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

async function updateRole(projectId, membershipId, newRole) {
  const response = await fetch(
    `/api/projects/${projectId}/memberships/${membershipId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: newRole }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update role");
  }
  return await response.json();
}

export default function ProjectCollaboratorManagement({
  projectId,
  initialMembers,
}) {
  const [members, setMembers] = useState(initialMembers);

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const refreshMembers = async () => {
    try {
      const updatedMembers = await getMembers(projectId);
      setMembers(updatedMembers);
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const handleRoleChange = async (membershipId, newRole) => {
    try {
      await updateRole(projectId, membershipId, newRole);
      // You might want to call refreshMembers() here or handle the state update in another way
      refreshMembers();
    } catch (error) {
      console.error("Failed to update role:", error);
    }
  };

  const handleAddMember = async () => {
    // ...
  };

  return (
    <div className="container mx-auto mt-4">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 w-1/2 border-b border-gray-200 text-left text-gray-600 bg-gray-100">
              User
            </th>
            <th className="py-2 px-4 w-1/2 border-b border-gray-200 text-left text-gray-600 bg-gray-100">
              Role
            </th>
            <th className="border-b border-gray-200 text-left text-gray-600 bg-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          {members.map((membership, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b border-gray-200">
                <UserPreview user={membership.user} light />
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                <ProjectRoleSelector
                  defaultRole={membership.role}
                  onRoleSelect={(newRole) =>
                    handleRoleChange(membership.id, newRole)
                  }
                />
              </td>
              <td className=" border-b border-gray-200">
                <button className="text-red-500 hover:text-red-700">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center mt-8">
        <input
          type="text"
          className="block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
