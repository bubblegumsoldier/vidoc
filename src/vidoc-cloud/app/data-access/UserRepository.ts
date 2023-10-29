import prisma from "./prismaClient";
import Auth0Authentication from "../utils/Auth0Authentication";
import { User } from "@prisma/client";

export default class UserRepository {
  public static async getUserById(
    id: string,
    options = {}
  ): Promise<any | undefined> {
    return await prisma.user.findUnique({ where: { id }, ...options });
  }

  public static async getUserByAuth0Id(
    auth0Id: string,
    email: string, // Assume email is provided for the check
    options = {},
    autoCreateIfNotExist = false,
    session = undefined
  ): Promise<any | undefined> {
    // First, check if a UserAuth0Id entry exists with the given auth0Id.
    const auth0Entry = await prisma.userAuth0Id.findUnique({
      where: { auth0Id },
      ...options,
    });

    if (auth0Entry) {
      // Return the associated user.
      return await prisma.user.findUnique({
        where: { id: auth0Entry.userId },
        ...options,
      });
    }

    if (!autoCreateIfNotExist) {
      return null;
    }

    // If here, auth0Id was not found. Check by email.
    const existingUser = await prisma.user.findUnique({
      where: { email },
      ...options,
    });

    if (existingUser) {
      // If user with this email exists, just add a new UserAuth0Id entry.
      await prisma.userAuth0Id.create({
        data: {
          auth0Id,
          userId: existingUser.id,
        },
      });
      return existingUser;
    }

    // If here, a new user needs to be created.
    const newUser = await UserRepository.createUser({
      email: session.user.email || "",
      name: session.user.name,
    });

    // Also create the UserAuth0Id entry.
    await prisma.userAuth0Id.create({
      data: {
        auth0Id,
        userId: newUser.id,
      },
    });

    return newUser;
  }

  public static async createUser(data: any): Promise<User | undefined> {
    return await prisma.user.create({ data });
  }

  public static async getUserByEmail(email: string, options: any = {}) {
    const user = await prisma.user.findUnique({
      where: { email },
      ...options,
    });
    return user;
  }

  public static async getCurrentUser(
    req,
    res,
    options = {}
  ): Promise<User | undefined> {
    const user = await Auth0Authentication.getCurrentUserFromRequest(
      req,
      res
    );
    return user;
  }
}
