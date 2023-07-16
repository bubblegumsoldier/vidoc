import { FocusInformation } from "../model/FocusInformation";
import { PositionedVidocInstance, Vidoc } from "../model/Vidoc";

export interface CodeParserAndWriter {
    getStringForRecordedVidoc(vidocId: string): string;
    parseLineForVidoc(lineContent: string, lineNumber: number): Promise<PositionedVidocInstance[]>;
    getStringToAppend(vidocId: Vidoc): string;
}