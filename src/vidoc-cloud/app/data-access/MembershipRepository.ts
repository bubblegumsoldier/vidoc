import prisma from "./prismaClient";

class MembershipRepository {
  async getProjectMembershipsByUserId(userId) {
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
  async addMemberToProject(userId, projectId, role) {
    if (this.isUserAdminOfProject(userId, projectId)) {
      throw new Error("Only the admin can add members to the project.");
    }

    return await prisma.membership.create({
      data: {
        role,
        userId,
        projectId,
      },
    });
  }

  async removeMemberFromProject(userId, memberId, projectId) {
    if (this.isUserAdminOfProject(userId, projectId)) {
      throw new Error("Only the admin can add members to the project.");
    }

    return await prisma.membership.delete({
      where: { id: memberId },
    });
  }

  async isUserAdminOfProject(userId, projectId) {
    return (
      (await prisma.membership.count({
        where: { userId, role: "ADMIN", projectId },
      })) > 0
    );
  }

  async isUserMemberOfProject(userId, projectId) {
    return (
      (await prisma.membership.count({
        where: { userId, projectId },
      })) > 0
    );
  }
}

const membershipRepo = new MembershipRepository();

module.exports = membershipRepo;
