import { Config } from "../model/Config";

export interface ConfigRetriever {
    getConfig(): Promise<Config>;
}