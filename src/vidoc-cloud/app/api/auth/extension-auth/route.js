// api/custom-login.js
import { handleLogin, handleAuth } from "@auth0/nextjs-auth0";

/* :vidoc 9e519762-8997-45e2-814c-cdcc20731962.mp4 */
export const GET = handleLogin({
  authorizationParams: {
    redirect_uri: "http://localhost:3000/api/auth/extension-auth/callback",
  },
});
