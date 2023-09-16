import { inject, injectable } from "tsyringe";
import { FileController } from "../../interfaces/FileController";
import * as vscode from "vscode";
import * as path from "path";
import { ConfigRetriever } from "../../interfaces/ConfigRetriever";
import { relative } from "node:path/win32";
import { getExtensionPath } from "./global";

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

  public async writeFileContent(filePath: string, content: string, relative: boolean): Promise<void> {
    const intArray = new TextEncoder().encode(content);
    await vscode.workspace.fs.writeFile(this.getFileUri(filePath, relative), intArray);
  }

  public async createDirIfNotExists(absoluteFolderPath: string)  {
    await vscode.workspace.fs.createDirectory(
      this.getFileUri(absoluteFolderPath, false)
    );
  }

  private getFileUri(p: string, relative = true): vscode.Uri {
    const pathFull = relative ? this.getAbsolutePath(p) : p;
    return vscode.Uri.file(pathFull);
  }

  async existsSync(file: string): Promise<boolean> {
    try {
      return (await vscode.workspace.fs.stat(this.getFileUri(file))).size > 0;
    } catch {
      return false;
    }
  }

  async readFileContent(file: string, relative: boolean): Promise<string> {
    return new TextDecoder().decode(
      await this.readFileContentBinary(file, relative)
    );
  }

  async readFileContentBinary(file: string, relative: boolean): Promise<Uint8Array> {
    return await vscode.workspace.fs.readFile(this.getFileUri(file, relative));
  }

  async copyFile(sourceFilePath: string, targetFilePath: string, relative: boolean): Promise<void> {
      await vscode.workspace.fs.copy(
        this.getFileUri(sourceFilePath, relative),
        this.getFileUri(targetFilePath, relative)
      );
  }

  async deleteFile(filePath: string, relative: boolean): Promise<void> {
    await vscode.workspace.fs.delete(this.getFileUri(filePath, relative));
  }

  async generateTmpFilePath(id: string): Promise<string> {
    const absoluteTmpFolder = path.join(this.getWorkspaceRoot(), ".vidoc", "tmp");
    const relativeTmpFolder = ".vidoc/tmp";
    await this.createDirIfNotExists(absoluteTmpFolder);
    return `${relativeTmpFolder}/${id}`;
  }

  async moveFile(sourceFilePath: string, targetFilePath: string, relative: boolean): Promise<void> {
    await vscode.workspace.fs.rename(
      this.getFileUri(sourceFilePath, relative),
      this.getFileUri(targetFilePath, relative)
    );
  }

  async getBinPath(binName: string): Promise<string> {
    return path.join(getExtensionPath(), 'dist', 'bin', binName);
  }
}
