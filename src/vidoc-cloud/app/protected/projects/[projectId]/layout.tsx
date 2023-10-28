import { getProjectByIdForUser } from "../../../api/projects/[projectId]/route.js";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Auth0Authentication from "../../../utils/Auth0Authentication";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

export default withPageAuthRequired(async function ProjectPage(req) {
  const projectId = req.params.projectId;
  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    undefined
  );
  const project = await getProjectByIdForUser(projectId, internalUser, false);

  return (
    <>
      <header className="bg-white shadow z-10 relative">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex space-x-2 items-center">
            <Link href="..">
              <ArrowLeftIcon
                className="h-8 w-8 text-gray-500 rounded-full hover:bg-gray-100 cursor-pointer p-1"
                aria-hidden="true"
              />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {project?.name}
            </h1>
          </div>
          <sub className="text-sm text-gray-500">
            {project?.repositoryUrl || "No description provided"}
          </sub>
        </div>
      </header>
      <main>
        <div className="w-full px-4 py-1 bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
            <nav className="space-x-8 flex" aria-label="Project Tabs">
              <Link href={`/protected/projects/${projectId}/`}>
                <div className="py-2 text-black font-medium text-sm border-b-2 border-solid border-gray-600">
                  Project Info
                </div>
              </Link>
              <Link href={`/protected/projects/${projectId}/contributors`}>
                <div className="py-2 text-gray-600 font-medium border-b-2 border-transparent text-sm hover:text-gray-800 hover:border-b-2 hover:border-solid hover:border-gray-600">
                  Contributors
                </div>
              </Link>
              <Link href={`/protected/projects/${projectId}/settings`}>
                <div className="py-2 text-gray-600 font-medium border-b-2 border-transparent text-sm hover:text-gray-800 hover:border-b-2 hover:border-solid hover:border-gray-600">
                  Project Settings
                </div>
              </Link>
            </nav>
          </div>
        </div>
      </main>
    </>
  );
});
