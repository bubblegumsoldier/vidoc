import { injectable } from "tsyringe";
import { EditorInteractor } from "../../interfaces/EditorInteractor";
import * as vscode from "vscode";
import { EditorPosition } from "../../model/FocusInformation";

@injectable()
export class VSCEditorInteractor implements EditorInteractor {
  async insertStringAtEndOfLine(
    s: string,
    cursorPosition: EditorPosition
  ): Promise<void> {
    const activeEditor = vscode.window.activeTextEditor;
    await activeEditor?.edit((builder) => {
      builder.insert(
        new vscode.Position(cursorPosition.lineIndex, cursorPosition.charIndex),
        s
      );
    });
  }
}
