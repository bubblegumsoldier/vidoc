import { redirect } from "next/navigation";

export default function ProjectHome(req) {
  const projectId = req.params.projectId;
  return redirect(`/protected/projects/${projectId}/contributors`);
}
