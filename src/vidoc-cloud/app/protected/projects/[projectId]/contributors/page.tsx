import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import ProjectCollaboratorManagement from "../../../../components/client/ProjectCollaboratorManagement";
import Auth0Authentication from "../../../../utils/Auth0Authentication";
import { getProjectByIdForUser } from "../../../../api/projects/[projectId]/route";

export default withPageAuthRequired(async function ProjectContributorsPage(
  req
) {
  const projectId = req.params.projectId;
  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    undefined
  );
  const project = await getProjectByIdForUser(projectId, internalUser, false);

  return (
    <>
      <div className="mx-auto py-6 max-w-7xl px-2 sm:px-6 lg:px-8 h-16">
        <ProjectCollaboratorManagement
          projectId={projectId}
          initialMembers={project.members}
        />
      </div>
    </>
  );
});
