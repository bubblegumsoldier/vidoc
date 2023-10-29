"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export function ProjectNavigation({ projectId, isAdmin }) {
  const pathname = usePathname();

  return (
    <nav className="space-x-8 flex" aria-label="Project Tabs">
      <Link href={`/protected/projects/${projectId}/contributors`}>
        <div
          className={`py-1 font-medium border-b-2 border-transparent text-sm hover:text-gray-800 ${
            pathname.endsWith("/contributors")
              ? "text-black font-semibold border-b-2 border-solid border-gray-600"
              : "text-gray-600 hover:border-b-2 hover:border-solid hover:border-gray-600"
          }`}
        >
          Contributors
        </div>
      </Link>
      {isAdmin && (
        <Link href={`/protected/projects/${projectId}/settings`}>
          <div
            className={`py-1 font-medium border-b-2 border-transparent text-sm hover:text-gray-800 ${
              pathname.endsWith("/settings")
                ? "text-black font-semibold border-b-2 border-solid border-gray-600"
                : "text-gray-600 hover:border-b-2 hover:border-solid hover:border-gray-600"
            }`}
          >
            Project Settings
          </div>
        </Link>
      )}

      <Link href={`/protected/projects/${projectId}/setup`}>
        <div
          className={`py-1 font-medium border-b-2 border-transparent text-sm hover:text-gray-800 ${
            pathname.endsWith("/setup")
              ? "text-black font-semibold border-b-2 border-solid border-gray-600"
              : "text-gray-600 hover:border-b-2 hover:border-solid hover:border-gray-600"
          }`}
        >
          Setup
        </div>
      </Link>
    </nav>
  );
}
