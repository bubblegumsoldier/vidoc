import prisma from "./prismaClient";

class ProjectRepository {
  async createProject(name, repositoryUrl, creatorId, allowedMemory) {
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

  async getProjectById(id) {
    return await prisma.project.findUnique({
      where: { id },
      include: { members: true },
    });
  }

  async updateProject(projectId, updateData) {
    return await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });
  }

  async deleteProject(projectId) {
    return await prisma.project.delete({
      where: { id: projectId },
    });
  }
}

const projectRepo = new ProjectRepository();

module.exports = projectRepo;
