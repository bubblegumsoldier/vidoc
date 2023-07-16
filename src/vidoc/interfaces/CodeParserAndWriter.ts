import { FocusInformation } from "../model/FocusInformation";
import { Vidoc } from "../model/Vidoc";

export interface CodeParserAndWriter {
    getStringForRecordedVidoc(vidocId: string): string;
    parseLineForVidoc(lineContent: string): Promise<Vidoc[]>;
    getStringToAppend(vidocId: Vidoc): string;
}