// app/api/auth/[auth0]/route.js
import { getSession, handleAuth, handleProfile } from "@auth0/nextjs-auth0";
import UserRepository from "../../../data-access/UserRepository";

export const GET = handleAuth({
  async profile(req, res) {
    try {
      const result = await handleProfile(req, res);
      console.log("Getting Profile");
      const session = await getSession(req, res);
      if (!session?.user?.sub) {
        return result;
      }
      // Check with prisma if we have user in DB
      const user = await UserRepository.getUserByAuth0Id(session.user.sub);

      if (!user) {
        // Create user in DB
        await UserRepository.createUser({
          auth0Id: session.user.sub,
          email: session.user.email || "",
          name: session.user.name,
        });
      }

      return result;
    } catch (error) {
      // Add you own custom error logging.
      console.error(error);
      res.status(error.status || 500).end();
    }
  },
});
