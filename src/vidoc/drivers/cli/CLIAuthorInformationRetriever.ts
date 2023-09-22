import { injectable } from "tsyringe";
import { AuthorInformationRetriever } from "../../interfaces/AuthorInformationRetriever";
import { AuthorInformation } from "../../model/AuthorInformation";

@injectable()
export class CLIAuthorInformationRetriever
  implements AuthorInformationRetriever
{
  async getAuthorInformation(): Promise<AuthorInformation> {
    return {};
  }
}
