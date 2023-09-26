import { injectable } from "tsyringe";
import { Prompter } from "../../interfaces/Prompter";

@injectable()
export class CLIPrompter implements Prompter {
  async getAnswer(
    question: string,
    options: string[],
    defaultValue: string
  ): Promise<string | undefined> {
    return defaultValue;
  }
}
