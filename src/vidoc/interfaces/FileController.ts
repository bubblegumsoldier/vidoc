export interface FileController {
    existsSync(file: string): Promise<boolean>;
    readFileContent(file: string): Promise<string>;
    getAbsolutePath(relativePath: string): string;
}