import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import ProjectCollaboratorManagement from "../../../../components/client/ProjectCollaboratorManagement";
import Auth0Authentication from "../../../../utils/Auth0Authentication";
import { getProjectByIdForUser } from "../../../../api/projects/[projectId]/route";
import MembershipRepository from "../../../../data-access/MembershipRepository";

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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-4">
          Interested in an upgrade?
        </h1>
        <p className="text-sm text-gray-700 mt-4">
          An upgrade not only will allow you to upload more and longer videos,
          but you will support the team behind Vidoc Cloud and help us to keep
          the service running.
        </p>
        <p className="text-sm text-gray-700 mt-4">
          We do not put a restriction on our service to make money, we just want
          to make sure we don't run out of money by providing everything for
          free. This essentially is an Open-Source project and we want to keep
          it that way.
        </p>
        <p className="mt-4 text-sm text-gray-700">
          To focus on the essentials we decided not to implement a payment
          system yet. Instead, we ask you to send us an email to
          <a
            href={`mailto:hm@hm-dev-consulting.de?subject=${encodeURIComponent(
              "Upgrade for " + projectId
            )}&body=${encodeURIComponent(
              'I would be interested in the upgrade options for the project "' +
                projectId +
                '".'
            )}`}
            className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
          >
            hm@hm-dev-consulting.de
          </a>
          . We will get back to you as soon as possible and provide you with the
          options.
        </p>
      </div>
    </>
  );
});
