import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import UserRepository from "../../data-access/UserRepository";
import MembershipRepository from "../../data-access/MembershipRepository";
import ProjectRepository from "../../data-access/ProjectRepository"; // Make sure to create and import this
import Auth0Authentication from "../../utils/Auth0Authentication";

export const GET = async function getProjects(req) {
  const res = new NextResponse();

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

  const memberships = await MembershipRepository.getProjectMembershipsByUserId(
    internalUser.id
  );
  const projects = memberships.map((membership) => membership.project);
  return NextResponse.json(projects, res);
};

export const POST = async function createProject(req) {
  const res = new NextResponse();
  const { name, repositoryUrl } = JSON.parse(await req.text());

  if(name.length < 3) {
    return NextResponse.json(
      { error: "Project name must be at least 3 characters long." },
      {
        status: 400
      }
    );
  }

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

  const newProject = await ProjectRepository.createProject(
    name,
    repositoryUrl,
    internalUser.id
  );

  if (!newProject) {
    return NextResponse.json(
      { error: "Failed to create the project." },
      {
        status: 500
      }
    );
  }

  return NextResponse.json(newProject, res);
};
