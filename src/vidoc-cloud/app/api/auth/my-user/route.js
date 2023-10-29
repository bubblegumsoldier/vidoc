import Auth0Authentication from "../../../utils/Auth0Authentication";
import { NextResponse } from "next/server";

export const GET = async function getMyUser(req, { params }) {
  const res = new NextResponse();
  const user = await Auth0Authentication.getCurrentUserFromRequest(req, res);
  if (!user) {
    return NextResponse.json(
      { error: "Failed to find authenticated user." },
      res,
      401
    );
  }
  return NextResponse.json(user, res);
};
