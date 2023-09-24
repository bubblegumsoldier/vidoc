import { inject, injectable } from "tsyringe";
import * as vscode from "vscode";
import { VideoOpener } from "../../interfaces/VideoOpener";
import { LocalMetadataLocalVideoVidoc, Vidoc } from "../../model/Vidoc";
import { FileController } from "../../interfaces/FileController";
import { VidocFactory } from "../../interfaces/VidocFactory";
import { HTMLPageGetter } from "../../interfaces/HTMLPageGetter";

class VideoScreen {
  public static panel: vscode.WebviewPanel | undefined;

  public static async createOrShow(content: string) {
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

    VideoScreen.panel.webview.html = content;
  }
}

@injectable()
export class VSCVideoOpener implements VideoOpener {
  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("VidocFactory") private vidocFactory: VidocFactory,
    @inject("HTMLPageGetter") private htmlPageGetter: HTMLPageGetter
  ) {}

  async openVideoById(vidocId: string): Promise<void> {
    const vidoc = await this.vidocFactory.initVidocObject(vidocId);
    return await this.openVideo(vidoc);
  }

  async openVideo(vidoc: Vidoc): Promise<void> {
    await VideoScreen.createOrShow(await this.htmlPageGetter.getHTML(vidoc));
  }
}
