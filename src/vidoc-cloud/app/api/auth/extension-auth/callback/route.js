import {
  withApiAuthRequired,
  getSession,
  getAccessToken,
} from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

export const GET = withApiAuthRequired(async (req, res) => {
  const { accessToken } = await getAccessToken(req, res);

  return NextResponse.redirect(
    `http://localhost:49392/auth/callback?jwt=${encodeURIComponent(
      accessToken
    )}`
  );
});
