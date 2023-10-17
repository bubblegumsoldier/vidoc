import prisma from "./prismaClient";

export default class ProjectRepository {
  public static async createProject(name, repositoryUrl, creatorId, allowedMemory) {
    return await prisma.project.create({
      data: {
        name,
        repositoryUrl,
        creatorId,
        allowedMemory,
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
            user: true
          }
        }
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
}
