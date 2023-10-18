// api/custom-login.js
import { handleLogin, handleAuth } from "@auth0/nextjs-auth0";


export const GET = handleLogin({
  authorizationParams: {
    redirect_uri: "http://localhost:3000/api/auth/extension-auth/callback",
  },
});
