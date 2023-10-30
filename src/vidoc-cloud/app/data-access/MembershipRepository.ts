import prisma from "./prismaClient";

export default class MembershipRepository {
  public static async getProjectMembershipsByUserId(userId) {
    return await prisma.membership.findMany({
      where: { userId },
      include: {
        project: {
          include: {
            tier: true,
            members: {
              take: 5,
            },
          },
        },
      },
    });
  }
  public static async addMemberToProject(userId, projectId, role) {
    return await prisma.membership.create({
      data: {
        role,
        userId,
        projectId,
      },
    });
  }

  public static async removeMemberFromProject(memberId) {
    return await prisma.membership.delete({
      where: { id: memberId },
    });
  }

  public static async updateMembership(memberId, role) {
    return await prisma.membership.update({
      where: { id: memberId },
      data: { role },
    });
  }

  public static async isUserAdminOfProject(userId, projectId) {
    return (
      (await prisma.membership.count({
        where: { userId, role: "ADMIN", projectId },
      })) > 0
    );
  }

  public static async isUserMemberOfProject(userId, projectId) {
    return (
      (await prisma.membership.count({
        where: { userId, projectId },
      })) > 0
    );
  }
}
