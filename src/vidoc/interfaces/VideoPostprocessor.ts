import { Vidoc } from "../model/Vidoc";

export declare type PromptOption = string;

export interface VideoPostprocessor {
    postprocessVidoc(vidoc: Vidoc): Promise<Vidoc>;
}