import UserRepository from "../data-access/UserRepository";
import prisma from "../data-access/prismaClient";
import { User, AccessToken } from "@prisma/client";
import crypto from "crypto";

export default class TokenValidation {
  // 3 months
  public static DEFAULT_VALIDITY = 90 * 24 * 60 * 60 * 1000;

  public static async getUserForToken(
    token: string
  ): Promise<User | undefined> {
    const userId = (
      await prisma.accessToken.findUnique({
        where: {
          token,
          validUntil: {
            gt: new Date(), // Ensure the token's validUntil date is greater than the current date/time
          },
        },
      })
    )?.userId;
    if (!userId) {
      return undefined;
    }
    return await UserRepository.getUserById(userId);
  }

  public static async generateNewTokenForUser(
    userId: string
  ): Promise<AccessToken> {
    return await prisma.accessToken.create({
      data: {
        token: TokenValidation.generateRandomAccessTokenString(),
        userId: userId,
        validUntil: TokenValidation.getEndDate(),
      },
    });
  }

  private static getEndDate(): Date {
    let currentDate = new Date(); // Get the current date

    // Add 90 days' worth of milliseconds to the current date
    let newDate = new Date(
      currentDate.getTime() + TokenValidation.DEFAULT_VALIDITY
    );
    return newDate;
  }

  private static generateRandomAccessTokenString(): string {
    return crypto.randomBytes(32).toString("hex");
  }
}
