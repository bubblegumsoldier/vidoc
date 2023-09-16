import { Vidoc } from "../model/Vidoc";

export declare type PromptOption = string;

export interface RemoteVideoUploader {
    uploadVideo(vidoc: Vidoc, uploadInformation: any): Promise<string>;
}