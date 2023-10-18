import ProjectTierRepository from "./ProjectTierRepository";
import { ProjectUpgradeRequiredError } from "./errors";
import prisma from "./prismaClient";
export default class ProjectRepository {
  public static async createProject(
    name: string,
    repositoryUrl: string,
    creatorId: string,
    tierId?: string
  ) {
    if (!tierId) {
      tierId = (await ProjectTierRepository.getFirstProjectTier()).id;
    }
    return await prisma.project.create({
      data: {
        name,
        repositoryUrl,
        creatorId,
        tierId,
        usedMemory: 0,
      },
    });
  }

  public static async getProjectById(id) {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        tier: true,
      },
    });
  }

  public static async updateProject(projectId, updateData) {
    return await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });
  }

  public static async deleteProject(projectId) {
    return await prisma.project.delete({
      where: { id: projectId },
    });
  }

  public static async getProjectUploadLink(projectId, uuid) {
    if (await ProjectTierRepository.isOverLimit(projectId)) {
      throw new ProjectUpgradeRequiredError(
        "Maximum storage limit of project reached, please upgrade."
      );
    }
  }
}
