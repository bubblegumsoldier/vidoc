"use client";

import { useState, useEffect, FormEvent, useRef, Fragment } from "react";
import UserPreview from "./UserPreview";
import ProjectRoleSelector from "./ProjectRoleSelector";
import {
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  PlusIcon,
  UserCircleIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Tooltip } from "@material-tailwind/react";
import { UserNotFound } from "../../data-access/errors";
import { Spinner } from "@material-tailwind/react";
import ProjectRoleBadge from "./ProjectRoleBadge";
import useInternalUser from "../../hooks/useInternalUser";
import { toast } from "react-toastify";
import CustomToastContainer from "./CustomToastContainer";
import { Dialog, Transition } from "@headlessui/react";

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
  if (response.status !== 200) {
    throw new Error((await response.json()).error);
  }
  return await response.json();
}

async function sendInvite(projectId, email, role) {
  const response = await fetch(`/api/projects/${projectId}/memberships`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, email }),
  });
  if (response.status === 404) {
    throw new UserNotFound();
  }
  if (!response.ok) {
    throw new Error((await response.json()).error);
  }
  if (response.status >= 400) {
    throw new Error((await response.json()).error);
  }
  return await response.json();
}

export default function ProjectCollaboratorManagement({
  projectId,
  initialMembers,
  isProjectAdmin,
}) {
  const [members, setMembers] = useState(initialMembers);
  const { user, error, isLoading } = useInternalUser();

  const [inviteRole, setInviteRole] = useState("CONTRIBUTOR");
  const [isInviting, setIsInviting] = useState(false);
  const [isProjectAdminLive, setIsProjectAdmin] = useState(isProjectAdmin);

  let [confirmIsOpen, setConfirmIsOpen] = useState(false);
  let [currentlySelectedDeleteId, setCurrentlySelectedDeleteId] =
    useState(null);

  const cancelButtonRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setMembers(initialMembers);
    setIsProjectAdmin(isProjectAdmin);
  }, [initialMembers, isProjectAdmin]);

  const refreshMembers = async () => {
    try {
      const updatedMembers = await getMembers(projectId);
      setMembers([...updatedMembers]);
      setIsProjectAdmin(
        updatedMembers.filter(
          (member) => member.role === "ADMIN" && member.user.id === user?.id
        ).length > 0
      );
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const handleRoleChange = async (membershipId, newRole) => {
    try {
      const updatedMemberships = members.map((membership) => {
        if (membership.id === membershipId) {
          membership.role = newRole;
        }
        return membership;
      });
      setMembers(updatedMemberships);
      await updateRole(projectId, membershipId, newRole);
      toast("Successfully updated role", {
        type: "success",
      });
    } catch (error) {
      console.error("Failed to update role:", error);
      toast(error.message, {
        type: "error",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });

      // You might want to call refreshMembers() here or handle the state update in another way
    } finally {
      await refreshMembers();
    }
  };

  const handleInviteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const target = event.currentTarget;
    try {
      setIsInviting(true);
      await sendInvite(projectId, email, inviteRole);
      await refreshMembers();
      toast("Successfully added user", {
        type: "success",
      });
    } catch (error) {
      if (error instanceof UserNotFound) {
        toast(
          "We did not find any user with the given email address. Are you sure the user exists?",
          {
            type: "error",
            autoClose: 5000,
          }
        );
        return;
      }
      toast(error.message, { type: "error" });
    } finally {
      setInviteRole("CONTRIBUTOR");
      target.reset();
      setIsInviting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/projects/${projectId}/memberships/${currentlySelectedDeleteId}`,
        {
          method: "DELETE",
        }
      );
      if (response.status !== 200) {
        throw new Error((await response.json()).error);
      }
      toast("Successfully removed user from project", {
        type: "success",
      });
    } catch (e) {
      toast(e.message, { type: "error", autoClose: 5000 });
    } finally {
      setCurrentlySelectedDeleteId(null);
      setIsDeleting(false);
      setConfirmIsOpen(false);
      await refreshMembers();
    }
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
                <div className="flex space-x-2 items-center">
                  <UserPreview user={membership.user} light />
                  {user && user?.id === membership.user.id ? (
                    <Tooltip content="You are this user" placement="right">
                      <UserCircleIcon className="w-4 h-4 text-gray-400" />
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                </div>
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {isProjectAdminLive ? (
                  <ProjectRoleSelector
                    key={membership.role}
                    defaultRole={membership.role}
                    onRoleSelect={async (newRole) =>
                      await handleRoleChange(membership.id, newRole)
                    }
                  />
                ) : (
                  <ProjectRoleBadge
                    key={membership.role}
                    role={membership.role}
                  />
                )}
              </td>
              <td className=" border-b border-gray-200">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={(e) => {
                    setCurrentlySelectedDeleteId(membership.id);
                    e.stopPropagation();
                    setConfirmIsOpen(true);
                  }}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isProjectAdminLive ? (
        <form className="space-y-2 mt-6" onSubmit={handleInviteSubmit}>
          <label className="text-black font-semibold">Invite user</label>
          <div className="flex items-center mt-8 space-x-4">
            <input
              type="text"
              placeholder="e.g. peter.parker@marvel.com"
              name="email"
              required
              className="block w-96 rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <ProjectRoleSelector
              defaultRole={inviteRole}
              onRoleSelect={(newRole) => setInviteRole(newRole)}
            />
            {isInviting ? (
              <>
                <Spinner />
              </>
            ) : (
              <>
                <button
                  type="submit"
                  className="rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <UserPlusIcon className="w-4 h-4" /> <span>Add Member</span>
                </button>
              </>
            )}
          </div>
        </form>
      ) : (
        <></>
      )}
      <Transition.Root show={confirmIsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setConfirmIsOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Remove User from Project
                        </Dialog.Title>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Are you sure you want to remove this user from the
                            project?
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-25"
                      onClick={() => handleDelete()}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Removing..." : "Remove User"}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-25"
                      onClick={() => setConfirmIsOpen(false)}
                      ref={cancelButtonRef}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <CustomToastContainer />
    </div>
  );
}
