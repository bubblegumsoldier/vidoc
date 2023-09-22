import { Vidoc, VidocReference } from "../model/Vidoc";

export interface VidocRepository {
    getAllVidocs(): Promise<Vidoc[]>;
}