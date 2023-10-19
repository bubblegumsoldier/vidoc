import { getSession } from "@auth0/nextjs-auth0";
import prisma from "./prismaClient";
import Auth0Authentication from "../utils/Auth0Authentication";
import { User } from "@prisma/client";

export default class UserRepository {
  public static async getUserById(
    id: string,
    options = {}
  ): Promise<User | undefined> {
    return await prisma.user.findUnique({ where: { id }, ...options });
  }

  public static async getUserByAuth0Id(
    auth0Id: string,
    options = {},
    autoCreateIfNotExist = false,
    session = undefined
  ): Promise<User | undefined> {
    console.log({ where: { auth0Id }, ...options });
    const user = await prisma.user.findUnique({
      where: { auth0Id },
      ...options,
    });
    if (!autoCreateIfNotExist) {
      return user;
    }

    if (!user) {
      // Create user in DB
      await UserRepository.createUser({
        auth0Id: session.user.sub,
        email: session.user.email || "",
        name: session.user.name,
      });
    }

    return await prisma.user.findUnique({ where: { auth0Id }, ...options });
  }

  public static async createUser(data: any): Promise<User | undefined> {
    return await prisma.user.create({ data });
  }

  public static async getCurrentUser(
    req,
    res,
    options = {}
  ): Promise<User | undefined> {
    const sessionUser = await Auth0Authentication.getCurrentUserFromRequest(
      req,
      res
    );
    if (!sessionUser) {
      return null;
    }
    const user = await this.getUserByAuth0Id(sessionUser.sub, options);
    return user;
  }
}
