import { AuthorInformation } from "../model/AuthorInformation";

export interface AuthorInformationRetriever {
    getAuthorInformation(): Promise<AuthorInformation>;
}