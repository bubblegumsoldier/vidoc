export interface FileController {
    exists(file: string): Promise<boolean>;
    readFileContent(file: string, relative: boolean): Promise<string>;
    readFileContentBinary(file: string, relative: boolean): Promise<Uint8Array>;
    writeFileContent(filePath: string, content: string, relative: boolean): Promise<void>;
    getAbsolutePath(relativePath: string): string;
    createDirIfNotExists(absoluteFolderPath: string): Promise<void>;
    copyFile(sourceFilePath: string, targetFilePath: string, relative: boolean): Promise<void>;
    moveFile(sourceFilePath: string, targetFilePath: string, relative: boolean): Promise<void>;
    deleteFile(filePath: string, relative: boolean): Promise<void>;
    generateTmpFilePath(id: string): Promise<string>;
    getBinPath(binName: string): Promise<string>;
    getAllFilesInFolder(folderPath: string, relative: boolean): Promise<string[]>;
    cleanupTmp(): Promise<void>;
}