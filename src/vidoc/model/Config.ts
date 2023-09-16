export declare type AllowedFileFormats = "mp4";

export interface Config {
  savingStrategy: SavingStrategyLocal | SavingStrategyRemote;
  recordingOptions: { fileFormat: AllowedFileFormats };
}

export class SavingStrategyLocal {
  type = "local" as const;
  location: "relative" | "central" = "central";
  folder: string = ".vidoc";
}

export class SavingStrategyRemote {
  type = "remote" as const;

}