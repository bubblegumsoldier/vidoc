import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import UserRepository from "../../data-access/UserRepository";
import MembershipRepository from "../../data-access/MembershipRepository";

export const GET = withApiAuthRequired(async function myApiRoute(req) {
  const res = new NextResponse();
  const internalUser = await UserRepository.getCurrentUser(req, res);
  const memberships = await MembershipRepository.getProjectMembershipsByUserId(
    internalUser.id
  );
  console.log({ memberships });
  return NextResponse.json(memberships, res);
});
