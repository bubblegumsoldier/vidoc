import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import UserRepository from "../../../data-access/UserRepository";
import MembershipRepository from "../../../data-access/MembershipRepository";
import ProjectRepository from "../../../data-access/ProjectRepository";

export const GET = withApiAuthRequired(async function getProjectById(req, {params}) {
  const res = new NextResponse();
  const { projectId } = params; // Get projectId from the route
  const internalUser = await UserRepository.getCurrentUser(req, res);
  const project = await ProjectRepository.getProjectById(projectId);
  if (!MembershipRepository.isUserMemberOfProject(internalUser.id, projectId)) {
    return NextResponse.json(
      { error: "Only members can view the project details." },
      res,
      403
    );
  }
  return NextResponse.json(project, res);
});

export const PATCH = withApiAuthRequired(async function updateProject(req) {
  const res = new NextResponse();
  const { name, repositoryUrl } = req.body;
  const projectId = req.query.id; // Get projectId from the route

  const internalUser = await UserRepository.getCurrentUser(req, res);

  // Check if the current user is the admin of the project
  if (
    !(await MembershipRepository.isUserAdminOfProject(
      internalUser.id,
      projectId
    ))
  ) {
    return NextResponse.json(
      { error: "Only the admin can update the project details." },
      res,
      403
    );
  }

  const updatedProject = await ProjectRepository.updateProject(projectId, {
    name,
    repositoryUrl,
  });

  if (!updatedProject) {
    return NextResponse.json(
      { error: "Failed to update the project." },
      res,
      500
    );
  }

  return NextResponse.json(updatedProject, res);
});

export const DELETE = withApiAuthRequired(async function deleteProject(req) {
  const res = new NextResponse();
  const projectId = req.query.id; // Get projectId from the route

  const internalUser = await UserRepository.getCurrentUser(req, res);

  // Check if the current user is the admin of the project
  if (
    !(await MembershipRepository.isUserAdminOfProject(
      internalUser.id,
      projectId
    ))
  ) {
    return NextResponse.json(
      { error: "Only the admin can delete the project." },
      res,
      403
    );
  }

  const wasDeleted = await ProjectRepository.deleteProject(projectId);

  if (!wasDeleted) {
    return NextResponse.json(
      { error: "Failed to delete the project." },
      res,
      500
    );
  }

  return NextResponse.json({ message: "Project deleted successfully" }, res);
});
