import {
  withApiAuthRequired,
  getSession,
  getAccessToken,
} from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import UserRepository from "../../../../data-access/UserRepository";
import TokenValidation from "../../../../utils/TokenValidation";

export const GET = withApiAuthRequired(async (req, res) => {
  const session = await getSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Failed to log in user." }, res, 401);
  }

  const auth0Id = session.user.sub;
  const user = await UserRepository.getUserByAuth0Id(
    auth0Id,
    session.user.email,
    {},
    true,
    session
  );
  const newlyGeneratedAccessToken =
    await TokenValidation.generateNewTokenForUser(user.id);
  if (!newlyGeneratedAccessToken) {
    return NextResponse.json(
      { error: "Failed to generate new token for user." },
      res,
      400
    );
  }
  return NextResponse.redirect(
    `http://localhost:7989/auth/callback?token=${encodeURIComponent(
      newlyGeneratedAccessToken.token
    )}`,
    res,
  );
});
