import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import UserRepository from "../../data-access/UserRepository";
import MembershipRepository from "../../data-access/MembershipRepository";
import ProjectRepository from "../../data-access/ProjectRepository"; // Make sure to create and import this

export const GET = withApiAuthRequired(async function getProjects(req) {
  const res = new NextResponse();
  const internalUser = await UserRepository.getCurrentUser(req, res);
  const memberships = await MembershipRepository.getProjectMembershipsByUserId(
    internalUser.id
  );
  const projects = memberships.map((membership) => membership.project);
  return NextResponse.json(projects, res);
});

export const POST = withApiAuthRequired(async function createProject(req) {
  const res = new NextResponse();
  const { name, repositoryUrl } = req.body;

  const internalUser = await UserRepository.getCurrentUser(req, res);

  const newProject = await ProjectRepository.createProject({
    name,
    repositoryUrl,
    allowedMemory: 5e9, //5 GB
    creatorId: internalUser.id,
  });

  if (!newProject) {
    return NextResponse.json(
      { error: "Failed to create the project." },
      res,
      500
    );
  }

  return NextResponse.json(newProject, res);
});
