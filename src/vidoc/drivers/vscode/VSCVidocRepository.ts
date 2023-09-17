import { inject, injectable } from "tsyringe";
import { VidocRepository } from "../../interfaces/VidocRepository";
import { VidocFactory } from "../../interfaces/VidocFactory";
import { FileController } from "../../interfaces/FileController";
import { Vidoc, VidocReference } from "../../model/Vidoc";
import * as vscode from "vscode";

@injectable()
export class VSCVidocRepository implements VidocRepository {
  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("VidocFactory") private vidocFactory: VidocFactory
  ) {}

  async getAllVidocs(): Promise<Vidoc[]> {
    const rootFilePath = ".vidoc";
    const vidocFilePaths = await this.fileController.getAllFilesInFolder(
      rootFilePath,
      true
    );
    const vidocIds = vidocFilePaths.filter((path) => path.endsWith(".json"));
    return await Promise.all(
      vidocIds.map((vidocId) => this.vidocFactory.initVidocObject(vidocId))
    );
  }

  async getOccurancesForVidoc(vidocId: string): Promise<VidocReference[]> {
    const vidoc = await this.vidocFactory.initVidocObject(vidocId);

    const pattern = new vscode.RelativePattern(
      vscode.workspace.workspaceFolders![0],
      "**/*"
    );
    const uris = await vscode.workspace.findFiles(pattern, null);
    const query = `:vidoc ${vidocId}`;

    const references: VidocReference[] = [];

    const promises = uris.map(async (uri) => {
      const document = await vscode.workspace.openTextDocument(uri);
      const text = document.getText();

      if (text.includes(query)) {
        const lines = text.split("\n");
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
          const charIndex = lines[lineIndex].indexOf(query);
          if (charIndex !== -1) {
            references.push({
              relativeFilePath: vscode.workspace.asRelativePath(uri),
              vidoc,
              editorPosition: {
                lineIndex,
                charIndex,
                lineContent: lines[lineIndex],
              },
            });
          }
        }
      }
    });

    await Promise.all(promises);
    return references;
  }
}
