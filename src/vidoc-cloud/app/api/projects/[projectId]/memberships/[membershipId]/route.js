import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import UserRepository from "../../../../../data-access/UserRepository";
import ProjectRepository from "../../../../../data-access/ProjectRepository";
import MembershipRepository from "../../../../../data-access/MembershipRepository";
import Auth0Authentication from "../../../../../utils/Auth0Authentication";

export const GET = async function getMembership(req, { params }) {
  const res = new NextResponse();
  const { projectId, membershipId } = params; // Extracting from route params

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

  if (!project) {
    return NextResponse.json({ error: "Membership not found." }, res, 404);
  }

  // Check if the current user is a member of the project
  if (
    !(await MembershipRepository.isUserMemberOfProject(
      internalUser.id,
      projectId
    ))
  ) {
    return NextResponse.json(
      { error: "Only the admin can update memberships." },
      {
        status: 403
      }
    );
  }

  // Check if the specified membership exists within the project's memberships
  const targetMembership = project.members.find((m) => m.id === membershipId);

  if (targetMembership.length <= 0) {
    return NextResponse.json(
      { error: "Membership not found in this project." },
      {
        status: 404
      }
    );
  }

  return NextResponse.json(targetMembership, res);
};

export const PATCH = async function updateMembership(req, { params }) {
  const res = new NextResponse();
  const { projectId, membershipId } = params; // Extracting from route params
  const { role } = JSON.parse(await req.text()); // Expecting role updates from request body

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

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, res, 404);
  }

  // Check if the current user is the admin of the project
  if (
    !(await MembershipRepository.isUserAdminOfProject(
      internalUser.id,
      projectId
    ))
  ) {
    return NextResponse.json(
      { error: "Only the admin can update memberships." },
      {
        status: 403,
      }
    );
  }

  // Check if the specified membership exists within the project's memberships
  const targetMembership = project.members.find((m) => m.id === membershipId);

  if (!targetMembership) {
    return NextResponse.json(
      { error: "Membership not found in this project." },
      {
        status: 404,
      }
    );
  }

  // Check if we want to change a user to non-admin and if the user is the only admin
  if (
    targetMembership.role === "ADMIN" &&
    role !== "ADMIN" &&
    project.members.filter((m) => m.role === "ADMIN").length <= 1
  ) {
    return NextResponse.json(
      { error: "Cannot change the role of the last admin." },
      {
        status: 400,
      }
    );
  }

  // Update the membership
  const updatedMembership = await MembershipRepository.updateMembership(
    membershipId,
    role
  );

  if (!updatedMembership) {
    return NextResponse.json(
      { error: "Failed to update the membership." },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json(updatedMembership, res);
};

export const DELETE = async function deleteMembership(req, { params }) {
  const res = new NextResponse();
  const { projectId, membershipId } = params;

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

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, res, 404);
  }

  // Check if the current user is the admin of the project
  if (
    !(await MembershipRepository.isUserAdminOfProject(
      internalUser.id,
      projectId
    ))
  ) {
    return NextResponse.json(
      { error: "Only the admin can delete memberships." },
      {
        status: 403,
      }
    );
  }

  // Check if the specified membership exists within the project's memberships
  const targetMembership = project.members.find((m) => m.id === membershipId);

  if (!targetMembership) {
    return NextResponse.json(
      { error: "Membership not found in this project." },
      {
        status: 404,
      }
    );
  }

  // Check if we want to change a user to non-admin and if the user is the only admin
  if (
    targetMembership.role === "ADMIN" &&
    project.members.filter((m) => m.role === "ADMIN").length <= 1
  ) {
    return NextResponse.json(
      {
        error:
          "Cannot remove the last admin from a project. Please make some other member admin or delete the project itself.",
      },
      {
        status: 400,
      }
    );
  }

  // Delete the membership
  const wasDeleted = await MembershipRepository.removeMemberFromProject(
    membershipId
  );

  if (!wasDeleted) {
    return NextResponse.json(
      { error: "Failed to delete the membership." },
      {
        status: 500,
      }
    );
  }

  return NextResponse.json({ message: "Membership deleted successfully" }, res);
};
