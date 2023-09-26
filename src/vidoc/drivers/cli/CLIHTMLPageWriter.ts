import { inject, injectable } from "tsyringe";
import { FileController } from "../../interfaces/FileController";
import * as os from "os";
import { HTMLPageOutput, Vidoc } from "../../model/Vidoc";
import path = require("path");
import { HTMLPageGetter } from "../../interfaces/HTMLPageGetter";
import { PageWriter } from "../../interfaces/PageWriter";

@injectable()
export class CLIHTMLPageWriter implements PageWriter {
  constructor(
    @inject("FileController") private fileController: FileController,
    @inject("HTMLPageGetter") private htmlPageGetter: HTMLPageGetter
  ) {}

  async writeHTMLPage(vidoc: Vidoc): Promise<HTMLPageOutput> {
    const id = vidoc.id;
    const folder = os.tmpdir();
    const outPath = path.join(folder, `${id}.html`);
    if (await this.fileController.exists(outPath)) {
      return {
        path: outPath,
        html: await this.fileController.readFileContent(outPath, false),
      };
    }
    const html = await this.htmlPageGetter.getHTML(vidoc);
    await this.fileController.writeFileContent(outPath, html, false);
    return {
      path: outPath,
      html,
    };
  }
}
