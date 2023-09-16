import * as vscode from "vscode";
import {
  LocalMetaDataRemoteVideoVidoc,
  LocalMetadataLocalVideoVidoc,
  PositionedVidocInstance,
  Vidoc,
} from "../../model/Vidoc";
import { checkSelectionOverlap } from "../../utils/range";
import { inject, injectable } from "tsyringe";
import { FileController } from "../../interfaces/FileController";

@injectable()
export class VSCHoverProvider {
  constructor(
    @inject("FileController") private fileController: FileController
  ) {}

  public provideHover(
    currentHighlightings: PositionedVidocInstance[],
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ): vscode.Hover | undefined {
    // Check if the hovered position is within the decorated range
    if (!currentHighlightings) {
      return undefined;
    }
    const hoveredRange = document.getWordRangeAtPosition(position);
    if (!hoveredRange) {
      return;
    }
    const hoveredHighlightings = currentHighlightings.filter((decoration) =>
      checkSelectionOverlap(decoration.range, {
        from: {
          lineIndex: hoveredRange.start.line,
          charIndex: hoveredRange.start.character,
          lineContent: "",
        },
        to: {
          lineIndex: hoveredRange.end.line,
          charIndex: hoveredRange.end.character,
          lineContent: "",
        },
        text: "",
      })
    );
    if (hoveredHighlightings.length > 0) {
      // Create and return the hover content
      const vidoc: any = hoveredHighlightings[0].vidoc;
      if (vidoc.relativeFilePathToVideo) {
        const castedVidoc = <LocalMetadataLocalVideoVidoc>vidoc;
        const pathFormatted = this.fileController.getAbsolutePath(castedVidoc.relativeFilePathToVideo).replace('\\', '/');
        console.log(pathFormatted);
        const commandArgs = encodeURIComponent(JSON.stringify([castedVidoc.id]));
        const markdown = new vscode.MarkdownString(
          `
          [Click here for VsCode Preview](command:extension.openVideo?${commandArgs})
          
          [Click here for direct link](${pathFormatted})
          `
        );
        markdown.baseUri = vscode.Uri.file(
          this.fileController.getAbsolutePath("./")
        );

        return new vscode.Hover(
          markdown,
          new vscode.Range(
            new vscode.Position(
              hoveredHighlightings[0].range.from.lineIndex,
              hoveredHighlightings[0].range.from.charIndex
            ),
            new vscode.Position(
              hoveredHighlightings[0].range.to.lineIndex,
              hoveredHighlightings[0].range.to.charIndex
            )
          )
        );
      } else if (vidoc.remoteVideoUrl) {
        const castedVidoc = <LocalMetaDataRemoteVideoVidoc>vidoc;
        const url = castedVidoc.remoteVideoUrl;
        const commandArgs = encodeURIComponent(JSON.stringify([castedVidoc.id]));
        const markdown = new vscode.MarkdownString(
          `
          [Click here for VsCode Preview](command:extension.openVideo?${commandArgs})
          
          [Click here for direct link](${url})
          `
        );
        return new vscode.Hover(
          markdown,
          new vscode.Range(
            new vscode.Position(
              hoveredHighlightings[0].range.from.lineIndex,
              hoveredHighlightings[0].range.from.charIndex
            ),
            new vscode.Position(
              hoveredHighlightings[0].range.to.lineIndex,
              hoveredHighlightings[0].range.to.charIndex
            )
          )
        );
      }
    }
    return undefined;
  }
}
