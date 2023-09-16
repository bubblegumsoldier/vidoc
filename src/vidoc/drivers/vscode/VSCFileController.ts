import { injectable } from "tsyringe";
import { FileController } from "../../interfaces/FileController";
import * as vscode from "vscode";
import * as path from "path";

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

  public async writeFileContent(absoluteFilePath: string, content: string): Promise<void> {
    const intArray = new TextEncoder().encode(content);
    await vscode.workspace.fs.writeFile(this.getFileUri(absoluteFilePath, false), intArray);
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
      await vscode.workspace.fs.readFile(this.getFileUri(file, relative))
    );
  }
  async copyFile(sourceFilePath: string, targetFilePath: string): Promise<void> {
      await vscode.workspace.fs.copy(
        this.getFileUri(sourceFilePath, false),
        this.getFileUri(targetFilePath, false)
      );
  }

  async deleteFile(filePath: string): Promise<void> {
    await vscode.workspace.fs.delete(this.getFileUri(filePath, false));
  }

  async generateTmpFilePath(id: string): Promise<string> {
    const tmpFolder = path.join(this.getWorkspaceRoot(), ".vidoc", "tmp");
    await this.createDirIfNotExists(tmpFolder);
    return path.join(tmpFolder, `${id}.mp4`);
  }

  async moveFile(sourceFilePath: string, targetFilePath: string): Promise<void> {
    await vscode.workspace.fs.rename(
      this.getFileUri(sourceFilePath, false),
      this.getFileUri(targetFilePath, false)
    );
  }
}
