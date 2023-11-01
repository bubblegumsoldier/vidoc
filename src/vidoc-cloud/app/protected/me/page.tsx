import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import Auth0Authentication from "../../utils/Auth0Authentication";
import UpdateUserForm from "../../components/client/UpdateProfile";

export default withPageAuthRequired(async function ProjectContributorsPage(
  req
) {
  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    undefined
  );

  return (
    <>
      <div className="mx-auto py-6 max-w-7xl px-2 sm:px-6 lg:px-8 h-16">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mt-4">
          Hello {internalUser.name}!
        </h1>
        <div className="mt-4">
          <UpdateUserForm
            initialEmail={internalUser.email}
            initialName={internalUser.name}
          />
        </div>
      </div>
    </>
  );
});
