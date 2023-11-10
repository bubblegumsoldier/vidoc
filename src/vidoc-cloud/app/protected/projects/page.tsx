import { Suspense } from "react";
import Projects from "../../components/Projects";

export default function ProjectsPage() {
  return (
    <main>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 h-16">
        <div className="body py-4">
          <h1 className="text-xl font-bold leading-tight mt-4 mb-4">
            Your Projects
          </h1>
          <p className="text-xs rounded mb-4 text-gray-500 w-1/2">
            A project should be created for each repository in which you are
            using Vidoc. You have a fixed amount of storage in each. If you need
            more storage you can upgrade your project.
          </p>

          <Projects />
        </div>
      </div>
    </main>
  );
}
