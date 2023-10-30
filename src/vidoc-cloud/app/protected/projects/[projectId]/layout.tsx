import { getProjectByIdForUser } from "../../../api/projects/[projectId]/route.js";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import Auth0Authentication from "../../../utils/Auth0Authentication";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import ProjectUsedStorage from "../../../components/ProjectUsedStorage";
import { ProjectNavigation } from "../../../components/ProjectNavigation";
import MembershipRepository from "../../../data-access/MembershipRepository";

export default withPageAuthRequired(async function ProjectLayout(req) {
  const projectId = req.params.projectId;
  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    undefined
  );
  const project = await getProjectByIdForUser(projectId, internalUser, false);
  const { children } = req as { children: React.ReactNode };

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
            {project?.repositoryUrl || "No Repository URL provided"}
          </sub>
          <div className="mt-2">
            <ProjectUsedStorage project={project} autoRefresh={true} />
          </div>
        </div>
      </header>
      <main>
        <div className="w-full px-4 py-2 bg-gray-100">
          <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
            <ProjectNavigation
              projectId={projectId}
              isAdmin={await MembershipRepository.isUserAdminOfProject(
                internalUser.id,
                projectId
              )}
            />
          </div>
        </div>
        {children}
      </main>
    </>
  );
});
