import { inject, injectable } from "tsyringe";
import * as vscode from "vscode";
import { VideoOpener } from "../../interfaces/VideoOpener";
import { LocalMetadataLocalVideoVidoc, Vidoc } from "../../model/Vidoc";
import { FileController } from "../../interfaces/FileController";
import { VidocFactory } from "../../interfaces/VidocFactory";

class VideoScreen {
  public static panel: vscode.WebviewPanel | undefined;

  public static async createOrShow(vidoc: Vidoc, sourcePath: Promise<string>) {
    if (VideoScreen.panel) {
      VideoScreen.panel.reveal();
    } else {
      VideoScreen.panel = vscode.window.createWebviewPanel(
        "videoScreen",
        "Video Screen",
        vscode.ViewColumn.One,
        {}
      );

      VideoScreen.panel.onDidDispose(() => {
        VideoScreen.panel = undefined;
      });
    }

    const path = await sourcePath;
    VideoScreen.panel.webview.html = VideoScreen.getWebviewContent(vidoc, path);
  }

  private static getWebviewContent(vidoc: Vidoc, sourcePath: string): string {
    const title = vidoc.id;
    const createdAt = vidoc.metadata.createdAt;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Created at: ${createdAt}</p>
          <video controls>
            <source src="${sourcePath}" type="video/mp4">
          </video>
        </body>
      </html>
    `;
  }
}

@injectable()
export class VSCVideoOpener implements VideoOpener {
  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("VidocFactory") private vidocFactory: VidocFactory
  ) {}

  async openVideoById(vidocId: string): Promise<void> {
    const vidoc = await this.vidocFactory.initVidocObject(vidocId);
    return await this.openVideo(vidoc);
  }

  private async getSourcePath(vidoc: Vidoc): Promise<string> {
    if ((<any>vidoc).relativeFilePathToVideo) {
      const castedVidoc = <LocalMetadataLocalVideoVidoc>vidoc;
      return `file://${this.fileController.getAbsolutePath(
        castedVidoc.relativeFilePathToVideo
      )}`;
    }
    if ((<any>vidoc).remoteVideoUrl) {
      return (<any>vidoc).remoteVideoUrl;
    }
    return "";
  }

  async openVideo(vidoc: Vidoc): Promise<void> {
    const sourcePath = this.getSourcePath(vidoc);
    await VideoScreen.createOrShow(vidoc, sourcePath);
  }
}
