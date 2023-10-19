import { getSession } from "@auth0/nextjs-auth0";
import TokenValidation from "./TokenValidation";
import { User } from "@prisma/client";
import UserRepository from "../data-access/UserRepository";

export default class Auth0Authentication {
  public static async getCurrentUserFromRequest(
    req,
    res
  ): Promise<User | undefined> {
    const session = await getSession(req, res);
    if (session?.user?.sub) {
      return UserRepository.getUserByAuth0Id(session.user.sub);
    }

    const accessToken = await Auth0Authentication.getTokenFromRequest(req);
    if (!accessToken) {
      return undefined;
    }
    const user = await TokenValidation.getUserForToken(accessToken);
    return user;
  }

  public static async getTokenFromRequest(req): Promise<string> {
    // Check if the Authorization header exists
    const authHeaderContent = req.headers.get("Authorization");
    if (!authHeaderContent) {
      return undefined;
    }

    // Split the Authorization header by spaces
    const parts = authHeaderContent.split(" ");

    // Check if the header has the expected "Bearer" prefix
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return undefined;
    }

    // Return the token
    return parts[1];
  }
}
