// app/products/page.jsx
// "use client";
import Link from "next/link";
import {
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Project } from "prisma";
import ProgressBar from "./ProgressBar";
import BytesToString from "../utils/BytesToString";
import { GET as getProjects } from "../api/projects/route.js";
import DeleteProjectButton from "./client/DeleteProjectButton";
import ProjectUsedStorage from "./ProjectUsedStorage";

export default async function Projects(req) {
  //api/projects/6cc813be-e24d-4625-aa7f-828daa271fd2/memberships/fe8392b2-ad51-4cee-8510-726709d6bbe1
  const res = await getProjects();
  const data = await res.json();
  return (
    <>
      <ul className="flex flex-col space-y-4">
        {data
          ?.filter((project: Project) => project.scheduledForDeletion === null)
          .map((project: Project) => (
            <li key={project.id} className="hover-parent">
              <div className="lg:flex lg:items-center space-x-6 lg:justify-between rounded border border-gray-200  p-4 bg-white rounded hover:shadow-lg transition-shadow duration-200 ease-out">
                <Link href={`/protected/projects/${project.id}`} className="w-100 flex flex-1">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-l font-bold leading-2 text-gray-900 sm:truncate sm:text-l sm:tracking-tight">
                      {project.name}
                    </h2>
                    <div className="text-xs text-gray-500">
                      {project.repositoryUrl}
                    </div>
                    <ProjectUsedStorage project={project} />
                  </div>
                </Link>
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
                    <DeleteProjectButton projectId={project.id} />
                  </span>
                </div>
              </div>
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
