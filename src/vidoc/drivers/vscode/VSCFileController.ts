import { injectable } from "tsyringe";
import { FileController } from "../../interfaces/FileController";
import * as vscode from "vscode";
import * as path from "path";
import { getExtensionPath } from "./global";
import * as fs from "fs/promises";

@injectable()
export class VSCFileController implements FileController {
    private getWorkspaceRoot(): string {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workspaceRoot) {
            throw Error(
                "No workspace open... cannot use vidoc without any workspace opened."
            );
        }
        return <string>workspaceRoot;
    }

    public getAbsolutePath(p: string) {
        const returnPath = path.join(this.getWorkspaceRoot(), p);
        return returnPath;
    }

    public async writeFileContent(
        filePath: string,
        content: string,
        relative: boolean
    ): Promise<void> {
        const intArray = new TextEncoder().encode(content);
        await vscode.workspace.fs.writeFile(
            this.getFileUri(filePath, relative),
            intArray
        );
    }

    public async createDirIfNotExists(absoluteFolderPath: string) {
        await vscode.workspace.fs.createDirectory(
            this.getFileUri(absoluteFolderPath, false)
        );
    }

    private getFileUri(p: string, relative = true): vscode.Uri {
        const pathFull = relative ? this.getAbsolutePath(p) : p;
        return vscode.Uri.file(pathFull);
    }

    async exists(file: string): Promise<boolean> {
        try {
            return (
                (await vscode.workspace.fs.stat(this.getFileUri(file))).size > 0
            );
        } catch {
            return false;
        }
    }

    async readFileContent(file: string, relative: boolean): Promise<string> {
        return new TextDecoder().decode(
            await this.readFileContentBinary(file, relative)
        );
    }

    async readFileContentBinary(
        file: string,
        relative: boolean
    ): Promise<Uint8Array> {
        return await vscode.workspace.fs.readFile(
            this.getFileUri(file, relative)
        );
    }

    async copyFile(
        sourceFilePath: string,
        targetFilePath: string,
        relative: boolean
    ): Promise<void> {
        await vscode.workspace.fs.copy(
            this.getFileUri(sourceFilePath, relative),
            this.getFileUri(targetFilePath, relative)
        );
    }

    async deleteFile(filePath: string, relative: boolean): Promise<void> {
        await vscode.workspace.fs.delete(this.getFileUri(filePath, relative));
    }

    async generateTmpFilePath(firstTryFilename: string): Promise<string> {
        const workspaceRoot = this.getWorkspaceRoot();
        const absoluteTmpFolder = path.join(workspaceRoot, ".vidoc", "tmp");
        const relativeTmpFolder = ".vidoc/tmp";
        
        const [name, suffix] = firstTryFilename.split(".");

        // Create the directory if it doesn't exist
        await this.createDirIfNotExists(absoluteTmpFolder);

        let counter = 0;
        let filePath = path.join(absoluteTmpFolder, firstTryFilename);
        let relativeFilePath = path.join(relativeTmpFolder, firstTryFilename);

        // Check if the file exists and append a counter if it does
        while (await this.exists(relativeFilePath)) {
            counter++;
            filePath = path.join(absoluteTmpFolder, `${name}-${counter}.${suffix}`);
            relativeFilePath = path.join(relativeTmpFolder, `${name}-${counter}.${suffix}`);
        }

        return relativeFilePath;
    }

    public async cleanupTmp() : Promise<void> {
        const workspaceRoot = this.getWorkspaceRoot();
        const absoluteTmpFolder = path.join(workspaceRoot, ".vidoc", "tmp");
        await fs.rm(absoluteTmpFolder, { recursive: true });
    }

    async moveFile(
        sourceFilePath: string,
        targetFilePath: string,
        relative: boolean
    ): Promise<void> {
        await vscode.workspace.fs.rename(
            this.getFileUri(sourceFilePath, relative),
            this.getFileUri(targetFilePath, relative)
        );
    }

    async getBinPath(binName: string): Promise<string> {
        return path.join(getExtensionPath(), "dist", "bin", binName);
    }

    async getAllFilesInFolder(
        folderPath: string,
        relative: boolean
    ): Promise<string[]> {
        const files = await vscode.workspace.fs.readDirectory(
            this.getFileUri(folderPath, relative)
        );
        return files.map((f) => f[0]);
    }
}
