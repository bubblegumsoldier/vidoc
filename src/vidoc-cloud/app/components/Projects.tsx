// app/products/page.jsx
"use client";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import useSWR from "swr";
import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  CurrencyDollarIcon,
  LinkIcon,
  MapPinIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Project } from "prisma";
import ProgressBar from "./ProgressBar";
import BytesToString from "../utils/BytesToString";

const fetcher = async (uri) => {
  const response = await fetch(uri, {
    next: {
      revalidate: 0,
    },
  });
  return response.json();
};

export default function Projects() {
  //api/projects/6cc813be-e24d-4625-aa7f-828daa271fd2/memberships/fe8392b2-ad51-4cee-8510-726709d6bbe1
  const { data, error } = useSWR("/api/projects", fetcher);
  return (
    <>
      <ul className="flex flex-col space-y-4">
        {data?.map((project: Project) => (
          <li key={project.id} className="hover-parent">
            <Link href={`/protected/projects/${project.id}`}>
              <div className="lg:flex lg:items-center space-x-6 lg:justify-between rounded border border-gray-200  p-4 bg-white rounded hover:shadow-lg transition-shadow duration-200 ease-out">
                <div className="min-w-0 flex-1">
                  <h2 className="text-l font-bold leading-2 text-gray-900 sm:truncate sm:text-l sm:tracking-tight">
                    {project.name}
                  </h2>
                  <div className="text-xs text-gray-500">
                    {project.repositoryUrl}
                  </div>
                  <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      {BytesToString.convert(project.usedMemory)}
                    </div>
                    <div className="mt-2 flex flex-1 items-center text-sm text-gray-500">
                      <ProgressBar
                        progress={
                          project.usedMemory / project.tier?.maxStorageBytes || 1
                        }
                      />
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 mr-4">
                      {BytesToString.convert(
                        project.tier?.maxStorageBytes || 0
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex lg:ml-4 lg:mt-0 hover-child">
                  <span className="hidden sm:block">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <PencilIcon
                        className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      Edit
                    </button>
                  </span>

                  <span className="sm:ml-3">
                    <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-red-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      <TrashIcon
                        className="-ml-0.5 mr-1.5 h-5 w-5"
                        aria-hidden="true"
                      />
                      Delete
                    </button>
                  </span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/protected/projects/new">
        <button className="relative flex rounded bg-white items-center text-gray-700 hover:bg-white hover:text-gray-500 mt-4 space-x-2 flex-row bg-gray-800 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <PlusCircleIcon
            className="-ml-0.5 mr-1.5 h-5 w-5"
            aria-hidden="true"
          />
          Create New Project
        </button>
      </Link>
    </>
  );
}
