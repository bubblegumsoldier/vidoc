import { useEffect, useState } from "react";

export default function ProjectRoleBadge({ role }) {
  const mapping = {
    ADMIN: {
      label: "Admin",
      classes:
        "inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20",
    },
    CONTRIBUTOR: {
      label: "Contributor",
      classes:
        "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
    },
  };

  return <span className={mapping[role].classes}>{mapping[role].label}</span>;

}
