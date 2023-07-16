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
    const returnPath = path.resolve(this.getWorkspaceRoot(), p);
    return returnPath;
  }

  public async writeFileContent(absoluteFilePath: string, content: string): Promise<void> {
    const intArray = new TextEncoder().encode(content);
    await vscode.workspace.fs.writeFile(this.getFileUri(absoluteFilePath), intArray);
  }

  public async createDirIfNotExists(absoluteFolderPath: string)  {
    await vscode.workspace.fs.createDirectory(
      this.getFileUri(absoluteFolderPath)
    );
  }

  private getFileUri(p: string): vscode.Uri {
    return vscode.Uri.file(this.getAbsolutePath(p));
  }

  async existsSync(file: string): Promise<boolean> {
    try {
      return (await vscode.workspace.fs.stat(this.getFileUri(file))).size > 0;
    } catch {
      return false;
    }
  }
  async readFileContent(file: string): Promise<string> {
    return new TextDecoder().decode(
      await vscode.workspace.fs.readFile(this.getFileUri(file))
    );
  }
}
