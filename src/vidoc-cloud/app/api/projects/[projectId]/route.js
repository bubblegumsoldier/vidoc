import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import UserRepository from "../../../data-access/UserRepository";
import MembershipRepository from "../../../data-access/MembershipRepository";
import ProjectRepository from "../../../data-access/ProjectRepository";
import { ProjectStorage } from "../../../data-access/ProjectStorage";

export const GET = async function getProjectById(req, { params }) {
  const res = new NextResponse();
  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    res
  );
  if (!internalUser) {
    return NextResponse.json(
      { error: "Failed to find authenticated user." },
      res,
      401
    );
  }
  const { projectId } = params; // Get projectId from the route
  const { searchParams } = new URL(req.url);
  const param = searchParams.get("updateStorage");
  let project;
  if (param) {
    project = await ProjectStorage.updateUsedStorageOfProject(projectId);
  } else {
    project = await ProjectRepository.getProjectById(projectId);
  }
  if (!MembershipRepository.isUserMemberOfProject(internalUser.id, projectId)) {
    return NextResponse.json(
      { error: "Only members can view the project details." },
      res,
      403
    );
  }
  return NextResponse.json(project, res);
};

export const PATCH = async function updateProject(req, { params }) {
  const res = new NextResponse();
  const { name, repositoryUrl } = req.body;
  const { projectId } = params; // Get projectId from the route

  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    res
  );
  if (!internalUser) {
    return NextResponse.json(
      { error: "Failed to find authenticated user." },
      res,
      401
    );
  }

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
};

export const DELETE = async function deleteProject(req, { params }) {
  const res = new NextResponse();
  const { projectId } = params; // Get projectId from the route

  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    res
  );
  if (!internalUser) {
    return NextResponse.json(
      { error: "Failed to find authenticated user." },
      res,
      401
    );
  }

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
};
