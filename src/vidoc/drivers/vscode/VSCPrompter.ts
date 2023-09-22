import { injectable } from "tsyringe";
import { Prompter } from "../../interfaces/Prompter";
import * as vscode from "vscode";

@injectable()
export class VSCPrompter implements Prompter {
  async getAnswer(question: string, options: string[], defaultValue: string): Promise<string|undefined> {
    const selectedOption = await vscode.window.showQuickPick(options, {
      placeHolder: question,
    });

    if (selectedOption) {
      return selectedOption;
    }

    return undefined;
  }
}
