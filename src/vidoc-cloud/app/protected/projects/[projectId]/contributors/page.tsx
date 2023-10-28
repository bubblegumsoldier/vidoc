import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default withPageAuthRequired(async function ProjectContributorsPage() {
  return (
    <>
      <div>Test</div>
    </>
  );
});
