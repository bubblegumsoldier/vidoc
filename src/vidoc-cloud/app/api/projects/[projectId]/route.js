import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import UserRepository from "../../../data-access/UserRepository";
import MembershipRepository from "../../../data-access/MembershipRepository";
import ProjectRepository from "../../../data-access/ProjectRepository";
import { ProjectStorage } from "../../../data-access/ProjectStorage";
import Auth0Authentication from "../../../utils/Auth0Authentication";

export async function getProjectByIdForUser(
  projectId,
  internalUser,
  updateStorage = false
) {
  let project;
  if (updateStorage) {
    project = await ProjectStorage.updateUsedStorageOfProject(projectId);
  } else {
    project = await ProjectRepository.getProjectById(projectId);
  }
  if (!MembershipRepository.isUserMemberOfProject(internalUser.id, projectId)) {
    throw Error("Only members can view the project details");
  }
  return project;
}

export const GET = async function getProjectById(req, { params }) {
  const res = new NextResponse();
  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    res
  );
  const { projectId } = params; // Get projectId from the route
  if (!internalUser) {
    return NextResponse.json(
      { error: "Failed to find authenticated user." },
      res,
      401
    );
  }
  const { searchParams } = new URL(req.url);
  const param = searchParams.get("updateStorage");
  try {
    const project = await getProjectByIdForUser(projectId, internalUser, !!param);
    return NextResponse.json(project, res);
  } catch (e) {
    return NextResponse.json({ error: e.message }, res, 403);
  }
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
