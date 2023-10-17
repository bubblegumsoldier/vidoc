import prisma from './prismaClient';

export default class UserRepository {
    public static async getUserById(id: string) {
        return await prisma.user.findUnique({ where: { id } });
    }

    public static async getUserByAuth0Id(auth0Id: string) {
        return await prisma.user.findUnique({ where: { auth0Id } });
    }

    public static async createUser(data: any) {
        return await prisma.user.create({ data });
    }
}