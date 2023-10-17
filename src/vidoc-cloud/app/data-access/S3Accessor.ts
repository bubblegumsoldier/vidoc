import AWS from 'aws-sdk';

export class S3Accessor {
    private static s3: AWS.S3;

    /**
     * Initializer method to set up S3 credentials.
     */
    static initialize() {
        this.s3 = new AWS.S3({
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            endpoint: process.env.S3_ENDPOINT || undefined,  // If not set, AWS is used by default
            region: process.env.S3_REGION,
        });
    }

    /**
     * Calculates and returns the used storage size for a specified project.
     * @param projectId The ID of the project.
     */
    static async getUsedStorageForProject(projectId: string): Promise<number> {
        const list = await this.s3.listObjectsV2({
            Bucket: process.env.S3_BUCKET_NAME!,
            Prefix: projectId + '/',
        }).promise();

        return list.Contents?.reduce((acc, item) => acc + (item.Size || 0), 0) || 0;
    }

    /**
     * Creates a temporary upload link.
     * @param projectId The ID of the project.
     * @param uuid Unique identifier for the file.
     * @param timeout Duration for which the upload link is valid.
     */
    static async createTmpUploadLink(projectId: string, uuid: string, timeout = 3600): Promise<string> {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: `${projectId}/${uuid}.mp4`,
            Expires: timeout,
            ContentType: 'video/mp4',
            ACL: 'public-read'
        };
        return this.s3.getSignedUrl('putObject', params);
    }

    /**
     * Removes unused files for a specified project.
     * @param projectId The ID of the project.
     * @param usedFiles List of used files that should not be deleted.
     */
    static async removeUnusedFilesInProject(projectId: string, usedFiles: string[]): Promise<void> {
        const list = await this.s3.listObjectsV2({
            Bucket: process.env.S3_BUCKET_NAME!,
            Prefix: projectId + '/',
        }).promise();

        const filesToDelete = list.Contents?.filter(item => {
            const itemName = item.Key?.split('/').pop();
            return !usedFiles.includes(itemName!);
        });

        if (filesToDelete && filesToDelete.length) {
            await this.s3.deleteObjects({
                Bucket: process.env.S3_BUCKET_NAME!,
                Delete: {
                    Objects: filesToDelete.map(file => ({ Key: file.Key! }))
                }
            }).promise();
        }
    }
}

// Initialize S3 credentials once the class is imported
S3Accessor.initialize();
