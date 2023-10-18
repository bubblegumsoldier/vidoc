import prisma from "./prismaClient";
import { ProjectTier } from "@prisma/client";

class ProjectTierRepository {
  /**
   * Get the first project tier ordered by maxStorageBytes in ascending order.
   */
  static async getFirstProjectTier(): Promise<ProjectTier | null> {
    return await prisma.projectTier.findFirst({
      orderBy: {
        maxStorageBytes: "asc",
      },
    });
  }

  /**
   * Get the "next" project tier based on a given project tier id.
   * If no more tiers exist, it returns undefined.
   */
  static async getNextProjectTierById(
    id: number
  ): Promise<ProjectTier | undefined> {
    // Fetch the current project tier's maxStorageBytes.
    const currentTier = await prisma.projectTier.findUnique({
      where: { id },
      select: { maxStorageBytes: true },
    });

    if (!currentTier) {
      throw new Error(`ProjectTier with id ${id} not found.`);
    }

    // Fetch the next project tier based on maxStorageBytes.
    const nextTier = await prisma.projectTier.findFirst({
      where: {
        maxStorageBytes: {
          gt: currentTier.maxStorageBytes,
        },
      },
      orderBy: {
        maxStorageBytes: "asc",
      },
    });

    return nextTier;
  }

  public static async isOverLimit(projectId) {
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        id: projectId,
      },
      include: {
        tier: true,
      },
    });
    return project.usedMemory > project.tier.maxStorageBytes;
  }
}

export default ProjectTierRepository;
