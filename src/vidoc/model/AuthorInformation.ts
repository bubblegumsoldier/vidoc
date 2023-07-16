export interface GivenAuthorInformation {
    username?: string;
    fullName?: string;
    email?: string;
}

export declare type AuthorInformation = GivenAuthorInformation|undefined;