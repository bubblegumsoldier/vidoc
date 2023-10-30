// api/custom-login.js
import { handleLogin } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";

/* :vidoc 9e519762-8997-45e2-814c-cdcc20731962.mp4 */
export const GET = async function (req) {
  req.url(); // Necessary for static rendering for some reason
  const result = await handleLogin({
    authorizationParams: {
      redirect_uri: "http://localhost:3000/api/auth/extension-auth/callback",
    },
  })(req);
  return {...new NextResponse(), ...result};
} 
