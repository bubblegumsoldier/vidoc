import { Config } from "../../../model/Config";

export const DEFAULT_CONFIG: Config = {
    savingStrategy: {
        type: 'local',
        folder: '.vidoc'
    },
    recordingOptions: {
        fileFormat: 'mp4'
    }
};