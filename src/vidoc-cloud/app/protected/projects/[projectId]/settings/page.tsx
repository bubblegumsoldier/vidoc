import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Auth0Authentication from "../../../../utils/Auth0Authentication";
import { getProjectByIdForUser } from "../../../../api/projects/[projectId]/route";
import ProjectSettings from "../../../../components/client/ProjectSettings";

export default withPageAuthRequired(async function ProjectSettingsPage(req) {
  const projectId = req.params.projectId;

  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    undefined
  );
  const project = await getProjectByIdForUser(projectId, internalUser, false);

  return (
    <>
      <div className="mx-auto py-6 max-w-7xl px-2 sm:px-6 lg:px-8 h-16">
        <ProjectSettings projectId={projectId} initialProjectValues={project} />
      </div>
    </>
  );
});
