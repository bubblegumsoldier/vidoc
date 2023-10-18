import { Suspense } from "react";
import Projects from "../../components/Projects";

export default function ProjectsPage() {
  return (
    <main>
      <h1 className="text-xl font-bold leading-tight mt-4 mb-4">
        Your Projects
      </h1>
      <Projects />
    </main>
  );
}
