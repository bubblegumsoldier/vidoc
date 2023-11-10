import ProjectTierRepository from "./ProjectTierRepository";
import { S3Accessor } from "./S3Accessor";
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
    const project = await prisma.project.create({
      data: {
        name,
        repositoryUrl,
        creatorId,
        tierId,
        usedMemory: 0,
      },
    });
    console.log({
      role: "ADMIN",
      userId: creatorId,
      projectId: project.id,
      name: project.name,
    });
    await prisma.membership.create({
      data: {
        role: "ADMIN",
        userId: creatorId,
        projectId: project.id,
      },
    });
    return ProjectRepository.getProjectById(project.id);
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
    const endDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    await prisma.project.update({
      data: {
        scheduledForDeletion: endDate,
      },
      where: {
        id: projectId,
      },
    });
  }

  public static async isProjectScheduledForDeletion(projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    return project.scheduledForDeletion !== null;
  }

  public static async getProjectUploadLink(projectId, vidocId) {
    if (await ProjectTierRepository.isOverLimit(projectId)) {
      throw new ProjectUpgradeRequiredError(
        "Maximum storage limit of project reached, please upgrade."
      );
    }
    if (await ProjectRepository.isProjectScheduledForDeletion(projectId)) {
      throw new Error(
        "Project scheduled for deletion, cannot upload new files."
      );
    }
    return S3Accessor.createTmpUploadLink(projectId, vidocId);
  }
}
