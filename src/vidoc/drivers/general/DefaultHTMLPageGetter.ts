import { inject, injectable } from "tsyringe";
import { HTMLPageGetter } from "../../interfaces/HTMLPageGetter";
import { LocalMetadataLocalVideoVidoc, Vidoc } from "../../model/Vidoc";
import { FileController } from "../../interfaces/FileController";

@injectable()
export class DefaultHTMLPageGetter implements HTMLPageGetter {
  constructor(
    @inject("FileController") private fileController: FileController
  ) {}

  async getHTML(vidoc: Vidoc): Promise<string> {
    const title = vidoc.id;
    const createdAt = vidoc.metadata.createdAt;
    let transcript = ``;
    if (vidoc.speechToText?.text) {
      const text = vidoc.speechToText.text;
      transcript = `<h2>Transcript</h2><p>${text}</p>`;
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            * {
                font-family: sans-serif;
            }
            body {
                background-color: #222;
                color: white;
                padding: 0;
                margin: 0;
                overflow-x: hidden;
            }
            .outer-wrapper {
                display: flex;
                width: 100vw;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .inner-wrapper {
                padding: 20px;
                display: flex;
                flex-flow: column;
            }
            video {
                border-radius: 15px;
                border: 3px solid white;
                max-width: 1200px;
            }
          </style>
        </head>
        <body>
            <div class="outer-wrapper">
              <div class="inner-wrapper">
                <h1>${title}</h1>
                ${transcript}
                <p>Created at: ${createdAt}</p>
                <video controls>
                  <source src="${await this.getSourcePath(vidoc)}" type="video/mp4">
                </video>
              </div>
            </div>
        </body>
      </html>
    `;
  }

  private async getSourcePath(vidoc: Vidoc): Promise<string> {
    if ((<any>vidoc).relativeFilePathToVideo) {
      const castedVidoc = <LocalMetadataLocalVideoVidoc>vidoc;
      // Doesnt work currently for some reason
      return `file://${this.fileController.getAbsolutePath(
        castedVidoc.relativeFilePathToVideo
      )}`;
    }
    if ((<any>vidoc).remoteVideoUrl) {
      return (<any>vidoc).remoteVideoUrl;
    }
    return "";
  }
}
