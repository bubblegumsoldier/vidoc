export declare type AllowedFileFormats = "mp4";

export interface Config {
  savingStrategy: SavingStrategyLocal;
  recordingOptions: { fileFormat: AllowedFileFormats };
}

export class SavingStrategyLocal {
  type: "local" = "local";
  location: "relative" | "central" = "central";
  folder: string = ".vidoc";
}
