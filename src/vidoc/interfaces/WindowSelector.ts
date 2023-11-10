import { RecordingAreaInformation } from "../model/Vidoc";

export interface WindowSelector {
    selectWindow(): Promise<RecordingAreaInformation>;
}