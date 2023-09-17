import { SpeechToTextInformation, Vidoc } from "../model/Vidoc";

export interface SpeechToText {
    convertSpeechToText(vidoc: Vidoc): Promise<SpeechToTextInformation>;
}