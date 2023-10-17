import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import UserRepository from "../../../../data-access/UserRepository";
import MembershipRepository from "../../../../data-access/MembershipRepository";
import ProjectRepository from "../../../../data-access/ProjectRepository";

export const GET = withApiAuthRequired(async function getMembershipsOfProject(
  req,
  { params }
) {
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
  return NextResponse.json(project.members, res);
});

export const POST = withApiAuthRequired(async function createMembership(
  req,
  { params }
) {
  const res = new NextResponse();
  const { projectId } = params; // Get projectId from the route
  const { userId, role } = req.body; // Get userId and role from request body

  const internalUser = await UserRepository.getCurrentUser(req, res);

  // Check if the current user is the admin of the project
  if (
    !(await MembershipRepository.isUserAdminOfProject(
      internalUser.id,
      projectId
    ))
  ) {
    return NextResponse.json(
      { error: "Only the admin can add members to the project." },
      res,
      403
    );
  }

  // Check if the user is already a member of the project
  if (await MembershipRepository.isMemberOfProject(userId, projectId)) {
    return NextResponse.json(
      { error: "The user is already a member of this project." },
      res,
      409
    );
  }

  // Create the new membership
  const newMembership = await MembershipRepository.createMembership({
    userId,
    projectId,
    role,
  });

  if (!newMembership) {
    return NextResponse.json(
      { error: "Failed to add the user as a member." },
      res,
      500
    );
  }

  return NextResponse.json(newMembership, res);
});
