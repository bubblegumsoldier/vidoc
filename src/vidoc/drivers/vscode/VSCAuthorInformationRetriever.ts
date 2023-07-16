import { injectable } from "tsyringe";
import { AuthorInformationRetriever } from "../../interfaces/AuthorInformationRetriever";
import { AuthorInformation } from "../../model/AuthorInformation";
import * as vscode from 'vscode';


@injectable()
export class VSCAuthorInformationRetriever
  implements AuthorInformationRetriever
{
  async getAuthorInformation(): Promise<AuthorInformation> {
    const gitExtension = vscode.extensions.getExtension("vscode.git");
    if (!gitExtension) {
      console.error("Git extension not found.");
      return undefined;
    }

    const gitApi = gitExtension.exports.getAPI(1);
    const repositories = gitApi.repositories;
    if (!repositories || repositories.length === 0) {
      console.error("No Git repositories found.");
      return undefined;
    }

    // Assuming the first repository is the active one
    const repository = repositories[0];
    const config = repository.config;
    const username = await config?.getValue("user.name");

    if(!username) {
        return undefined;
    }

    return {
        username: username
    };
  }
}
