export interface FileController {
    existsSync(file: string): Promise<boolean>;
    readFileContent(file: string): Promise<string>;
    writeFileContent(absoluteFilePath: string, content: string): Promise<void>;
    getAbsolutePath(relativePath: string): string;
    createDirIfNotExists(absoluteFolderPath: string): Promise<void>;
}