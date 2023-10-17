import { getSession } from "@auth0/nextjs-auth0";
import prisma from "./prismaClient";

export default class UserRepository {
  public static async getUserById(id: string, options = {}) {
      return await prisma.user.findUnique({ where: { id }, ...options });
    }
    
    public static async getUserByAuth0Id(auth0Id: string, options = {}) {
        console.log({ where: { auth0Id }, ...options });
        return await prisma.user.findUnique({ where: { auth0Id }, ...options });
  }

  public static async createUser(data: any) {
    return await prisma.user.create({ data });
  }

  public static async getCurrentUser(req, res, options = {}) {
    const session = await getSession(req, res);
    if (!session || !session.user) {
      return null;
    }
    const user = await this.getUserByAuth0Id(session.user.sub, options);
    return user;
  }
}
