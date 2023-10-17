import ProjectRepository from "./ProjectRepository";
import { S3Accessor } from "./S3Accessor";

export class ProjectStorage {
  public static async updateUsedStorageOfProject(projectId: string) {
    ProjectRepository.updateProject(projectId, {
        usedMemory: await S3Accessor.getUsedStorageForProject(projectId),
    });
    return ProjectRepository.getProjectById(projectId);
  }
}
