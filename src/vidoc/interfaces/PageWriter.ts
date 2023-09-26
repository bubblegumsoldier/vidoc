import { HTMLPageOutput, Vidoc } from "../model/Vidoc";

export interface PageWriter {
    writeHTMLPage(vidoc: Vidoc): Promise<HTMLPageOutput>;
}