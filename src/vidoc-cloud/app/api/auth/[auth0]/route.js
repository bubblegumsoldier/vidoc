// app/api/auth/[auth0]/route.js
import { getSession, handleAuth, handleProfile } from "@auth0/nextjs-auth0";
import UserRepository from "../../../data-access/UserRepository";

export const GET = handleAuth({
  async profile(req, res) {
    try {
      console.log("Check user in DB")
      const result = await handleProfile(req, res);
      const session = await getSession(req, res);
      if (!session?.user?.sub) {
        return result;
      }
      // Check with prisma if we have user in DB
      console.log('Check if user in DB')
      await UserRepository.getUserByAuth0Id(
        session.user.sub,
        {},
        true,
        session
      );

      return result;
    } catch (error) {
      // Add you own custom error logging.
      console.error(error);
      res.status(error.status || 500).end();
    }
  },
});
