import CreateProject from "../../../components/CreateProject";

export default function CreateProjectPage() {
  return (
    <main>
      <h1 className="text-xl font-bold leading-tight mt-4 mb-4">
        Create Project
      </h1>
      <p className="text-xs rounded mb-4 text-gray-500 w-1/2">
        A project should be created for each repository in which you are using
        Vidoc. You have a fixed amount of storage in each. If you need more
        storage you can upgrade your project.
      </p>

      <CreateProject />
    </main>
  );
}
