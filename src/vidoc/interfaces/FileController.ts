export interface FileController {
    existsSync(file: string): Promise<boolean>;
    readFileContent(file: string, relative: boolean): Promise<string>;
    writeFileContent(absoluteFilePath: string, content: string): Promise<void>;
    getAbsolutePath(relativePath: string): string;
    createDirIfNotExists(absoluteFolderPath: string): Promise<void>;
    copyFile(sourceFilePath: string, targetFilePath: string): Promise<void>;
    moveFile(sourceFilePath: string, targetFilePath: string): Promise<void>;
    deleteFile(filePath: string): Promise<void>;
    generateTmpFilePath(id: string): Promise<string>;
}