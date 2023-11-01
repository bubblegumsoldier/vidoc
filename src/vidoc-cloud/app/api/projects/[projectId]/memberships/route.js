import { NextResponse } from "next/server";
import UserRepository from "../../../../data-access/UserRepository";
import MembershipRepository from "../../../../data-access/MembershipRepository";
import ProjectRepository from "../../../../data-access/ProjectRepository";
import Auth0Authentication from "../../../../utils/Auth0Authentication";

export const GET = async function getMembershipsOfProject(req, { params }) {
  const res = new NextResponse();
  const { projectId } = params; // Get projectId from the route

  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    res
  );
  if (!internalUser) {
    return NextResponse.json(
      { error: "Failed to find authenticated user." },
      {
        status: 401
      }
    );
  }
  const project = await ProjectRepository.getProjectById(projectId);
  if (!MembershipRepository.isUserMemberOfProject(internalUser.id, projectId)) {
    return NextResponse.json(
      { error: "Only members can view the project details." },
      {
        status: 403
      }
    );
  }
  return NextResponse.json(project.members, res);
};

export const POST = async function createMembership(req, { params }) {
  const res = new NextResponse();
  const { projectId } = params; // Get projectId from the route
  const { email, role } = JSON.parse(await req.text()); // Get userId and role from request body

  const internalUser = await Auth0Authentication.getCurrentUserFromRequest(
    req,
    res
  );
  if (!internalUser) {
    return NextResponse.json(
      { error: "Failed to find authenticated user." },
      {
        status: 401,
      }
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
      { error: "Only the admin can add members to the project." },
      {
        status: 403,
      }
    );
  }

  const userToAdd = await UserRepository.getUserByEmail(email);
  if (!userToAdd) {
    console.log("User was not found");
    return NextResponse.json(
      { error: "User not found." },
      {
        status: 404,
      }
    );
  }

  // Check if the user is already a member of the project
  if (
    await MembershipRepository.isUserMemberOfProject(userToAdd.id, projectId)
  ) {
    return NextResponse.json(
      { error: "The user is already a member of this project." },
      {
        status: 400,
      }
    );
  }

  // Create the new membership
  const newMembership = await MembershipRepository.addMemberToProject(
    userToAdd.id,
    projectId,
    role,
  );

  if (!newMembership) {
    return NextResponse.json(
      { error: "Failed to add the user as a member." },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(newMembership, res);
};
